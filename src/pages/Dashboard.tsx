import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PetCard } from '../components/pet/PetCard';
import { PetSelector } from '../components/pet/PetSelector';
import { StatsDisplay } from '../components/features/StatsDisplay';
import { FeedingModal } from '../components/features/FeedingModal';
import { useWallet } from '../contexts/WalletContext';
import { usePet } from '../contexts/PetContext';

export const Dashboard: React.FC = () => {
  const { isConnected, connect, connecting, balance } = useWallet();
  const { currentPet, loading, feedPet, withdrawFunds, mintPet } = usePet();
  const [showFeedingModal, setShowFeedingModal] = useState(false);

  // Handle feeding the pet - will close modal after successful feed
  const handleFeed = (amount: number) => {
    feedPet(amount);
    setShowFeedingModal(false);
  };

  // Handle withdrawing funds from the pet's staking balance
  const handleWithdraw = () => {
    withdrawFunds(25);
  };

  // Handle minting a new pet with selected type and name
  const handleMintPet = (type: 'dragon' | 'pig' | 'puppy', name: string) => {
    mintPet(type, name);
  };

  if (!isConnected) {
    console.log('🔄 Dashboard: Not connected, showing connect screen');
    return (
      <PageLayout title="🎃 Welcome to Stellar Pets" subtitle="Connect your wallet to begin your savings journey">
        <div className="max-w-md mx-auto">
          <Card glowColor="purple">
            <div className="text-center space-y-6">
              <div className="text-6xl">🎃</div>
              <h2 className="text-2xl font-bold text-purple-300">
                Connect Your Wallet
              </h2>
              <p className="text-gray-400">
                Connect your Stellar wallet to start saving with your digital pet companion!
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  console.log('🔄 Dashboard: Connect button clicked');
                  connect();
                }}
                loading={connecting}
                size="lg"
                className="w-full"
              >
                🔗 {connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="🎃 Dashboard" subtitle="Manage your pet and track your savings">
      <div className="space-y-6">
        {/* Stats Overview */}
        <StatsDisplay
          totalStaked={currentPet?.totalStaked || 0}
          feedingStreak={currentPet?.feedingStreak || 0}
          totalSaved={currentPet?.totalStaked || 0}
          achievements={0} /* Change from array to number */
        />

        {/* Pet Section */}
        {currentPet ? (
          <>
            <PetCard
              pet={currentPet}
              onFeed={() => setShowFeedingModal(true)}
              onWithdraw={handleWithdraw}
              loading={loading}
            />

          </>
        ) : (
          <PetSelector
            onSelect={handleMintPet}
            loading={loading}
          />
        )}

        {/* Quick Actions */}
        <Card glowColor="blue">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            🚀 Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/20 rounded-xl p-4 text-left hover:border-green-500/40 transition-all"
            >
              <div className="text-3xl mb-2">📈</div>
              <div className="text-white font-bold">View Analytics</div>
              <div className="text-gray-400 text-sm">Track your progress</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-xl p-4 text-left hover:border-purple-500/40 transition-all"
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white font-bold">Leaderboard</div>
              <div className="text-gray-400 text-sm">See top savers</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/20 rounded-xl p-4 text-left hover:border-orange-500/40 transition-all"
            >
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-white font-bold">Rewards</div>
              <div className="text-gray-400 text-sm">Claim achievements</div>
            </motion.button>
          </div>
        </Card>
      </div>

      {/* Feeding Modal */}
      {currentPet && (
        <FeedingModal
          isOpen={showFeedingModal}
          onClose={() => setShowFeedingModal(false)}
          onConfirm={handleFeed}
          currentBalance={balance}
          loading={loading}
        />
      )}
    </PageLayout>
  );
};



