// TypeScript Interfaces for the entire app

// Pet NFT Interface
export interface Pet {
  id: string;
  name: string;
  type: 'dragon' | 'pig' | 'puppy';
  owner: string;
  health: number; // 0-100
  happiness: number; // 0-100
  level: number;
  evolutionStage: number; // 0: baby, 1: teen, 2: adult, 3: mega
  totalStaked: number; // In USDC
  feedingStreak: number; // Consecutive weeks fed
  lastFedTimestamp: number;
  battlesWon: number;
  createdAt: number;
  accessories: string[]; // NFT accessory IDs
}

// Staking Information
export interface StakingInfo {
  amount: number;
  startTime: number;
  lastDepositTime: number;
  weeklyGoal: number;
  totalDeposits: number;
  missedDeposits: number;
}

// Leaderboard Entry Interface
export interface LeaderboardEntry {
  rank: number;
  user: string;
  petName: string;
  petType: 'dragon' | 'pig' | 'puppy';
  totalStaked: number;
  feedingStreak: number;
  health: number;
}

// User Profile
export interface User {
  publicKey: string;
  nickname?: string;
  totalSaved: number;
  achievements: string[];
  pets: Pet[];
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  user: string;
  petName: string;
  petType: 'dragon' | 'pig' | 'puppy';
  totalStaked: number;
  feedingStreak: number;
  health: number;
}

// Smart Contract Call Result
export interface ContractCallResult {
  success: boolean;
  transactionHash?: string;
  data?: any;
  error?: string;
}