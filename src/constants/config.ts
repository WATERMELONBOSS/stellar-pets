// Configuration constants for the app

export const CONFIG = {
  // 🔌 SMART CONTRACT ADDRESSES - UPDATE THESE AFTER DEPLOYMENT
  CONTRACTS: {
    PET_NFT: 'CACXDW44LVYFQI6YLPFI7VOT34VYRXOBC5KVEIZVSEB2LEZXHXPCDRUA',
    STAKING: 'YOUR_STAKING_CONTRACT_ID_HERE',
    ACHIEVEMENTS: 'YOUR_ACHIEVEMENT_CONTRACT_ID_HERE',
  },
  
  // Stellar Network Configuration
  NETWORK: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  
  // Game Balance Constants
  GAME_CONSTANTS: {
    HEALTH_DECAY_PER_DAY: 5,
    HEALTH_GAIN_PER_FEED: 20,
    HAPPINESS_DECAY_PER_DAY: 3,
    HAPPINESS_GAIN_PER_FEED: 25,
    EVOLUTION_THRESHOLDS: [0, 100, 500, 2000], // Staking amounts for evolution
    WEEKLY_NOTIFICATION_DAY: 5, // Friday
  },
  
  // Pet Types Configuration
  PET_TYPES: [
    { id: 'dragon', name: 'Dragon', emoji: '🐉', description: 'Fierce and loyal' },
    { id: 'pig', name: 'Piggy', emoji: '🐷', description: 'Cheerful and lucky' },
    { id: 'puppy', name: 'Puppy', emoji: '🐶', description: 'Playful and loving' },
  ],
};