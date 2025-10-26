// Import Soroban SDK components we need
// Documentation: https://developers.stellar.org/docs/build/smart-contracts
#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short};

// Define our contract structure
// This is like creating a class in other programming languages
#[contract]
pub struct SavingsTracker;

// Implementation of contract functions
// This is where all our contract logic lives
#[contractimpl]
impl SavingsTracker {
    
    // Function 1: Create a savings goal
    // Called when user first sets up their pet and goal
    pub fn create_goal(
        env: Env,                    // Contract environment (gives us storage)
        owner: Address,              // User's wallet address
        goal_amount: i128,           // How much they want to save (in USDC)
        deposit_amount: i128,        // How much to deposit each time
        deposit_frequency: Symbol    // How often (e.g., "weekly")
    ) {
        // Verify that the owner is actually calling this function
        // This prevents someone else from creating goals for your wallet
        owner.require_auth();
        
        // Store the goal in contract storage
        // Key: owner's address
        // Value: tuple of (goal_amount, deposit_amount, current_saved = 0)
        let initial_saved: i128 = 0;
        env.storage().instance().set(
            &owner, 
            &(goal_amount, deposit_amount, initial_saved)
        );
        
        // Emit an event so backend can detect goal creation
        env.events().publish(
            (symbol_short!("goal_set"), owner), 
            goal_amount
        );
    }

    // Function 2: Make a deposit
    // Called when user adds money to their savings
    pub fn deposit(
        env: Env,
        owner: Address,
        amount: i128              // Amount being deposited (in USDC)
    ) -> Symbol {
        // Verify owner is calling this
        owner.require_auth();
        
        // Get the stored goal data
        // Returns: (goal_amount, deposit_amount, current_saved)
        let (goal_amount, deposit_amount, current_saved): (i128, i128, i128) = 
            env.storage().instance().get(&owner).unwrap();
        
        // Add this deposit to total saved
        let new_saved = current_saved + amount;
        
        // Update storage with new amount
        env.storage().instance().set(
            &owner,
            &(goal_amount, deposit_amount, new_saved)
        );
        
        // Check if deposit was on schedule (correct amount)
        let result = if amount >= deposit_amount {
            symbol_short!("ON_TIME")   // Deposit meets or exceeds requirement
        } else {
            symbol_short!("UNDER")     // Deposit is less than required
        };
        
        // Emit event for backend to detect
        // Backend will use this to update pet health/happiness
        env.events().publish(
            (symbol_short!("deposit"), owner), 
            amount
        );
        
        result
    }

    // Function 3: Withdraw money
    // User can withdraw anytime, but pet suffers consequences
    pub fn withdraw(
        env: Env,
        owner: Address,
        amount: i128              // Amount to withdraw
    ) {
        // Verify owner is calling this
        owner.require_auth();
        
        // Get current savings
        let (goal_amount, deposit_amount, current_saved): (i128, i128, i128) = 
            env.storage().instance().get(&owner).unwrap();
        
        // Make sure they have enough to withdraw
        assert!(current_saved >= amount, "Insufficient balance");
        
        // Subtract withdrawal from total
        let new_saved = current_saved - amount;
        
        // Update storage
        env.storage().instance().set(
            &owner,
            &(goal_amount, deposit_amount, new_saved)
        );
        
        // Emit withdrawal event
        // Backend detects this and applies pet health penalty
        env.events().publish(
            (symbol_short!("withdraw"), owner), 
            amount
        );
    }

    // Function 4: Check progress toward goal
    // Returns true if goal is reached
    pub fn check_progress(
        env: Env,
        owner: Address
    ) -> bool {
        // Get goal data
        let (goal_amount, _deposit_amount, current_saved): (i128, i128, i128) = 
            env.storage().instance().get(&owner).unwrap();
        
        // Return true if we've saved enough
        current_saved >= goal_amount
    }
    
    // Function 5: Get current balance
    // Returns how much user has saved
    pub fn get_balance(
        env: Env,
        owner: Address
    ) -> i128 {
        // Get goal data and return current_saved
        let (_goal_amount, _deposit_amount, current_saved): (i128, i128, i128) = 
            env.storage().instance().get(&owner).unwrap();
        
        current_saved
    }
}