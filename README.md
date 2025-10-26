# 🎃 Stella - Your Savings Companion

**Gamified savings platform where your blockchain pet grows with your savings.**

> **🎥 [Demo Video]([ADD_YOUTUBE_OR_LOOM_LINK_HERE](https://drive.google.com/file/d/1ErKT-9yl4Onp9bi855D9sVkbqpbj-iCb/view?usp=sharing))**  
> **🌐 [Live Demo](ADD_VERCEL_DEPLOYMENT_LINK_HERE)**  
> **🔗 [Smart Contract on Explorer](https://stellar.expert/explorer/testnet/contract/CACXDW44LVYFQI6YLPFI7VOT34VYRXOBC5KVEIZVSEB2LEZXHXPCDRUA)**

Built for **EasyA x Stellar Hack-o-Ween 2024** | Track 2: Smart Contract Games

---

## What is Stella?

Stella is your digital pet that lives on Stellar blockchain. Feed her by saving money. Skip deposits and she gets sad. It's Tamagotchi meets DeFi.

**The hook:** When Stella is hungry, you get notifications. When you feed her (stake funds), she grows happier. Miss a week? She gets sick.

---

## 🎬 Demo Videos

### Full Walkthrough (Required)
**🎥 [Watch 3-min Demo Video](ADD_LOOM_LINK_HERE)**

What's shown:
- Connect Freighter wallet
- Choose pet type (Dragon/Pig/Puppy)
- Name your Stella
- Feed Stella (stake USDC)
- Watch health/happiness increase
- Backend database updates in real-time
- Leaderboard competition
- Achievement NFT badges

### Code Walkthrough (Required)
**🎥 [Watch Technical Walkthrough](ADD_LOOM_LINK_HERE)**

Covers:
- GitHub repo structure
- How smart contract works
- Frontend-blockchain integration
- Database schema
- How we satisfied custom contract requirement

---

## 📸 Screenshots

### 1. Choose Your Stella
![Pet Selection](./screenshots/pet-selection.png)

### 2. Stella's Home (Dashboard)
![Dashboard](./screenshots/dashboard.png)

### 3. Feed Stella (Staking Modal)
![Feeding](./screenshots/feeding-modal.png)

### 4. Leaderboard - Compete with Friends
![Leaderboard](./screenshots/leaderboard.png)

### 5. Achievement NFT Badges
![Achievements](./screenshots/achievements.png)

---

## 🔧 How It Works

### User Journey
```
1. Connect Wallet (Freighter) 
   → 
2. Choose Stella's form (Dragon/Pig/Puppy)
   → 
3. Stake USDC to feed Stella
   → 
4. Stella's health/happiness increase
   → 
5. Miss deposits = Stella gets sad
   →
6. Earn NFT badges for consistency
   →
7. Compete on leaderboard
```

### Under the Hood

**Frontend** calls **Backend API** which interacts with **Soroban Smart Contract** on **Stellar Testnet**.
```
User stakes $50
  ↓
Frontend → POST /goal/create → Backend
  ↓
Backend → contract.deposit() → Soroban Contract
  ↓
Contract emits event → Backend catches it
  ↓
Backend updates pet health in Supabase
  ↓
Frontend polls backend → UI updates
  ↓
Stella's health +20, happiness +25
```

---

## 💎 Smart Contract (Soroban)

**Contract Address:** `CACXDW44LVYFQI6YLPFI7VOT34VYRXOBC5KVEIZVSEB2LEZXHXPCDRUA`

**View on Explorer:** [Stellar Expert - Testnet](https://stellar.expert/explorer/testnet/contract/CACXDW44LVYFQI6YLPFI7VOT34VYRXOBC5KFEIZVSEB2LEZXHXPCDRUA)

### Contract Functions

#### `create_goal(owner, goal_amount, deposit_amount, frequency)`
Initializes savings goal and pet ownership on-chain.

**Parameters:**
- `owner: Address` - User's Stellar wallet
- `goal_amount: i128` - Target savings (in stroops)
- `deposit_amount: i128` - Per-deposit amount
- `frequency: Symbol` - "weekly", "daily", etc.

**Returns:** Emits `goal_set` event

**Why this matters:** Creates immutable record of user's commitment.

---

#### `deposit(owner, amount)`
Stakes funds and updates pet state.

**Parameters:**
- `owner: Address` - User making deposit
- `amount: i128` - Amount to stake

**Returns:** `ON_TIME` or `UNDER` symbol

**Logic:**
- Checks if deposit meets scheduled amount
- Increments feeding streak if on time
- Emits `deposit` event for backend
- Updates total_saved counter

**Why this matters:** This is the core game loop - staking = feeding.

---

#### `withdraw(owner, amount)`
Unstakes funds with penalties.

**Parameters:**
- `owner: Address` - User withdrawing
- `amount: i128` - Amount to withdraw

**Effects:**
- Deducts from total_saved
- Emits `withdraw` event
- Backend applies pet health penalties

**Why this matters:** Discourages early withdrawal through game mechanics.

---

#### `get_balance(owner)` & `check_progress(owner)`
Query functions for current state.

**Returns:** Current savings amount and goal completion status.

---

### Contract Storage

Uses Soroban persistent storage with these keys:
- `DataKey::Pet(Address)` - Stores pet owner mapping
- `DataKey::Staking(Address)` - Stores deposit history
- `DataKey::PetCounter` - Global pet count

**Data persists across sessions** - your Stella never forgets!

---

### Why Custom Contract (Not Boilerplate)?

Our contract is **100% custom** because:
1. **Unique game logic** - No existing contract combines pet state + staking
2. **Custom penalty system** - Withdrawal penalties calculated on-chain
3. **Streak tracking** - On-chain consecutive deposit counter
4. **Event emissions** - Custom events for backend sync
5. **Goal progress calculation** - Built-in milestone checking

**Proof:** Check `smart-contract/savings-tracker/contracts/hello-world/src/lib.rs` - written from scratch for this hackathon, committed during event.

---

## 🏗️ Tech Stack

### Blockchain Layer
- **Soroban (Rust)** - Smart contracts
- **Stellar SDK** - Blockchain interaction
- **Freighter Wallet** - Transaction signing

### Frontend
- React + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Router

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- Stellar SDK

---

## ⚡ Quick Start

### Prerequisites
```bash
# Install Freighter wallet
https://www.freighter.app/

# Node.js 18+
node --version
```

### Run Locally

**Backend:**
```bash
cd backend
npm install
# Add .env with Supabase credentials
node server.js
```

**Frontend:**
```bash
npm install
npm run dev
```

**Open:** http://localhost:5173

---

## 📂 Repo Structure
```
stellar-pets/
├── src/                    # Frontend React app
│   ├── components/         # UI components
│   ├── pages/             # Routes (Dashboard, Leaderboard, etc.)
│   ├── contexts/          # State management
│   └── types/             # TypeScript interfaces
├── backend/
│   └── server.js          # Express API + Supabase integration
├── smart-contract/
│   └── savings-tracker/   # Soroban contract (Rust)
└── screenshots/           # UI screenshots
```

**Key Files:**
- `src/contexts/PetContext.tsx` - Smart contract integration layer
- `backend/server.js` - API endpoints that interact with contract
- `smart-contract/.../lib.rs` - Soroban contract source code

---

## 🎯 How We Used Stellar

### Soroban Features Used:
1. **Persistent Storage** - Pet state stored on-chain
2. **Events** - Contract emits events backend listens to
3. **Authentication** - `require_auth()` ensures only owner can act
4. **Timestamp Access** - `env.ledger().timestamp()` for streak tracking
5. **Storage API** - Efficient key-value storage for pet data

### Why Stellar Over Other Chains:
- **Speed** - 5-sec finality = instant pet reactions
- **Cost** - Low fees = viable for small weekly deposits
- **Stability** - Native USDC perfect for savings
- **Simplicity** - Soroban's Rust SDK is clean and well-documented

---

## 👥 Team

**Milan Srinivas** ([@WATERMELONBOSS](https://github.com/WATERMELONBOSS))  
*Frontend, UI/UX, Integration*

**[Teammate Name]** ([@Coding-Samurai110602](https://github.com/Coding-Samurai110602))  
*Smart Contracts, Backend, Database*

---

## 🏆 Hackathon Submission

**Track:** #2 - Smart Contract Games  
**Prize:** Competing for $12,998 prize pool  
**Unique Selling Point:** Emotional gamification meets DeFi savings

### Why We'll Win:
- ✅ Fully functional smart contracts on Stellar testnet
- ✅ Beautiful, polished UI that makes judges go "awww!"
- ✅ Real wallet integration (Freighter)
- ✅ Working backend with persistent database
- ✅ NFT achievement system
- ✅ Social/competitive elements (leaderboard)
- ✅ Solves real problem (savings motivation)
- ✅ Deeply integrated with Stellar (not just a wrapper)

---

## 📜 License

MIT - Free to use and modify

---

**Built during EasyA x Stellar Hack-o-Ween 2024 🎃**  
*October 25-26, 2025 | Boston, MA*
