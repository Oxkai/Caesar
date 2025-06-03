// Complete P2P NFT-backed lending contract for Sui
module lending::loan {
    use sui::object::UID;
    use sui::coin::Coin;
    use sui::clock::Clock;
    use sui::balance::Balance;
    use sui::sui::SUI;
    use std::option::Option;

    // Error codes
    const E_INVALID_STATE: u64 = 0;
    const E_UNAUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_AMOUNT: u64 = 2;
    const E_LOAN_NOT_EXPIRED: u64 = 3;
    const E_INVALID_LTV: u64 = 4;
    const E_ZERO_AMOUNT: u64 = 5;

    // Constants
    const MAX_LTV: u64 = 80; // 80% maximum LTV
    const SECONDS_PER_YEAR: u64 = 31536000; // 365 * 24 * 60 * 60
    const BASIS_POINTS: u64 = 10000;

    /// Loan states
    public enum LoanState has copy, store, drop {
        Open,      // Waiting for lender
        Active,    // Loan is active
        Repaid,    // Loan repaid successfully
        Defaulted, // Loan defaulted, collateral claimed
    }

    /// Generic NFT wrapper for collateral
    public struct CollateralNFT<T: key + store> has key, store {
        id: UID,
        nft: T,
        appraised_value: u64,
        appraisal_timestamp: u64,
    }

    /// Core loan structure with proper collateral escrowing
    public struct Loan<T: key + store> has key, store {
        id: UID,
        borrower: address,
        lender: Option<address>,
        
        // Loan terms
        principal: u64,
        interest_rate: u64, // Annual interest rate in basis points (e.g., 1000 = 10%)
        duration: u64,      // Loan duration in seconds
        
        // Collateral
        collateral: Option<CollateralNFT<T>>,
        ltv_ratio: u64,     // Loan-to-Value ratio in basis points
        
        // Timing
        created_at: u64,
        funded_at: Option<u64>,
        due_date: Option<u64>,
        
        // Financial
        total_repayment: u64,
        escrow_balance: Balance<SUI>,
        
        // State
        state: LoanState,
    }

    /// Events
    public struct LoanCreated has copy, drop {
        loan_id: sui::object::ID,
        borrower: address,
        principal: u64,
        interest_rate: u64,
        duration: u64,
        collateral_value: u64,
        ltv_ratio: u64,
    }

    public struct LoanFunded has copy, drop {
        loan_id: sui::object::ID,
        lender: address,
        funded_at: u64,
        due_date: u64,
        total_repayment: u64,
    }

    public struct LoanRepaid has copy, drop {
        loan_id: sui::object::ID,
        repaid_at: u64,
        amount: u64,
    }

    public struct LoanDefaulted has copy, drop {
        loan_id: sui::object::ID,
        defaulted_at: u64,
        collateral_claimed_by: address,
    }

    /// Create a loan request with NFT collateral as shared object
    /// This creates a shared loan that any lender can fund
    public fun create_loan_request<T: key + store>(
        nft: T,
        appraised_value: u64,
        principal: u64,
        interest_rate: u64, // Annual rate in basis points
        duration: u64,      // Duration in seconds
        clock: &Clock,
        ctx: &mut sui::tx_context::TxContext
    ) {
        // Validate inputs
        assert!(principal > 0, E_ZERO_AMOUNT);
        assert!(appraised_value > 0, E_ZERO_AMOUNT);
        assert!(interest_rate > 0 && interest_rate <= 5000, E_INVALID_LTV); // Max 50% annual
        assert!(duration > 0, E_ZERO_AMOUNT);
        
        let ltv_ratio = (principal * BASIS_POINTS) / appraised_value;
        assert!(ltv_ratio <= MAX_LTV * 100, E_INVALID_LTV); // Convert to basis points
        
        let borrower = sui::tx_context::sender(ctx);
        let loan_id = sui::object::new(ctx);
        let created_at = sui::clock::timestamp_ms(clock);
        
        // Wrap NFT as collateral
        let collateral = CollateralNFT<T> {
            id: sui::object::new(ctx),
            nft,
            appraised_value,
            appraisal_timestamp: created_at,
        };
        
        let loan = Loan<T> {
            id: loan_id,
            borrower,
            lender: std::option::none(),
            principal,
            interest_rate,
            duration,
            collateral: std::option::some(collateral),
            ltv_ratio,
            created_at,
            funded_at: std::option::none(),
            due_date: std::option::none(),
            total_repayment: 0,
            escrow_balance: sui::balance::zero(),
            state: LoanState::Open,
        };
        
        sui::event::emit(LoanCreated {
            loan_id: sui::object::id(&loan),
            borrower,
            principal,
            interest_rate,
            duration,
            collateral_value: appraised_value,
            ltv_ratio,
        });
        
        // Share the loan object so it becomes publicly accessible
        // This enables P2P lending where any lender can fund the loan
        sui::transfer::public_share_object(loan);
    }

    /// Lender funds the loan
    public fun fund_loan<T: key + store>(
        loan: &mut Loan<T>,
        mut payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut sui::tx_context::TxContext
    ) {
        // Validate loan state and payment
        assert!(loan.state == LoanState::Open, E_INVALID_STATE);
        assert!(std::option::is_none(&loan.lender), E_UNAUTHORIZED);
        assert!(sui::coin::value(&payment) >= loan.principal, E_INSUFFICIENT_AMOUNT);
        
        let lender = sui::tx_context::sender(ctx);
        let now = sui::clock::timestamp_ms(clock);
        let due_date = now + (loan.duration * 1000); // Convert to milliseconds
        
        // Calculate total repayment amount
        let interest_amount = calculate_interest(loan.principal, loan.interest_rate, loan.duration);
        let total_repayment = loan.principal + interest_amount;
        
        // Transfer principal to borrower
        let principal_coin = sui::coin::split(&mut payment, loan.principal, ctx);
        sui::transfer::public_transfer(principal_coin, loan.borrower);
        
        // Store any excess payment in escrow
        let payment_balance = sui::coin::into_balance(payment);
        sui::balance::join(&mut loan.escrow_balance, payment_balance);
        
        // Update loan state
        loan.lender = std::option::some(lender);
        loan.funded_at = std::option::some(now);
        loan.due_date = std::option::some(due_date);
        loan.total_repayment = total_repayment;
        loan.state = LoanState::Active;
        
        sui::event::emit(LoanFunded {
            loan_id: sui::object::id(loan),
            lender,
            funded_at: now,
            due_date,
            total_repayment,
        });
    }

    /// Borrower repays the loan
    #[allow(lint(self_transfer))]
    public fun repay_loan<T: key + store>(
        loan: &mut Loan<T>,
        mut repayment: Coin<SUI>,
        ctx: &mut sui::tx_context::TxContext
    ) {
        let borrower = sui::tx_context::sender(ctx);
        
        // Validate repayment
        assert!(loan.state == LoanState::Active, E_INVALID_STATE);
        assert!(borrower == loan.borrower, E_UNAUTHORIZED);
        assert!(sui::coin::value(&repayment) >= loan.total_repayment, E_INSUFFICIENT_AMOUNT);
        
        let lender = *std::option::borrow(&loan.lender);
        
        // Transfer repayment to lender
        let repayment_amount = sui::coin::split(&mut repayment, loan.total_repayment, ctx);
        sui::transfer::public_transfer(repayment_amount, lender);
        
        // Return any excess to borrower
        if (sui::coin::value(&repayment) > 0) {
            sui::transfer::public_transfer(repayment, borrower);
        } else {
            sui::coin::destroy_zero(repayment);
        };
        
        // Return escrow balance to lender if any
        if (sui::balance::value(&loan.escrow_balance) > 0) {
            let escrow_coin = sui::coin::from_balance(
                sui::balance::withdraw_all(&mut loan.escrow_balance), 
                ctx
            );
            sui::transfer::public_transfer(escrow_coin, lender);
        };
        
        // Return NFT collateral to borrower
        let CollateralNFT { id, nft, appraised_value: _, appraisal_timestamp: _ } = 
            std::option::extract(&mut loan.collateral);
        sui::object::delete(id);
        sui::transfer::public_transfer(nft, borrower);
        
        loan.state = LoanState::Repaid;
        
        sui::event::emit(LoanRepaid {
            loan_id: sui::object::id(loan),
            repaid_at: sui::tx_context::epoch_timestamp_ms(ctx),
            amount: loan.total_repayment,
        });
    }

    /// Lender claims defaulted collateral
    public fun claim_defaulted_collateral<T: key + store>(
        loan: &mut Loan<T>,
        clock: &Clock,
        ctx: &mut sui::tx_context::TxContext
    ) {
        let caller = sui::tx_context::sender(ctx);
        let lender = *std::option::borrow(&loan.lender);
        
        // Validate claim
        assert!(loan.state == LoanState::Active, E_INVALID_STATE);
        assert!(caller == lender, E_UNAUTHORIZED);
        
        let now = sui::clock::timestamp_ms(clock);
        let due_date = *std::option::borrow(&loan.due_date);
        assert!(now > due_date, E_LOAN_NOT_EXPIRED);
        
        // Transfer collateral NFT to lender
        let CollateralNFT { id, nft, appraised_value: _, appraisal_timestamp: _ } = 
            std::option::extract(&mut loan.collateral);
        sui::object::delete(id);
        sui::transfer::public_transfer(nft, lender);
        
        // Transfer any escrow balance to lender
        if (sui::balance::value(&loan.escrow_balance) > 0) {
            let escrow_coin = sui::coin::from_balance(
                sui::balance::withdraw_all(&mut loan.escrow_balance), 
                ctx
            );
            sui::transfer::public_transfer(escrow_coin, lender);
        };
        
        loan.state = LoanState::Defaulted;
        
        sui::event::emit(LoanDefaulted {
            loan_id: sui::object::id(loan),
            defaulted_at: now,
            collateral_claimed_by: lender,
        });
    }

    /// Calculate interest amount
    fun calculate_interest(principal: u64, annual_rate: u64, duration: u64): u64 {
        // Simple interest calculation: P * r * t
        // Where: P = principal, r = annual rate (in basis points), t = time (in years)
        let annual_interest = (principal * annual_rate) / BASIS_POINTS;
        (annual_interest * duration) / SECONDS_PER_YEAR
    }

    // View functions
    public fun get_loan_details<T: key + store>(loan: &Loan<T>): (
        address, // borrower
        Option<address>, // lender
        u64, // principal
        u64, // interest_rate
        u64, // duration
        u64, // ltv_ratio
        u64, // total_repayment
        LoanState // state
    ) {
        (
            loan.borrower,
            loan.lender,
            loan.principal,
            loan.interest_rate,
            loan.duration,
            loan.ltv_ratio,
            loan.total_repayment,
            loan.state
        )
    }

    public fun get_collateral_value<T: key + store>(loan: &Loan<T>): u64 {
        if (std::option::is_some(&loan.collateral)) {
            let collateral = std::option::borrow(&loan.collateral);
            collateral.appraised_value
        } else {
            0
        }
    }

    public fun is_loan_expired<T: key + store>(loan: &Loan<T>, clock: &Clock): bool {
        if (loan.state != LoanState::Active) {
            return false
        };
        
        if (std::option::is_none(&loan.due_date)) {
            return false
        };
        
        let now = sui::clock::timestamp_ms(clock);
        let due_date = *std::option::borrow(&loan.due_date);
        now > due_date
    }

    // Clean up function for completed loans
    public fun destroy_completed_loan<T: key + store>(loan: Loan<T>) {
        let Loan {
            id,
            borrower: _,
            lender: _,
            principal: _,
            interest_rate: _,
            duration: _,
            collateral,
            ltv_ratio: _,
            created_at: _,
            funded_at: _,
            due_date: _,
            total_repayment: _,
            escrow_balance,
            state,
        } = loan;
        
        // Ensure loan is in a final state
        assert!(state == LoanState::Repaid || state == LoanState::Defaulted, E_INVALID_STATE);
        
        // Ensure no collateral remains
        assert!(std::option::is_none(&collateral), E_INVALID_STATE);
        
        // Ensure no escrow balance remains
        assert!(sui::balance::value(&escrow_balance) == 0, E_INVALID_STATE);
        
        sui::object::delete(id);
        std::option::destroy_none(collateral);
        sui::balance::destroy_zero(escrow_balance);
    }

    #[test_only]
    public fun test_calculate_interest(): u64 {
        // Test: 1000 SUI principal, 10% annual rate, 1 year duration
        calculate_interest(1000000000, 1000, SECONDS_PER_YEAR) // 100 SUI
    }
}