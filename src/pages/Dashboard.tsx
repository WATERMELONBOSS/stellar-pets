
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { PetCard } from '../components/pet/PetCard';
import { StatsDisplay } from '../components/features/StatsDisplay';
import { FeedingModal } from '../components/features/FeedingModal';
import { useWallet } from '../contexts/WalletContext';
import { usePet } from '../contexts/PetContext';
import { Navigate } from 'react-router-dom';
import { HungerNotification } from '../components/features/HungerNotification';

const Dashboard: React.FC = () => {
  const [showHungerNotification, setShowHungerNotification] = useState(true);
  const { isConnected, balance } = useWallet();
  const { currentPet, loading, feedPet, withdrawFunds } = usePet();
  const [showFeedingModal, setShowFeedingModal] = useState(false);

  // Redirect to /select-pet if not connected or no pet
  if (!isConnected || !currentPet) {
    return <Navigate to="/select-pet" replace />;
  }

  // Handle feeding the pet - will close modal after successful feed
  const handleFeed = (amount: number) => {
    feedPet(amount);
    setShowFeedingModal(false);
  };

  // Handle withdrawing funds from the pet's staking balance
  const handleWithdraw = () => {
    withdrawFunds(25);
  };

  // Calculate days since last feed
  const daysSinceLastFeed = currentPet 
    ? Math.floor((Date.now() - currentPet.lastFedTimestamp) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <PageLayout title="🎃 Stella's Home" subtitle="Take care of Stella and watch your savings grow!">
      <div className="space-y-6">
        {/* Hunger Notification - Shows when Stella needs feeding */}
        <HungerNotification
          petName="Stella"
          daysSinceLastFeed={daysSinceLastFeed}
          onFeed={() => setShowFeedingModal(true)}
          onDismiss={() => setShowHungerNotification(false)}
        />
        {/* Stats Overview */}
        <StatsDisplay
          totalStaked={currentPet.totalStaked}
          feedingStreak={currentPet.feedingStreak}
          totalSaved={currentPet.totalStaked}
          achievements={0}
        />

        {/* Pet Section */}
        <PetCard
          pet={currentPet}
          onFeed={() => setShowFeedingModal(true)}
          onWithdraw={handleWithdraw}
          loading={loading}
        />

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
              onClick={() => window.location.href = '/leaderboard'}
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-xl p-4 text-left hover:border-purple-500/40 transition-all"
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white font-bold">Leaderboard</div>
              <div className="text-gray-400 text-sm">See top savers</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/profile'}
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
      <FeedingModal
        isOpen={showFeedingModal}
        onClose={() => setShowFeedingModal(false)}
        onConfirm={handleFeed}
        currentBalance={balance}
        loading={loading}
      />
    </PageLayout>
  );
};

export default Dashboard;



