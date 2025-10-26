#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short,
};

// ============================================
// DATA STRUCTURES
// ============================================

/// Pet types available
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PetType {
    Dragon,
    Pig,
    Puppy,
}

/// Main Pet structure - stored on-chain
#[contracttype]
#[derive(Clone, Debug)]
pub struct Pet {
    pub owner: Address,          // Pet owner's address
    pub name: String,            // Pet name (e.g., "Sparkles")
    pub pet_type: PetType,       // Dragon, Pig, or Puppy
    pub health: u32,             // 0-100
    pub happiness: u32,          // 0-100
    pub level: u32,              // Pet level (starts at 1)
    pub total_staked: i128,      // Total amount staked (in stroops)
    pub feeding_streak: u32,     // Consecutive feeding days
    pub last_fed_timestamp: u64, // Last time pet was fed
    pub created_at: u64,         // Creation timestamp
}

/// Staking information
#[contracttype]
#[derive(Clone, Debug)]
pub struct StakingInfo {
    pub amount: i128,            // Currently staked amount
    pub last_deposit: u64,       // Last deposit timestamp
    pub total_deposits: u32,     // Number of deposits made
}

// ============================================
// STORAGE KEYS
// ============================================

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Pet(Address),           // Pet data by owner
    Staking(Address),       // Staking info by owner
    PetCounter,             // Total pets created
}

// ============================================
// CONTRACT
// ============================================

#[contract]
pub struct StellarPetsContract;

#[contractimpl]
impl StellarPetsContract {
    
    // ============================================
    // PET MANAGEMENT
    // ============================================
    
    /// Mint a new pet (create NFT)
    /// Returns: Pet ID (same as owner address for simplicity)
    pub fn mint_pet(
        env: Env,
        owner: Address,
        name: String,
        pet_type: PetType,
    ) -> Pet {
        // Verify owner is calling
        owner.require_auth();
        
        // Check if owner already has a pet
        let pet_key = DataKey::Pet(owner.clone());
        if env.storage().persistent().has(&pet_key) {
            panic!("Owner already has a pet");
        }
        
        // Get current timestamp
        let current_time = env.ledger().timestamp();
        
        // Create new pet with initial stats
        let pet = Pet {
            owner: owner.clone(),
            name,
            pet_type: pet_type.clone(),  // Clone here
            health: 100,          // Start with full health
            happiness: 100,       // Start with full happiness
            level: 1,             // Start at level 1
            total_staked: 0,      // No stake initially
            feeding_streak: 0,    // No streak yet
            last_fed_timestamp: current_time,
            created_at: current_time,
        };
        
        // Store pet data
        env.storage().persistent().set(&pet_key, &pet);
        
        // Initialize staking info
        let staking_info = StakingInfo {
            amount: 0,
            last_deposit: current_time,
            total_deposits: 0,
        };
        env.storage().persistent().set(&DataKey::Staking(owner.clone()), &staking_info);
        
        // Increment pet counter
        let counter_key = DataKey::PetCounter;
        let current_count: u32 = env.storage().persistent().get(&counter_key).unwrap_or(0);
        env.storage().persistent().set(&counter_key, &(current_count + 1));
        
        // Emit event
        env.events().publish((symbol_short!("pet_mint"),), (owner, pet_type));
        
        pet
    }
    
    /// Get pet data
    pub fn get_pet(env: Env, owner: Address) -> Option<Pet> {
        let pet_key = DataKey::Pet(owner);
        env.storage().persistent().get(&pet_key)
    }
    
    /// Get total number of pets created
    pub fn get_pet_count(env: Env) -> u32 {
        env.storage().persistent().get(&DataKey::PetCounter).unwrap_or(0)
    }
    
    // ============================================
    // FEEDING (STAKING) LOGIC
    // ============================================
    
    /// Feed pet by staking funds
    /// Amount is in stroops (1 XLM = 10,000,000 stroops)
    pub fn feed_pet(env: Env, owner: Address, amount: i128) -> Pet {
        owner.require_auth();
        
        // Get pet
        let pet_key = DataKey::Pet(owner.clone());
        let mut pet: Pet = env.storage().persistent()
            .get(&pet_key)
            .expect("Pet not found");
        
        // Verify pet belongs to caller
        if pet.owner != owner {
            panic!("Not your pet");
        }
        
        // Amount must be positive
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        // Get current timestamp
        let current_time = env.ledger().timestamp();
        
        // Calculate time since last feeding (in seconds)
        let time_since_last_feed = current_time - pet.last_fed_timestamp;
        let days_since_last_feed = time_since_last_feed / 86400; // 86400 seconds = 1 day
        
        // Update feeding streak
        if days_since_last_feed <= 1 {
            // Fed within 24 hours - maintain or increase streak
            pet.feeding_streak += 1;
        } else {
            // Missed a day - reset streak
            pet.feeding_streak = 1;
        }
        
        // Update pet stats
        pet.health = Self::calculate_new_stat(pet.health, 20, 100); // +20 health
        pet.happiness = Self::calculate_new_stat(pet.happiness, 25, 100); // +25 happiness
        pet.total_staked += amount;
        pet.last_fed_timestamp = current_time;
        
        // Level up logic (every 1000 stroops = 1 level)
        pet.level = 1 + (pet.total_staked / 1000) as u32;
        
        // Update staking info
        let staking_key = DataKey::Staking(owner.clone());
        let mut staking: StakingInfo = env.storage().persistent()
            .get(&staking_key)
            .unwrap_or(StakingInfo {
                amount: 0,
                last_deposit: current_time,
                total_deposits: 0,
            });
        
        staking.amount += amount;
        staking.last_deposit = current_time;
        staking.total_deposits += 1;
        
        // Save updated data
        env.storage().persistent().set(&pet_key, &pet);
        env.storage().persistent().set(&staking_key, &staking);
        
        // Emit event
        env.events().publish((symbol_short!("pet_fed"),), (owner, amount));
        
        pet
    }
    
    // ============================================
    // WITHDRAWAL LOGIC
    // ============================================
    
    /// Withdraw staked funds (pet gets sad)
    pub fn withdraw(env: Env, owner: Address, amount: i128) -> Pet {
        owner.require_auth();
        
        // Get pet
        let pet_key = DataKey::Pet(owner.clone());
        let mut pet: Pet = env.storage().persistent()
            .get(&pet_key)
            .expect("Pet not found");
        
        // Get staking info
        let staking_key = DataKey::Staking(owner.clone());
        let mut staking: StakingInfo = env.storage().persistent()
            .get(&staking_key)
            .expect("No staking info found");
        
        // Check if enough funds staked
        if amount > staking.amount {
            panic!("Insufficient staked funds");
        }
        
        // Apply penalties
        pet.health = Self::calculate_new_stat(pet.health, -30, 100); // -30 health
        pet.happiness = Self::calculate_new_stat(pet.happiness, -40, 100); // -40 happiness
        pet.feeding_streak = 0; // Reset streak
        pet.total_staked -= amount;
        
        // Update staking
        staking.amount -= amount;
        
        // Save updated data
        env.storage().persistent().set(&pet_key, &pet);
        env.storage().persistent().set(&staking_key, &staking);
        
        // Emit event
        env.events().publish((symbol_short!("withdraw"),), (owner, amount));
        
        pet
    }
    
    // ============================================
    // HEALTH DECAY (Called periodically)
    // ============================================
    
    /// Update pet health based on time passed
    /// Should be called periodically (e.g., daily)
    pub fn update_pet_health(env: Env, owner: Address) -> Pet {
        let pet_key = DataKey::Pet(owner.clone());
        let mut pet: Pet = env.storage().persistent()
            .get(&pet_key)
            .expect("Pet not found");
        
        let current_time = env.ledger().timestamp();
        let time_since_last_feed = current_time - pet.last_fed_timestamp;
        let days_passed = (time_since_last_feed / 86400) as u32; // Days since last feeding
        
        if days_passed > 0 {
            // Decay health and happiness for each day not fed
            let health_decay = 5 * days_passed; // 5 points per day
            let happiness_decay = 3 * days_passed; // 3 points per day
            
            pet.health = if pet.health > health_decay { pet.health - health_decay } else { 0 };
            pet.happiness = if pet.happiness > happiness_decay { pet.happiness - happiness_decay } else { 0 };
            
            // Save updated pet
            env.storage().persistent().set(&pet_key, &pet);
        }
        
        pet
    }
    
    // ============================================
    // STAKING QUERIES
    // ============================================
    
    /// Get staking information
    pub fn get_staking_info(env: Env, owner: Address) -> Option<StakingInfo> {
        env.storage().persistent().get(&DataKey::Staking(owner))
    }
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    /// Calculate new stat value with bounds checking
    fn calculate_new_stat(current: u32, change: i32, max: u32) -> u32 {
        let new_value = current as i32 + change;
        if new_value < 0 {
            0
        } else if new_value > max as i32 {
            max
        } else {
            new_value as u32
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mint_pet() {
        let env = Env::default();
        let contract_id = env.register_contract(None, StellarPetsContract);
        let client = StellarPetsContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let name = String::from_str(&env, "TestPet");

        let pet = client.mint_pet(&owner, &name, &PetType::Dragon);
        
        assert_eq!(pet.owner, owner);
        assert_eq!(pet.name, name);
        assert_eq!(pet.health, 100);
        assert_eq!(pet.happiness, 100);
    }

    #[test]
    fn test_feed_pet() {
        let env = Env::default();
        let contract_id = env.register_contract(None, StellarPetsContract);
        let client = StellarPetsContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let name = String::from_str(&env, "TestPet");

        // Mint pet
        client.mint_pet(&owner, &name, &PetType::Dragon);
        
        // Feed pet
        let pet = client.feed_pet(&owner, &100);
        
        assert_eq!(pet.total_staked, 100);
        assert_eq!(pet.feeding_streak, 1);
    }
}