#[test_only]
module PropertyInvestment::property_investment_tests {
    use std::string;
    use sui::test_scenario::{Self, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance;
    use sui::test_utils;
    use PropertyInvestment::property_investment::{Self, PropertyNFT, FractionalOwnership};

    // Test addresses
    const PROPERTY_OWNER: address = @0xA;
    const INVESTOR1: address = @0xB;
    const INVESTOR2: address = @0xC;
    const RANDOM_USER: address = @0xD;

    // Test values
    const PROPERTY_VALUATION: u64 = 1000000; // 1M SUI
    const API_PERCENT: u64 = 8; // 8% annual returns
    const INVESTMENT_AMOUNT_1: u64 = 50000; // 50K SUI
    const INVESTMENT_AMOUNT_2: u64 = 30000; // 30K SUI

    /// Create a test coin with specified value
    fun create_test_coin(amount: u64, scenario: &mut Scenario): Coin<SUI> {
        coin::mint_for_testing<SUI>(amount, test_scenario::ctx(scenario))
    }

    /// Test property creation
    #[test]
    fun test_create_property() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Luxury Villa",
                b"Beautiful villa in prime location",
                b"123 Main Street, City",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Check if property was created and shared
        test_scenario::next_tx(&mut scenario, PROPERTY_OWNER);
        {
            let property = test_scenario::take_shared<PropertyNFT>(&scenario);
            
            let (name, valuation, api_percent, total_invested, shareholders) = 
                property_investment::get_property_info(&property);
            
            assert!(name == b"Luxury Villa", 0);
            assert!(valuation == PROPERTY_VALUATION, 1);
            assert!(api_percent == API_PERCENT, 2);
            assert!(total_invested == 0, 3);
            assert!(shareholders == 0, 4);
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }

    /// Test investment functionality
    #[test]
    fun test_invest() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Investment Property",
                b"Great investment opportunity",
                b"456 Investment Ave",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // First investor invests
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let payment = create_test_coin(INVESTMENT_AMOUNT_1, &mut scenario);
            
            property_investment::invest(
                &mut property,
                payment,
                INVESTMENT_AMOUNT_1,
                test_scenario::ctx(&mut scenario)
            );
            
            // Check property stats updated
            let (_, _, _, total_invested, shareholders) = 
                property_investment::get_property_info(&property);
            assert!(total_invested == INVESTMENT_AMOUNT_1, 5);
            assert!(shareholders == 1, 6);
            
            test_scenario::return_shared(property);
        };

        // Check if fractional ownership was created
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let ownership = test_scenario::take_from_sender<FractionalOwnership>(&scenario);
            let (owner, amount) = property_investment::get_ownership_info(&ownership);
            
            assert!(owner == INVESTOR1, 7);
            assert!(amount == INVESTMENT_AMOUNT_1, 8);
            
            test_scenario::return_to_sender(&scenario, ownership);
        };

        // Second investor invests
        test_scenario::next_tx(&mut scenario, INVESTOR2);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let payment = create_test_coin(INVESTMENT_AMOUNT_2, &mut scenario);
            
            property_investment::invest(
                &mut property,
                payment,
                INVESTMENT_AMOUNT_2,
                test_scenario::ctx(&mut scenario)
            );
            
            // Check property stats updated
            let (_, _, _, total_invested, shareholders) = 
                property_investment::get_property_info(&property);
            assert!(total_invested == INVESTMENT_AMOUNT_1 + INVESTMENT_AMOUNT_2, 9);
            assert!(shareholders == 2, 10);
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }

    /// Test investment with partial payment
    #[test]
    fun test_invest_with_change() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Test Property",
                b"Test description",
                b"Test address",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Invest with more coins than needed
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let payment = create_test_coin(INVESTMENT_AMOUNT_1 + 10000, &mut scenario); // Extra 10K
            
            property_investment::invest(
                &mut property,
                payment,
                INVESTMENT_AMOUNT_1,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(property);
        };

        // Check if change was returned
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            // Should have received fractional ownership
            let ownership = test_scenario::take_from_sender<FractionalOwnership>(&scenario);
            test_scenario::return_to_sender(&scenario, ownership);
            
            // Should have received change back
            let change = test_scenario::take_from_sender<Coin<SUI>>(&scenario);
            assert!(coin::value(&change) == 10000, 11);
            test_scenario::return_to_sender(&scenario, change);
        };

        test_scenario::end(scenario);
    }

    /// Test redemption functionality
    #[test]
    fun test_redeem() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Redemption Test Property",
                b"Test redemption",
                b"Redemption Ave",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Investor invests
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let payment = create_test_coin(INVESTMENT_AMOUNT_1, &mut scenario);
            
            property_investment::invest(
                &mut property,
                payment,
                INVESTMENT_AMOUNT_1,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(property);
        };

        // Investor redeems investment
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let ownership = test_scenario::take_from_sender<FractionalOwnership>(&scenario);
            
            property_investment::redeem(
                &mut property,
                ownership,
                test_scenario::ctx(&mut scenario)
            );
            
            // Check property stats updated
            let (_, _, _, total_invested, shareholders) = 
                property_investment::get_property_info(&property);
            assert!(total_invested == 0, 12);
            assert!(shareholders == 0, 13);
            
            test_scenario::return_shared(property);
        };

        // Check if refund was received
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let refund = test_scenario::take_from_sender<Coin<SUI>>(&scenario);
            assert!(coin::value(&refund) == INVESTMENT_AMOUNT_1, 14);
            test_scenario::return_to_sender(&scenario, refund);
        };

        test_scenario::end(scenario);
    }

    /// Test valuation update by owner
    #[test]
    fun test_update_valuation_by_owner() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Valuation Test Property",
                b"Test valuation update",
                b"Valuation St",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Owner updates valuation
        test_scenario::next_tx(&mut scenario, PROPERTY_OWNER);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let new_valuation = 1200000; // 1.2M SUI
            
            property_investment::update_valuation(
                &mut property,
                new_valuation,
                test_scenario::ctx(&mut scenario)
            );
            
            let (_, valuation, _, _, _) = property_investment::get_property_info(&property);
            assert!(valuation == new_valuation, 15);
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }

    /// Test valuation update by non-owner (should fail)
    #[test]
    #[expected_failure(abort_code = 0)] // ENotOwner
    fun test_update_valuation_by_non_owner() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Unauthorized Test Property",
                b"Test unauthorized access",
                b"Unauthorized Ave",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Non-owner tries to update valuation (should fail)
        test_scenario::next_tx(&mut scenario, RANDOM_USER);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            
            property_investment::update_valuation(
                &mut property,
                1500000,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }

    /// Test redeem by non-owner (should fail)
    #[test]
    #[expected_failure(abort_code = 1)] // ENotOwnerOfFractional
    fun test_redeem_by_non_owner() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Unauthorized Redeem Test",
                b"Test unauthorized redemption",
                b"Unauthorized Redeem St",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Investor1 invests
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let payment = create_test_coin(INVESTMENT_AMOUNT_1, &mut scenario);
            
            property_investment::invest(
                &mut property,
                payment,
                INVESTMENT_AMOUNT_1,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(property);
        };

        // Transfer ownership to different user for testing
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let ownership = test_scenario::take_from_sender<FractionalOwnership>(&scenario);
            transfer::public_transfer(ownership, RANDOM_USER);
        };

        // Random user tries to redeem (should fail)
        test_scenario::next_tx(&mut scenario, INVESTOR2);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let ownership = test_scenario::take_from_address<FractionalOwnership>(&scenario, RANDOM_USER);
            
            property_investment::redeem(
                &mut property,
                ownership,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }

    /// Test investment with zero amount (should fail)
    #[test]
    #[expected_failure(abort_code = 3)] // EInvalidAmount
    fun test_invest_zero_amount() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Zero Investment Test",
                b"Test zero investment",
                b"Zero Investment Rd",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Try to invest zero amount (should fail)
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let payment = create_test_coin(1000, &mut scenario);
            
            property_investment::invest(
                &mut property,
                payment,
                0, // Zero amount
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }

    /// Test investment with insufficient funds (should fail)
    #[test]
    #[expected_failure(abort_code = 2)] // EInsufficientFunds
    fun test_invest_insufficient_funds() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Insufficient Funds Test",
                b"Test insufficient funds",
                b"Insufficient Funds St",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Try to invest more than available (should fail)
        test_scenario::next_tx(&mut scenario, INVESTOR1);
        {
            let mut property = test_scenario::take_shared<PropertyNFT>(&scenario);
            let payment = create_test_coin(1000, &mut scenario); // Only 1000 SUI
            
            property_investment::invest(
                &mut property,
                payment,
                5000, // Trying to invest 5000 SUI
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }

    /// Test returns calculation
    #[test]
    fun test_calculate_returns() {
        let mut scenario = test_scenario::begin(PROPERTY_OWNER);
        
        // Create property
        {
            property_investment::create_property(
                b"Returns Test Property",
                b"Test returns calculation",
                b"Returns Ave",
                PROPERTY_VALUATION,
                API_PERCENT,
                test_scenario::ctx(&mut scenario)
            );
        };

        // Test returns calculation
        test_scenario::next_tx(&mut scenario, PROPERTY_OWNER);
        {
            let property = test_scenario::take_shared<PropertyNFT>(&scenario);
            
            let returns = property_investment::calculate_returns(&property, 100000);
            assert!(returns == 8000, 16); // 8% of 100000 = 8000
            
            let returns2 = property_investment::calculate_returns(&property, 50000);
            assert!(returns2 == 4000, 17); // 8% of 50000 = 4000
            
            test_scenario::return_shared(property);
        };

        test_scenario::end(scenario);
    }
}