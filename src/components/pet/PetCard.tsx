import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { HealthBar } from '../ui/HealthBar';
import { Button } from '../ui/Button';
import { Pet } from '../../types';
import { AlertCircle, Heart, Sparkles } from 'lucide-react';

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
  // Calculate if pet needs feeding (more than 1 day since last feed)
  const daysSinceLastFeed = Math.floor((Date.now() - pet.lastFedTimestamp) / (1000 * 60 * 60 * 24));
  const isHungry = daysSinceLastFeed >= 1;
  const avgHealth = (pet.health + pet.happiness) / 2;

  // Get pet display image using our existing images
  const getPetImage = () => {
    const petImages = {
      dragon: '/Dragon-pet-removebg.png',
      pig: '/Pig-pet-removebg.png',
      puppy: '/Puppy-pet-removebg.png',
    };
    return petImages[pet.type];
  };

  return (
    <Card glowColor="orange" hoverable>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-orange-300 flex items-center gap-2">
          <img 
            src="/stella-logo-removebg-preview.png"
            alt="Stella Logo"
            className="w-8 h-8 object-contain"
          />
          Stella - Your Companion
        </h2>
        {isHungry && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="bg-red-900/30 border border-red-500/50 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-red-400 text-sm font-bold">Hungry!</span>
          </motion.div>
        )}
      </div>

      {/* Pet Display Area with enhanced visuals */}
      <div className="text-center bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-orange-900/50 rounded-2xl p-8 mb-6 relative overflow-hidden">
        {/* Hungry notification overlay */}
        {isHungry && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur px-4 py-2 rounded-full z-10 shadow-xl"
          >
            <span className="text-white font-bold text-sm">Stella is hungry! Feed me!</span>
          </motion.div>
        )}

        <motion.div
          animate={{ 
            y: avgHealth > 70 ? [0, -10, 0] : avgHealth > 30 ? [0, -5, 0] : [0, 2, 0],
            rotate: avgHealth > 70 ? [0, 5, -5, 0] : [0, 0, 0, 0]
          }}
          transition={{ 
            duration: avgHealth > 70 ? 2 : 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative h-48 flex items-center justify-center"
        >
          <img 
            src={getPetImage()}
            alt={`Stella the ${pet.type}`}
            className="w-48 h-48 object-contain"
            style={{ filter: avgHealth < 50 ? 'grayscale(50%)' : 'none' }}
          />
        </motion.div>

        <h3 className="text-4xl font-bold text-white mt-4 mb-2">
          Stella
        </h3>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
          <span className="bg-slate-800/50 px-3 py-1 rounded-full">
            Level {pet.level}
          </span>
          <span className="bg-slate-800/50 px-3 py-1 rounded-full">
            <Sparkles className="inline-block w-4 h-4 mr-1" /> {pet.feedingStreak} day streak
          </span>
        </div>
      </div>

      {/* Health Bars */}
      <div className="space-y-4 mb-6">
        <HealthBar
          label="Health"
          value={pet.health}
          color="red"
          icon={<Heart className="w-4 h-4 text-red-500" />}
        />
        <HealthBar
          label="Happiness"
          value={pet.happiness}
          color="yellow"
          icon={<Sparkles className="w-4 h-4 text-yellow-500" />}
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
          Feed Stella
        </Button>
        <Button
          variant="danger"
          onClick={onWithdraw}
          loading={loading}
          size="lg"
        >
          Withdraw
        </Button>
      </div>
    </Card>
  );
};



