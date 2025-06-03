module PropertyInvestment::property_investment {
    use sui::object;
    use sui::coin;
    use sui::sui::SUI;
    use sui::tx_context;
    use sui::transfer;
    use sui::balance;

    /// Error codes
    const ENotOwner: u64 = 0;
    const ENotOwnerOfFractional: u64 = 1;
    const EInsufficientFunds: u64 = 2;
    const EInvalidAmount: u64 = 3;

    /// Represents a property as an NFT object
    public struct PropertyNFT has key, store {
        id: object::UID,
        name: vector<u8>,
        description: vector<u8>,
        address: vector<u8>,
        valuation: u64,
        api_percent: u64,
        total_invested: u64,
        shareholders: u64,
        owner: address,
        vault: balance::Balance<SUI>, // Store invested funds
    }

    /// Represents a fractional ownership object
    public struct FractionalOwnership has key, store {
        id: object::UID,
        property_id: address, // Use address instead of UID for reference
        owner: address,
        amount: u64,
    }

    /// Create a new Property NFT
    public entry fun create_property(
        name: vector<u8>,
        description: vector<u8>,
        address_info: vector<u8>,
        valuation: u64,
        api_percent: u64,
        ctx: &mut tx_context::TxContext
    ) {
        let property = PropertyNFT {
            id: object::new(ctx),
            name,
            description,
            address: address_info,
            valuation,
            api_percent,
            total_invested: 0,
            shareholders: 0,
            owner: tx_context::sender(ctx),
            vault: balance::zero<SUI>(),
        };
        
        transfer::share_object(property);
    }

    /// Invest into a property and get fractional ownership
    public entry fun invest(
        property: &mut PropertyNFT,
        mut payment: coin::Coin<SUI>,
        amount: u64,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        assert!(coin::value(&payment) >= amount, EInsufficientFunds);

        let property_address = object::uid_to_address(&property.id);
        let owner_addr = tx_context::sender(ctx);
        
        // Split the exact amount needed for investment
        let invest_coin = coin::split(&mut payment, amount, ctx);
        
        // Add to property vault
        let invest_balance = coin::into_balance(invest_coin);
        balance::join(&mut property.vault, invest_balance);

        // Update property investment stats
        property.total_invested = property.total_invested + amount;
        property.shareholders = property.shareholders + 1;

        // Create fractional ownership object for user
        let fractional = FractionalOwnership {
            id: object::new(ctx),
            property_id: property_address,
            owner: owner_addr,
            amount: amount,
        };

        // Transfer fractional ownership object to user
        transfer::public_transfer(fractional, owner_addr);
        
        // Return remaining payment to sender
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, owner_addr);
        } else {
            coin::destroy_zero(payment);
        };
    }

    /// Redeem fractional ownership and return invested amount
    public entry fun redeem(
        property: &mut PropertyNFT,
        ownership: FractionalOwnership,
        ctx: &mut tx_context::TxContext
    ) {
        let owner_addr = tx_context::sender(ctx);
        assert!(ownership.owner == owner_addr, ENotOwnerOfFractional);
        assert!(ownership.property_id == object::uid_to_address(&property.id), ENotOwner);

        let FractionalOwnership { id, property_id: _, owner: _, amount } = ownership;
        object::delete(id);

        // Update property stats
        property.total_invested = property.total_invested - amount;
        property.shareholders = property.shareholders - 1;

        // Return invested amount from vault
        let refund_balance = balance::split(&mut property.vault, amount);
        let refund_coin = coin::from_balance(refund_balance, ctx);
        
        // Transfer refund to user
        transfer::public_transfer(refund_coin, owner_addr);
    }

    /// Update property valuation (only property owner can do this)
    public entry fun update_valuation(
        property: &mut PropertyNFT,
        new_valuation: u64,
        ctx: &mut tx_context::TxContext
    ) {
        let caller = tx_context::sender(ctx);
        assert!(caller == property.owner, ENotOwner);
        property.valuation = new_valuation;
    }

    /// Get property information (view function)
    public fun get_property_info(property: &PropertyNFT): (vector<u8>, u64, u64, u64, u64) {
        (property.name, property.valuation, property.api_percent, property.total_invested, property.shareholders)
    }

    /// Get fractional ownership info (view function)
    public fun get_ownership_info(ownership: &FractionalOwnership): (address, u64) {
        (ownership.owner, ownership.amount)
    }

    /// Calculate returns based on API percentage (view function)
    public fun calculate_returns(property: &PropertyNFT, investment_amount: u64): u64 {
        (investment_amount * property.api_percent) / 100
    }
}