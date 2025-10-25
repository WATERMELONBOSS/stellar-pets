import React from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PetSelector } from '../components/pet/PetSelector';
import { useWallet } from '../contexts/WalletContext';
import { usePet } from '../contexts/PetContext';

export const PetSelection: React.FC = () => {
  const { isConnected, connect, connecting } = useWallet();
  const { currentPet, loading, mintPet } = usePet();

  const handleMintPet = (type: 'dragon' | 'pig' | 'puppy', name: string) => {
    mintPet(type, name);
  };

  if (!isConnected) {
    return (
      <PageLayout title="🎃 Pet Selection" subtitle="Connect your wallet to choose a pet">
        <div className="max-w-md mx-auto">
          <Card glowColor="purple">
            <div className="text-center space-y-6">
              <div className="text-6xl">🔗</div>
              <h2 className="text-2xl font-bold text-purple-300">
                Wallet Required
              </h2>
              <p className="text-gray-400">
                Please connect your wallet to select and mint your pet companion.
              </p>
              <Button
                variant="primary"
                onClick={connect}
                loading={connecting}
                size="lg"
                className="w-full"
              >
                🔗 Connect Wallet
              </Button>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (currentPet) {
    return (
      <PageLayout title="🎃 Pet Already Selected" subtitle="You already have a pet companion!">
        <div className="max-w-md mx-auto">
          <Card glowColor="green">
            <div className="text-center space-y-6">
              <div className="text-6xl">✅</div>
              <h2 className="text-2xl font-bold text-green-300">
                Pet Already Owned
              </h2>
              <p className="text-gray-400">
                You already have <strong>{currentPet.name}</strong> the {currentPet.type}!
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-4xl mb-2">
                  {currentPet.type === 'dragon' ? '🐉' : 
                   currentPet.type === 'pig' ? '🐷' : '🐶'}
                </div>
                <div className="text-white font-bold">{currentPet.name}</div>
                <div className="text-gray-400 text-sm">
                  Level {currentPet.level} • {currentPet.feedingStreak} day streak
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/dashboard'}
                size="lg"
                className="w-full"
              >
                🏠 Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="🎃 Choose Your Pet" subtitle="Select your digital companion to start saving">
      <div className="space-y-6">
        {/* Pet Selection */}
        <PetSelector
          onSelect={handleMintPet}
          loading={loading}
        />

        {/* Pet Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card glowColor="red">
            <div className="text-center">
              <div className="text-4xl mb-3">🐉</div>
              <h3 className="text-xl font-bold text-red-300 mb-2">Dragon</h3>
              <p className="text-gray-400 text-sm mb-4">
                Fierce and loyal companion. Perfect for long-term savers.
              </p>
              <div className="space-y-2 text-xs text-gray-300">
                <div>• High health regeneration</div>
                <div>• Bonus staking rewards</div>
                <div>• Rare evolution stages</div>
              </div>
            </div>
          </Card>

          <Card glowColor="pink">
            <div className="text-center">
              <div className="text-4xl mb-3">🐷</div>
              <h3 className="text-xl font-bold text-pink-300 mb-2">Piggy</h3>
              <p className="text-gray-400 text-sm mb-4">
                Cheerful and lucky friend. Great for consistent daily savers.
              </p>
              <div className="space-y-2 text-xs text-gray-300">
                <div>• Lucky streak bonuses</div>
                <div>• Daily reward multipliers</div>
                <div>• Happy mood boosts</div>
              </div>
            </div>
          </Card>

          <Card glowColor="blue">
            <div className="text-center">
              <div className="text-4xl mb-3">🐶</div>
              <h3 className="text-xl font-bold text-blue-300 mb-2">Puppy</h3>
              <p className="text-gray-400 text-sm mb-4">
                Playful and loving buddy. Ideal for new savers.
              </p>
              <div className="space-y-2 text-xs text-gray-300">
                <div>• Easy to care for</div>
                <div>• Quick happiness gains</div>
                <div>• Beginner-friendly</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Minting Process Info */}
        <Card glowColor="green">
          <h3 className="text-xl font-bold text-green-300 mb-4">
            🎯 How Pet Minting Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">1️⃣</div>
              <div className="font-bold text-white">Choose Pet</div>
              <div className="text-gray-400">Select your companion type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">2️⃣</div>
              <div className="font-bold text-white">Mint NFT</div>
              <div className="text-gray-400">Create unique pet token</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">3️⃣</div>
              <div className="font-bold text-white">Start Saving</div>
              <div className="text-gray-400">Begin feeding & staking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">4️⃣</div>
              <div className="font-bold text-white">Evolve</div>
              <div className="text-gray-400">Watch your pet grow!</div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};



