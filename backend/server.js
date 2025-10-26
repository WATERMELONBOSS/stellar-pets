// Import required packages
// Express - web server framework
// Stellar SDK - interact with Stellar blockchain
// Documentation: https://developers.stellar.org/docs/tools/sdks
const express = require('express');
const StellarSdk = require('@stellar/stellar-sdk');
const cors = require('cors');
require('dotenv').config();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase connection
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

console.log('✅ Supabase connected:', process.env.SUPABASE_URL);

// Initialize Express app
const app = express();
const PORT = 3000;;

// Middleware to parse JSON requests
app.use(express.json());
// Allow frontend to make requests (CORS)
app.use(cors());

// Configure Stellar connection
// Connect to testnet Horizon API for reading blockchain data
// Documentation: https://developers.stellar.org/api/horizon
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

// Load contract address from .env file
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Log to confirm backend is connecting to the right contract
console.log('Backend configured to use contract:', CONTRACT_ADDRESS);

// Test endpoint to verify backend is running
// Call this from browser: http://localhost:5000/health
app.get('/health', (req, res) => {
    res.json({ 
        status: 'Backend is running!',
        contract: CONTRACT_ADDRESS,
        network: 'testnet'
    });
});

// Test endpoint to verify backend is running
// Call this from browser: http://localhost:5000/health
app.get('/health', (req, res) => {
    res.json({ 
        status: 'Backend is running!',
        contract: CONTRACT_ADDRESS,
        network: 'testnet'
    });
});

// API Endpoint 1: Create a savings goal
// Called when user first sets up their pet and goal
// POST /goal/create
// Body: { walletAddress, petName, petType, goalAmount, depositAmount }
app.post('/goal/create', async (req, res) => {
    try {
        const { walletAddress, petName, petType, goalAmount, depositAmount } = req.body;
        
        // Validate inputs
        if (!walletAddress || !goalAmount || !depositAmount) {
            return res.status(400).json({ 
                error: 'Missing required fields: walletAddress, goalAmount, depositAmount' 
            });
        }
        
        console.log(`Creating goal for ${walletAddress}: $${goalAmount} target`);
        
        // Step 1: Create or get user
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();
        
        let userId;
        
        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create new user
            const { data: newUser, error: userError } = await supabase
                .from('users')
                .insert({
                    wallet_address: walletAddress,
                })
                .select()
                .single();
            
            if (userError) throw userError;
            userId = newUser.id;
            console.log('✅ User step complete. UserID:', userId);
        }
        
        // Step 2: Create goal
        const { data: goal, error: goalError } = await supabase
            .from('goals')
            .insert({
                user_id: userId,
            goal_amount: goalAmount,
            deposit_amount: depositAmount,
            frequency: 'weekly',
            last_deposit_date: new Date().toISOString(),
            next_deposit_due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
            .select()
            .single();
        
        if (goalError) throw goalError;
        console.log('✅ Goal created successfully:', goal.id);
        
        // Step 3: Initialize pet state
        const { data: petState, error: petError } = await supabase
            .from('pet_states')
            .insert({
                user_id: userId,
                pet_name: petName || 'My Pet',
                pet_type: petType || 'dragon',
                health: 50,
                happiness: 50,
                growth_level: 0,
                streak_days: 0,
                total_saved: 0
            })
            .select()
            .single();
        
        if (petError) throw petError;
        console.log('✅ Pet state created successfully:', petState.id);
        
        res.json({
            success: true,
            message: 'Goal created successfully!',
            data: {
                userId,
                goal,
                petState
            }
        });
        
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ error: 'Failed to create goal', details: error.message });
    }
});

// API Endpoint 2: Calculate and update pet state after deposit
// Called when backend detects a deposit
// POST /pet/calculate
// Body: { walletAddress, depositAmount, scheduledAmount, onTime }
app.post('/pet/calculate', async (req, res) => {
    try {
        const { walletAddress, depositAmount, scheduledAmount, onTime } = req.body;
        
        console.log(`Calculating pet state for ${walletAddress}`);
        
        // Get user
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('wallet_address', walletAddress)
            .single();
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get current pet state
        const { data: currentState } = await supabase
            .from('pet_states')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        // Calculate changes based on deposit behavior
        let healthChange = 0;
        let happinessChange = 0;
        let newStreak = currentState.streak_days;
        
        if (onTime && depositAmount >= scheduledAmount) {
            // POSITIVE: On time and correct amount
            healthChange = 5;
            happinessChange = 10;
            newStreak += 1;
        } else if (!onTime) {
            // NEGATIVE: Missed deadline
            healthChange = -10;
            happinessChange = -15;
            newStreak = 0;
        } else {
            // PARTIAL: Deposited but under amount
            healthChange = 2;
            happinessChange = 5;
        }
        
        // Apply changes (keep within 0-100 bounds)
        const newHealth = Math.max(0, Math.min(100, currentState.health + healthChange));
        const newHappiness = Math.max(0, Math.min(100, currentState.happiness + happinessChange));
        const newTotalSaved = parseFloat(currentState.total_saved) + parseFloat(depositAmount);
        
        // Update database
        const { error: updateError } = await supabase
            .from('pet_states')
            .update({
                health: newHealth,
                happiness: newHappiness,
                streak_days: newStreak,
                total_saved: newTotalSaved,
                last_updated: new Date().toISOString()
            })
            .eq('user_id', user.id);
        
        if (updateError) throw updateError;
        
        // Update goal's last deposit date and next due date
        await supabase
            .from('goals')
            .update({
                last_deposit_date: new Date().toISOString(),
                next_deposit_due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('user_id', user.id);

        // Record deposit in history
        await supabase
            .from('deposits')
            .insert({
                user_id: user.id,
                amount: depositAmount,
                transaction_type: 'deposit',
                on_schedule: onTime
            });
        
        console.log(`Updated pet: health ${newHealth}, happiness ${newHappiness}, streak ${newStreak}`);
        
        res.json({
            success: true,
            newState: {
                health: newHealth,
                happiness: newHappiness,
                streakDays: newStreak,
                totalSaved: newTotalSaved
            },
            changes: { healthChange, happinessChange },
            message: onTime ? 'Pet is happy!' : 'Pet is sad!'
        });
        
    } catch (error) {
        console.error('Error calculating pet state:', error);
        res.status(500).json({ error: 'Failed to calculate pet state', details: error.message });
    }
});

// API Endpoint 3: Handle withdrawal with penalty
// Called when user withdraws money early
// POST /withdraw/process
// Body: { walletAddress, amount }
app.post('/withdraw/process', async (req, res) => {
    try {
        const { walletAddress, amount } = req.body;
        
        if (!walletAddress || !amount) {
            return res.status(400).json({ error: 'Missing walletAddress or amount' });
        }
        
        console.log(`Processing withdrawal for ${walletAddress}: $${amount}`);
        
        // Get user
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('wallet_address', walletAddress)
            .single();
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get current pet state
        const { data: currentState } = await supabase
            .from('pet_states')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        // Apply heavy penalties for withdrawal
        const healthChange = -30;
        const happinessChange = -40;
        
        const newHealth = Math.max(0, currentState.health + healthChange);
        const newHappiness = Math.max(0, currentState.happiness + happinessChange);
        const newTotalSaved = Math.max(0, parseFloat(currentState.total_saved) - parseFloat(amount));
        
        // Update database
        const { error: updateError } = await supabase
            .from('pet_states')
            .update({
                health: newHealth,
                happiness: newHappiness,
                streak_days: 0,  // Reset streak on withdrawal
                total_saved: newTotalSaved,
                last_updated: new Date().toISOString()
            })
            .eq('user_id', user.id);
        
        if (updateError) throw updateError;
        
        // Record withdrawal in history
        await supabase
            .from('deposits')
            .insert({
                user_id: user.id,
                amount: amount,
                transaction_type: 'withdrawal',
                on_schedule: false
            });
        
        console.log(`Withdrawal processed: health ${newHealth}, happiness ${newHappiness}`);
        
        res.json({
            success: true,
            withdrawnAmount: amount,
            newState: {
                health: newHealth,
                happiness: newHappiness,
                streakDays: 0,
                totalSaved: newTotalSaved
            },
            penalty: { healthChange, happinessChange },
            message: 'Withdrawal successful, but pet is very sad!'
        });
        
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        res.status(500).json({ error: 'Failed to process withdrawal', details: error.message });
    }
});

// API Endpoint 4: Get current pet state
// Called by frontend to display pet
// GET /pet/state?wallet=ADDRESS
app.get('/pet/state', async (req, res) => {
    try {
        const { wallet } = req.query;
        
        if (!wallet) {
            return res.status(400).json({ error: 'Missing wallet parameter' });
        }
        
        console.log(`Fetching pet state for ${wallet}`);
        
        // Get user by wallet address
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, pet_name, pet_type')
            .eq('wallet_address', wallet)
            .single();
        
        if (userError || !user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get pet state
        const { data: petState, error: petError } = await supabase
            .from('pet_states')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (petError) throw petError;
        
        // Get goal
        const { data: goal, error: goalError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (goalError) throw goalError;
        
        // Return combined data
        res.json({
            success: true,
            petState: {
                petName: user.pet_name,
                petType: user.pet_type,
                health: petState.health,
                happiness: petState.happiness,
                growthLevel: petState.growth_level,
                streakDays: petState.streak_days,
                totalSaved: parseFloat(petState.total_saved),
                goalAmount: parseFloat(goal.goal_amount)
            }
        });
        
    } catch (error) {
        console.error('Error fetching pet state:', error);
        res.status(500).json({ error: 'Failed to fetch pet state', details: error.message });
    }
});

// Start the Express server
// Backend will run on http://localhost:5000
app.listen(PORT, () => {
    console.log(`✅ Stellar Pets Backend running on http://localhost:${PORT}`);
    console.log(`📝 Contract Address: ${CONTRACT_ADDRESS}`);
    console.log(`🌐 Network: Stellar Testnet`);
    console.log('\nAvailable endpoints:');
    console.log('  GET  /health - Check backend status');
    console.log('  POST /goal/create - Create savings goal');
    console.log('  POST /pet/calculate - Calculate pet state changes');
    console.log('  POST /withdraw/process - Process withdrawal');
    console.log('  GET  /pet/state - Get current pet state');
});

// Keep process alive
setInterval(() => {}, 1000);