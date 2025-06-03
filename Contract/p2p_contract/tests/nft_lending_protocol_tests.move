// // Test module for P2P NFT-backed lending on Sui
// #[test_only]
// module lending::loan_tests {
//     use lending::loan::{Self, Loan, LoanState, CollateralNFT};
//     use sui::test_scenario::{Self as ts, Scenario};
//     use sui::coin::{Self, Coin};
//     use sui::sui::SUI;
//     use sui::clock::{Self, Clock};
//     use sui::test_utils;
//     use std::option;

//     // Test NFT structure
//     public struct TestNFT has key, store {
//         id: sui::object::UID,
//         name: std::string::String,
//         description: std::string::String,
//     }

//     // Test addresses
//     const BORROWER: address = @0xA;
//     const LENDER: address = @0xB;
//     const THIRD_PARTY: address = @0xC;

//     // Test constants
//     const PRINCIPAL_AMOUNT: u64 = 1000_000_000_000; // 1000 SUI
//     const COLLATERAL_VALUE: u64 = 2000_000_000_000; // 2000 SUI
//     const INTEREST_RATE: u64 = 1000; // 10% annual
//     const LOAN_DURATION: u64 = 31536000; // 1 year in seconds
//     const ONE_DAY: u64 = 86400000; // 1 day in milliseconds

//     fun create_test_nft(ctx: &mut sui::tx_context::TxContext): TestNFT {
//         TestNFT {
//             id: sui::object::new(ctx),
//             name: std::string::utf8(b"Test NFT"),
//             description: std::string::utf8(b"A test NFT for lending"),
//         }
//     }

//     fun setup_scenario(): Scenario {
//         ts::begin(BORROWER)
//     }

//     #[test]
//     fun test_create_loan_request() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create clock
//         let clock = clock::create_for_testing(ctx);
//         clock::set_for_testing(&mut clock, 1000000); // Set timestamp
        
//         // Create NFT and loan request
//         let nft = create_test_nft(ctx);
//         let loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         // Verify loan details
//         let (borrower, lender, principal, interest_rate, duration, ltv_ratio, total_repayment, state) = 
//             loan::get_loan_details(&loan);
        
//         assert!(borrower == BORROWER, 0);
//         assert!(option::is_none(&lender), 1);
//         assert!(principal == PRINCIPAL_AMOUNT, 2);
//         assert!(interest_rate == INTEREST_RATE, 3);
//         assert!(duration == LOAN_DURATION, 4);
//         assert!(ltv_ratio == 5000, 5); // 50% LTV (1000/2000 * 10000)
//         assert!(total_repayment == 0, 6); // Not calculated until funded
//         assert!(state == loan::LoanState::Open, 7);
        
//         // Verify collateral value
//         let collateral_value = loan::get_collateral_value(&loan);
//         assert!(collateral_value == COLLATERAL_VALUE, 8);
        
//         // Clean up
//         ts::return_to_sender(&scenario, loan);
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     fun test_fund_loan() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create clock and loan
//         let clock = clock::create_for_testing(ctx);
//         clock::set_for_testing(&mut clock, 1000000);
        
//         let nft = create_test_nft(ctx);
//         let mut loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         // Switch to lender
//         ts::next_tx(&mut scenario, LENDER);
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create payment coin
//         let payment = coin::mint_for_testing<SUI>(PRINCIPAL_AMOUNT, ctx);
        
//         // Fund the loan
//         loan::fund_loan(&mut loan, payment, &clock, ctx);
        
//         // Verify loan state after funding
//         let (_, lender, _, _, _, _, total_repayment, state) = 
//             loan::get_loan_details(&loan);
        
//         assert!(option::is_some(&lender), 0);
//         assert!(*option::borrow(&lender) == LENDER, 1);
//         assert!(total_repayment > PRINCIPAL_AMOUNT, 2); // Should include interest
//         assert!(state == loan::LoanState::Active, 3);
        
//         // Clean up
//         ts::return_to_sender(&scenario, loan);
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     fun test_repay_loan() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create and fund loan
//         let clock = clock::create_for_testing(ctx);
//         clock::set_for_testing(&mut clock, 1000000);
        
//         let nft = create_test_nft(ctx);
//         let mut loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         // Fund loan as lender
//         ts::next_tx(&mut scenario, LENDER);
//         let ctx = ts::ctx(&mut scenario);
//         let payment = coin::mint_for_testing<SUI>(PRINCIPAL_AMOUNT, ctx);
//         loan::fund_loan(&mut loan, payment, &clock, ctx);
        
//         let (_, _, _, _, _, _, total_repayment, _) = loan::get_loan_details(&loan);
        
//         // Repay loan as borrower
//         ts::next_tx(&mut scenario, BORROWER);
//         let ctx = ts::ctx(&mut scenario);
//         let repayment = coin::mint_for_testing<SUI>(total_repayment, ctx);
//         loan::repay_loan(&mut loan, repayment, ctx);
        
//         // Verify loan state after repayment
//         let (_, _, _, _, _, _, _, state) = loan::get_loan_details(&loan);
//         assert!(state == loan::LoanState::Repaid, 0);
        
//         // Verify collateral is returned (value should be 0)
//         let collateral_value = loan::get_collateral_value(&loan);
//         assert!(collateral_value == 0, 1);
        
//         // Clean up
//         ts::return_to_sender(&scenario, loan);
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     fun test_claim_defaulted_collateral() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create and fund loan
//         let mut clock = clock::create_for_testing(ctx);
//         clock::set_for_testing(&mut clock, 1000000);
        
//         let nft = create_test_nft(ctx);
//         let mut loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         // Fund loan
//         ts::next_tx(&mut scenario, LENDER);
//         let ctx = ts::ctx(&mut scenario);
//         let payment = coin::mint_for_testing<SUI>(PRINCIPAL_AMOUNT, ctx);
//         loan::fund_loan(&mut loan, payment, &clock, ctx);
        
//         // Fast forward time past loan expiry
//         clock::set_for_testing(&mut clock, 1000000 + (LOAN_DURATION * 1000) + ONE_DAY);
        
//         // Verify loan is expired
//         assert!(loan::is_loan_expired(&loan, &clock), 0);
        
//         // Claim defaulted collateral
//         loan::claim_defaulted_collateral(&mut loan, &clock, ctx);
        
//         // Verify loan state
//         let (_, _, _, _, _, _, _, state) = loan::get_loan_details(&loan);
//         assert!(state == loan::LoanState::Defaulted, 1);
        
//         // Verify collateral is claimed (value should be 0)
//         let collateral_value = loan::get_collateral_value(&loan);
//         assert!(collateral_value == 0, 2);
        
//         // Clean up
//         ts::return_to_sender(&scenario, loan);
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     fun test_destroy_completed_loan() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create, fund, and repay loan
//         let clock = clock::create_for_testing(ctx);
//         clock::set_for_testing(&mut clock, 1000000);
        
//         let nft = create_test_nft(ctx);
//         let mut loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         // Fund and repay loan
//         ts::next_tx(&mut scenario, LENDER);
//         let ctx = ts::ctx(&mut scenario);
//         let payment = coin::mint_for_testing<SUI>(PRINCIPAL_AMOUNT, ctx);
//         loan::fund_loan(&mut loan, payment, &clock, ctx);
        
//         let (_, _, _, _, _, _, total_repayment, _) = loan::get_loan_details(&loan);
        
//         ts::next_tx(&mut scenario, BORROWER);
//         let ctx = ts::ctx(&mut scenario);
//         let repayment = coin::mint_for_testing<SUI>(total_repayment, ctx);
//         loan::repay_loan(&mut loan, repayment, ctx);
        
//         // Destroy completed loan
//         loan::destroy_completed_loan(loan);
        
//         // If we reach here without error, the test passed
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     fun test_interest_calculation() {
//         // Test the interest calculation function
//         let interest = loan::test_calculate_interest();
//         // For 1000 SUI principal, 10% annual rate, 1 year = 100 SUI interest
//         assert!(interest == 100_000_000_000, 0); // 100 SUI in mist
//     }

//     #[test]
//     #[expected_failure(abort_code = lending::loan::E_INVALID_LTV)]
//     fun test_invalid_ltv_ratio() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         let clock = clock::create_for_testing(ctx);
//         let nft = create_test_nft(ctx);
        
//         // Try to create loan with LTV > 80%
//         let _loan = loan::create_loan_request<TestNFT>(
//             nft,
//             1000_000_000_000, // 1000 SUI collateral
//             900_000_000_000,  // 900 SUI principal (90% LTV)
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     #[expected_failure(abort_code = lending::loan::E_ZERO_AMOUNT)]
//     fun test_zero_principal() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         let clock = clock::create_for_testing(ctx);
//         let nft = create_test_nft(ctx);
        
//         // Try to create loan with zero principal
//         let _loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             0, // Zero principal
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     #[expected_failure(abort_code = lending::loan::E_UNAUTHORIZED)]
//     fun test_unauthorized_repayment() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create and fund loan
//         let clock = clock::create_for_testing(ctx);
//         clock::set_for_testing(&mut clock, 1000000);
        
//         let nft = create_test_nft(ctx);
//         let mut loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         ts::next_tx(&mut scenario, LENDER);
//         let ctx = ts::ctx(&mut scenario);
//         let payment = coin::mint_for_testing<SUI>(PRINCIPAL_AMOUNT, ctx);
//         loan::fund_loan(&mut loan, payment, &clock, ctx);
        
//         let (_, _, _, _, _, _, total_repayment, _) = loan::get_loan_details(&loan);
        
//         // Try to repay as third party (should fail)
//         ts::next_tx(&mut scenario, THIRD_PARTY);
//         let ctx = ts::ctx(&mut scenario);
//         let repayment = coin::mint_for_testing<SUI>(total_repayment, ctx);
//         loan::repay_loan(&mut loan, repayment, ctx);
        
//         ts::return_to_sender(&scenario, loan);
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     #[expected_failure(abort_code = lending::loan::E_LOAN_NOT_EXPIRED)]
//     fun test_premature_default_claim() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         // Create and fund loan
//         let clock = clock::create_for_testing(ctx);
//         clock::set_for_testing(&mut clock, 1000000);
        
//         let nft = create_test_nft(ctx);
//         let mut loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         ts::next_tx(&mut scenario, LENDER);
//         let ctx = ts::ctx(&mut scenario);
//         let payment = coin::mint_for_testing<SUI>(PRINCIPAL_AMOUNT, ctx);
//         loan::fund_loan(&mut loan, payment, &clock, ctx);
        
//         // Try to claim collateral before loan expires (should fail)
//         loan::claim_defaulted_collateral(&mut loan, &clock, ctx);
        
//         ts::return_to_sender(&scenario, loan);
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }

//     #[test]
//     #[expected_failure(abort_code = lending::loan::E_INSUFFICIENT_AMOUNT)]
//     fun test_insufficient_funding() {
//         let mut scenario = setup_scenario();
//         let ctx = ts::ctx(&mut scenario);
        
//         let clock = clock::create_for_testing(ctx);
//         let nft = create_test_nft(ctx);
//         let mut loan = loan::create_loan_request<TestNFT>(
//             nft,
//             COLLATERAL_VALUE,
//             PRINCIPAL_AMOUNT,
//             INTEREST_RATE,
//             LOAN_DURATION,
//             &clock,
//             ctx
//         );
        
//         ts::next_tx(&mut scenario, LENDER);
//         let ctx = ts::ctx(&mut scenario);
        
//         // Try to fund with insufficient amount
//         let insufficient_payment = coin::mint_for_testing<SUI>(PRINCIPAL_AMOUNT - 1, ctx);
//         loan::fund_loan(&mut loan, insufficient_payment, &clock, ctx);
        
//         ts::return_to_sender(&scenario, loan);
//         clock::destroy_for_testing(clock);
//         ts::end(scenario);
//     }
// }