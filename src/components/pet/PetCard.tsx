import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { HealthBar } from '../ui/HealthBar';
import { PetEmotions } from './PetEmotions';
import { Button } from '../ui/Button';
import { Pet } from '../../types';

interface PetCardProps {
  pet: Pet;
  onFeed: () => void;
  onWithdraw: () => void;
  loading: boolean;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onFeed,
  onWithdraw,
  loading,
}) => {
  return (
    <Card glowColor="orange" hoverable>
      <h2 className="text-2xl font-bold text-orange-300 mb-6 flex items-center gap-2">
        🎃 Your Companion
      </h2>

      {/* Pet Display with Gradient Background */}
      <div className="text-center bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-orange-900/50 rounded-2xl p-8 mb-6 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 text-2xl opacity-30">🎃</div>
        <div className="absolute top-2 right-2 text-2xl opacity-30">👻</div>
        <div className="absolute bottom-2 left-2 text-2xl opacity-30">🦇</div>
        <div className="absolute bottom-2 right-2 text-2xl opacity-30">🕷️</div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PetEmotions
            type={pet.type}
            health={pet.health}
            happiness={pet.happiness}
            size="xl"
          />
        </motion.div>

        <h3 className="text-4xl font-bold text-white mt-4 mb-2">
          {pet.name}
        </h3>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
          <span className="bg-slate-800/50 px-3 py-1 rounded-full">
            Level {pet.level}
          </span>
          <span className="bg-slate-800/50 px-3 py-1 rounded-full">
            🔥 {pet.feedingStreak} day streak
          </span>
        </div>
      </div>

      {/* Health Bars */}
      <div className="space-y-4 mb-6">
        <HealthBar
          label="Health"
          value={pet.health}
          color="red"
          icon="❤️"
        />
        <HealthBar
          label="Happiness"
          value={pet.happiness}
          color="yellow"
          icon="😊"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-4 text-center border border-green-500/20"
        >
          <div className="text-green-400 font-bold text-3xl">
            ${pet.totalStaked}
          </div>
          <div className="text-gray-400 text-sm mt-1">Total Staked</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 text-center border border-purple-500/20"
        >
          <div className="text-purple-400 font-bold text-3xl">
            {pet.feedingStreak}
          </div>
          <div className="text-gray-400 text-sm mt-1">Feeding Streak</div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="success"
          onClick={onFeed}
          loading={loading}
          size="lg"
        >
          🍖 Feed ($50)
        </Button>
        <Button
          variant="danger"
          onClick={onWithdraw}
          loading={loading}
          size="lg"
        >
          💸 Withdraw
        </Button>
      </div>
    </Card>
  );
};



