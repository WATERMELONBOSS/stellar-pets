
// ...REPLACED WITH THE COMPLETE UI OVERHAUL CODE FROM THE USER'S MESSAGE...

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePet } from '../contexts/PetContext';
import { useWallet } from '../contexts/WalletContext';
import { Sparkles, Heart, Zap, Star } from 'lucide-react';

const PetSelectionPage: React.FC = () => {
  const { mintPet, loading } = usePet();
  const { isConnected, connect, connecting } = useWallet();
  const [selectedPet, setSelectedPet] = useState<'dragon' | 'pig' | 'puppy' | null>(null);
  const [petName, setPetName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  // Pet data with beautiful gradients and descriptions
  const pets = [
    {
      type: 'dragon' as const,
      emoji: '🐉',
      name: 'Dragon',
      tagline: 'Fierce & Powerful',
      description: 'A legendary creature with unmatched strength. Perfect for ambitious savers!',
      color: 'from-red-500 via-orange-500 to-yellow-500',
      bgColor: 'from-red-900/40 to-orange-900/40',
      traits: ['🔥 Fierce', '💪 Strong', '⚡ Fast'],
      defaultName: 'Sparkles',
    },
    {
      type: 'pig' as const,
      emoji: '🐷',
      name: 'Piggy',
      tagline: 'Lucky & Wealthy',
      description: 'A symbol of prosperity and good fortune. Bring wealth to your savings!',
      color: 'from-pink-500 via-purple-500 to-pink-600',
      bgColor: 'from-pink-900/40 to-purple-900/40',
      traits: ['🍀 Lucky', '💰 Wealthy', '😊 Happy'],
      defaultName: 'Oinkers',
    },
    {
      type: 'puppy' as const,
      emoji: '🐶',
      name: 'Puppy',
      tagline: 'Loyal & Loving',
      description: 'Your most faithful companion. Loyalty rewards consistency!',
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      bgColor: 'from-blue-900/40 to-cyan-900/40',
      traits: ['❤️ Loyal', '🎾 Playful', '⭐ Energetic'],
      defaultName: 'Buddy',
    },
  ];

  const handleSelectPet = (type: 'dragon' | 'pig' | 'puppy') => {
    setSelectedPet(type);
    const pet = pets.find(p => p.type === type);
    setPetName(pet?.defaultName || ''); // Pre-fill with default name
    setShowNameInput(true);
  };

  const handleMint = async () => {
    if (selectedPet && petName.trim()) {
      await mintPet(selectedPet, petName.trim());
    }
  };

  // If wallet not connected, show welcome screen
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          {/* Welcome card with glow effect */}
          <div className="relative">
            {/* Animated glow background */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 60px rgba(168, 85, 247, 0.3)',
                  '0 0 80px rgba(236, 72, 153, 0.4)',
                  '0 0 60px rgba(168, 85, 247, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl"
            />
            <div className="relative bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
              {/* Animated pumpkin */}
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl"
              >
                🎃
              </motion.div>
              <div className="space-y-3">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                  Stellar Pets
                </h1>
                <p className="text-xl text-gray-300">
                  Your Magical Savings Companion
                </p>
                <p className="text-sm text-gray-400">
                  Save money, feed your pet, watch it grow! 🌟
                </p>
              </div>
              {/* Connect button with animation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connect}
                disabled={connecting}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 text-white font-bold py-5 px-8 rounded-2xl transition-all disabled:opacity-50 shadow-2xl text-lg"
              >
                {connecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚡</motion.span>
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={20} />
                    Connect Wallet to Begin
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // If showing name input screen
  if (showNameInput && selectedPet) {
    const selected = pets.find(p => p.type === selectedPet)!;
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className={`bg-gradient-to-br ${selected.bgColor} backdrop-blur-xl border border-white/20 rounded-3xl p-10 space-y-8 shadow-2xl`}>
            {/* Animated pet emoji */}
            <div className="text-center space-y-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl inline-block"
              >
                {selected.emoji}
              </motion.div>
              <h2 className={`text-4xl font-bold bg-gradient-to-r ${selected.color} text-transparent bg-clip-text`}>
                Name Your {selected.name}!
              </h2>
              <p className="text-gray-300">Choose a name that reflects their personality</p>
            </div>
            {/* Name input with character count */}
            <div className="space-y-2">
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value.slice(0, 15))}
                placeholder="Enter a name..."
                maxLength={15}
                className="w-full bg-slate-800/50 border-2 border-slate-600 focus:border-purple-500 rounded-2xl px-6 py-4 text-white text-center text-2xl focus:outline-none transition-all"
                autoFocus
              />
              <div className="text-right text-sm text-gray-400">
                {petName.length}/15 characters
              </div>
            </div>
            {/* Selected pet traits */}
            <div className="flex justify-center gap-3">
              {selected.traits.map((trait, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 px-4 py-2 rounded-full text-sm text-gray-300"
                >
                  {trait}
                </motion.div>
              ))}
            </div>
            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowNameInput(false);
                  setSelectedPet(null);
                }}
                className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold py-4 rounded-xl transition-all"
                disabled={loading}
              >
                ← Back
              </button>
              <button
                onClick={handleMint}
                disabled={!petName.trim() || loading}
                className={`flex-2 bg-gradient-to-r ${selected.color} hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚡</motion.span>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={20} />
                    Create Pet!
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main pet selection screen
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900">
      <div className="max-w-7xl w-full space-y-10">
        {/* Header with floating particles effect */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 relative"
        >
          {/* Floating sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute text-3xl"
              style={{
                left: `${20 + i * 15}%`,
                top: -20,
              }}
            >
              ✨
            </motion.div>
          ))}
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            Choose Your Companion
          </h1>
          <p className="text-2xl text-gray-300">
            Your pet will grow stronger as you save! 🚀
          </p>
          <p className="text-gray-400">
            Select wisely - they'll be with you on your entire savings journey
          </p>
        </motion.div>
        {/* Pet cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.type}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="relative group cursor-pointer"
              onClick={() => handleSelectPet(pet.type)}
            >
              {/* Card glow effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 10px 60px rgba(0,0,0,0.3)',
                    `0 20px 80px ${pet.type === 'dragon' ? 'rgba(249, 115, 22, 0.4)' : pet.type === 'pig' ? 'rgba(236, 72, 153, 0.4)' : 'rgba(14, 165, 233, 0.4)'}`,
                    '0 10px 60px rgba(0,0,0,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl"
              />
              {/* Main card */}
              <div className={`relative bg-gradient-to-br ${pet.bgColor} backdrop-blur-xl border-2 border-white/10 group-hover:border-white/30 rounded-3xl p-8 transition-all overflow-hidden`}>
                {/* Animated background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pet.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Animated pet emoji */}
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                    className="text-9xl text-center"
                  >
                    {pet.emoji}
                  </motion.div>
                  {/* Pet name and tagline */}
                  <div className="text-center space-y-2">
                    <h3 className={`text-4xl font-bold bg-gradient-to-r ${pet.color} text-transparent bg-clip-text`}>
                      {pet.name}
                    </h3>
                    <p className="text-lg text-gray-300 font-medium">{pet.tagline}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{pet.description}</p>
                  </div>
                  {/* Pet traits */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {pet.traits.map((trait, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-slate-800/50 px-3 py-1 rounded-full text-xs text-gray-300"
                      >
                        {trait}
                      </motion.span>
                    ))}
                  </div>
                  {/* Select button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-r ${pet.color} text-white font-bold py-4 rounded-xl text-center shadow-lg`}
                  >
                    Choose {pet.name} →
                  </motion.div>
                  {/* Hover instruction */}
                  <div className="text-center text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                    Click to select
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-400 text-sm"
        >
          💡 Tip: Each pet has unique personality traits that affect their reactions!
        </motion.div>
      </div>
    </div>
  );
};

export default PetSelectionPage;
