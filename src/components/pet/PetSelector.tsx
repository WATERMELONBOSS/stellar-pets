import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { CONFIG } from '../../constants/config';

interface PetSelectorProps {
  onSelect: (type: 'dragon' | 'pig' | 'puppy', name: string) => void;
  loading: boolean;
}

export const PetSelector: React.FC<PetSelectorProps> = ({ onSelect, loading }) => {
  return (
    <Card glowColor="pink">
      <h2 className="text-2xl font-bold text-pink-300 mb-4 text-center">
        🎃 Choose Your Companion!
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Select a pet to begin your savings journey
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONFIG.PET_TYPES.map((petType) => (
          <motion.button
            key={petType.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(
              petType.id as 'dragon' | 'pig' | 'puppy',
              petType.id === 'dragon' ? 'Sparkles' : petType.id === 'pig' ? 'Oinkers' : 'Buddy'
            )}
            disabled={loading}
            className="bg-gradient-to-br from-slate-800 to-slate-900 hover:from-purple-900 hover:to-pink-900 border border-purple-500/20 rounded-xl p-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-6xl mb-3">{petType.emoji}</div>
            <div className="text-xl font-bold text-white mb-2">{petType.name}</div>
            <div className="text-sm text-gray-400">{petType.description}</div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
};



