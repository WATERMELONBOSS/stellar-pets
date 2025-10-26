// Pet state management - integrated with backend
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, StakingInfo } from '../types';
import { CONFIG } from '../constants/config';
import { useWallet } from './WalletContext';

// Backend API URL - will be replaced with deployed URL
const API_BASE_URL = 'http://localhost:3000';

interface PetContextType {
  currentPet: Pet | null;
  stakingInfo: StakingInfo | null;
  loading: boolean;
  feedPet: (amount: number) => Promise<void>;
  withdrawFunds: (amount: number) => Promise<void>;
  mintPet: (type: 'dragon' | 'pig' | 'puppy', name: string) => Promise<void>;
  refreshPetData: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey } = useWallet();
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshPetData = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPet: Pet = {
        id: 'pet-001',
        name: 'Sparkles',
        type: 'dragon',
        owner: publicKey,
        health: 75,
        happiness: 80,
        level: 3,
        evolutionStage: 1,
        totalStaked: 250,
        feedingStreak: 4,
        lastFedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        battlesWon: 0,
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        accessories: [],
      };
      setCurrentPet(mockPet);
      
      const mockStaking: StakingInfo = {
        amount: 250,
        startTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
        lastDepositTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
        weeklyGoal: 50,
        totalDeposits: 5,
        missedDeposits: 1,
      };
      setStakingInfo(mockStaking);
      
    } catch (error) {
      console.error('Failed to load pet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const feedPet = async (amount: number) => {
    if (!currentPet) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPet(prev => prev ? {
        ...prev,
        health: Math.min(100, prev.health + CONFIG.GAME_CONSTANTS.HEALTH_GAIN_PER_FEED),
        happiness: Math.min(100, prev.happiness + CONFIG.GAME_CONSTANTS.HAPPINESS_GAIN_PER_FEED),
        totalStaked: prev.totalStaked + amount,
        feedingStreak: prev.feedingStreak + 1,
        lastFedTimestamp: Date.now(),
      } : null);
      
      console.log('🎉 Pet fed successfully!');
      alert('🎉 Pet fed successfully! +20 Health, +25 Happiness');
      
    } catch (error) {
      console.error('Feed failed:', error);
      alert('Failed to feed pet. Transaction rejected.');
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async (amount: number) => {
    if (!currentPet) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPet(prev => prev ? {
        ...prev,
        health: Math.max(0, prev.health - 30),
        happiness: Math.max(0, prev.happiness - 40),
        totalStaked: Math.max(0, prev.totalStaked - amount),
        feedingStreak: 0,
      } : null);
      
      console.log('💔 Withdrawal successful');
      alert('💔 Withdrawal successful, but your pet is sad...');
      
    } catch (error) {
      console.error('Withdraw failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const mintPet = async (type: 'dragon' | 'pig' | 'puppy', name: string) => {
    setLoading(true);
    try {
      console.log('🔌 Calling backend API to create pet...');
      
      const response = await fetch(`${API_BASE_URL}/goal/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey || 'DEMO_WALLET',
          petName: name,
          petType: type,
          goalAmount: 5000,
          depositAmount: 50
        })
      });
      
      const data = await response.json();
      console.log('✅ Backend response:', data);
      
      if (!data.success) {
        throw new Error('Backend failed to create pet');
      }

      const newPet: Pet = {
        id: data.data.userId,
        name,
        type,
        owner: publicKey!,
        health: data.data.petState.health,
        happiness: data.data.petState.happiness,
        level: 1,
        evolutionStage: 0,
        totalStaked: 0,
        feedingStreak: 0,
        lastFedTimestamp: Date.now(),
        battlesWon: 0,
        createdAt: Date.now(),
        accessories: [],
      };
      
      setCurrentPet(newPet);
      console.log('✅ Pet saved to database!');
      alert(`🎉 ${name} the ${type} has been born and saved to database!`);
      
    } catch (error: any) {
      console.error('Error creating pet:', error);
      
      const fallbackPet: Pet = {
        id: `pet-${Date.now()}`,
        name,
        type,
        owner: publicKey!,
        health: 100,
        happiness: 100,
        level: 1,
        evolutionStage: 0,
        totalStaked: 0,
        feedingStreak: 0,
        lastFedTimestamp: Date.now(),
        battlesWon: 0,
        createdAt: Date.now(),
        accessories: [],
      };
      setCurrentPet(fallbackPet);
      alert(`⚠️ Backend failed, using fallback.\n\n${name} the ${type} created locally!`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      refreshPetData();
    } else {
      setCurrentPet(null);
      setStakingInfo(null);
    }
  }, [publicKey]);

  return (
    <PetContext.Provider
      value={{
        currentPet,
        stakingInfo,
        loading,
        feedPet,
        withdrawFunds,
        mintPet,
        refreshPetData,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePet must be used within PetProvider');
  return context;
};