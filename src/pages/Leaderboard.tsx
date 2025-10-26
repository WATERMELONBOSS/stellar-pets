import React from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import {
  Trophy,
  Medal,
  Award,
  Heart,
  Flame,
  Zap,
  Star,
  Crown,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  ownerName: string; // Human readable name
  walletAddress: string; // Wallet address (can show on hover)
  petName: string;
  petType: "dragon" | "pig" | "puppy";
  happiness: number;
  health: number;
  level: number;
  evolutionStage: 0 | 1 | 2 | 3;
  rarity: "common" | "rare" | "epic" | "legendary";
  feedingStreak: number;
  achievements: string[];
  totalStaked: number;
}

const Leaderboard: React.FC = () => {
  // Enhanced mock data with owner names
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      ownerName: "Sarah from Work",
      walletAddress: "GABC...XYZ",
      petName: "Sparkles",
      petType: "dragon",
      happiness: 100,
      health: 100,
      level: 12,
      evolutionStage: 3,
      rarity: "legendary",
      feedingStreak: 45,
      achievements: ["🏆", "💎", "👑", "🔥", "⭐"],
      totalStaked: 5000,
    },
    {
      rank: 2,
      ownerName: "Mom",
      walletAddress: "GDEF...ABC",
      petName: "Piglet",
      petType: "pig",
      happiness: 95,
      health: 98,
      level: 10,
      evolutionStage: 2,
      rarity: "epic",
      feedingStreak: 38,
      achievements: ["🏆", "💎", "🔥", "⭐"],
      totalStaked: 3500,
    },
    {
      rank: 3,
      ownerName: "Dad",
      walletAddress: "GHIJ...DEF",
      petName: "Buddy",
      petType: "puppy",
      happiness: 92,
      health: 90,
      level: 8,
      evolutionStage: 2,
      rarity: "epic",
      feedingStreak: 30,
      achievements: ["🏆", "💎", "⭐"],
      totalStaked: 2800,
    },
    {
      rank: 4,
      ownerName: "Alex (Roommate)",
      walletAddress: "GKLM...GHI",
      petName: "Draco",
      petType: "dragon",
      happiness: 88,
      health: 85,
      level: 6,
      evolutionStage: 1,
      rarity: "rare",
      feedingStreak: 25,
      achievements: ["🏆", "🔥"],
      totalStaked: 2200,
    },
    {
      rank: 5,
      ownerName: "Little Sister",
      walletAddress: "GNOP...JKL",
      petName: "Hammy",
      petType: "pig",
      happiness: 85,
      health: 80,
      level: 5,
      evolutionStage: 1,
      rarity: "rare",
      feedingStreak: 20,
      achievements: ["🏆", "⭐"],
      totalStaked: 1800,
    },
    {
      rank: 6,
      ownerName: "Best Friend",
      walletAddress: "GQRS...MNO",
      petName: "Luna",
      petType: "puppy",
      happiness: 80,
      health: 75,
      level: 4,
      evolutionStage: 1,
      rarity: "common",
      feedingStreak: 15,
      achievements: ["🏆"],
      totalStaked: 1200,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl">
            <Trophy className="text-white" size={28} />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-xl">
            <Medal className="text-white" size={28} />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-xl">
            <Award className="text-white" size={28} />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-14 h-14 bg-slate-700 rounded-full border-2 border-slate-600">
            <span className="text-gray-300 font-bold text-xl">#{rank}</span>
          </div>
        );
    }
  };

  const getPetEmoji = (type: "dragon" | "pig" | "puppy", stage: number) => {
    const baseEmojis = { dragon: "🐉", pig: "🐷", puppy: "🐶" };
    return baseEmojis[type];
  };

  const getRarityBadge = (rarity: string) => {
    const rarityConfig = {
      common: {
        color: "from-gray-500 to-gray-600",
        text: "Common",
        glow: "shadow-gray-500/50",
      },
      rare: {
        color: "from-blue-500 to-blue-600",
        text: "Rare",
        glow: "shadow-blue-500/50",
      },
      epic: {
        color: "from-purple-500 to-pink-600",
        text: "Epic",
        glow: "shadow-purple-500/50",
      },
      legendary: {
        color: "from-yellow-400 to-orange-500",
        text: "Legendary",
        glow: "shadow-yellow-500/50",
      },
    };

    const config =
      rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.common;

    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${config.color} text-white text-sm font-bold shadow-lg ${config.glow}`}
      >
        {config.text}
      </div>
    );
  };

  const getEvolutionBadge = (stage: number) => {
    const stages = [
      { name: "Baby", icon: "🥚" },
      { name: "Teen", icon: "🌱" },
      { name: "Adult", icon: "⭐" },
      { name: "Mega", icon: "👑" },
    ];

    const current = stages[stage] || stages[0];

    return (
      <span className="bg-slate-700/80 px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1">
        {current.icon} {current.name}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
          🏆 Stella Leaderboard
        </h1>
        <p className="text-xl text-gray-300">Happiest & Strongest Companions</p>
        <p className="text-sm text-gray-400">
          Compete with friends to keep your Stella the happiest!
        </p>
      </motion.div>

      {/* Leaderboard Entries */}
      <Card glowColor="orange">
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`
                rounded-2xl p-6 transition-all cursor-pointer
                ${
                  entry.rank <= 3
                    ? "bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500/40"
                    : "bg-slate-700/40 border-2 border-slate-600/30"
                }
                hover:border-purple-500/60 hover:shadow-xl
              `}
            >
              <div className="flex items-start gap-5">
                {/* Rank Icon */}
                <div className="flex-shrink-0">{getRankIcon(entry.rank)}</div>

                {/* Pet Display */}
                <div className="flex-shrink-0">
                  <div className="text-6xl relative">
                    {getPetEmoji(entry.petType, entry.evolutionStage)}
                    {entry.evolutionStage === 3 && (
                      <motion.span
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-2 -right-2 text-2xl"
                      >
                        ✨
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Pet Name & Owner */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-white text-2xl">
                        {entry.petName}
                      </h3>
                      {getRarityBadge(entry.rarity)}
                      {getEvolutionBadge(entry.evolutionStage)}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="font-medium text-gray-300">
                        {entry.ownerName}
                      </span>
                      <span>•</span>
                      <span>Level {entry.level}</span>
                      <span>•</span>
                      <span className="text-xs font-mono">
                        {entry.walletAddress}
                      </span>
                    </div>
                  </div>

                  {/* Stats - ALWAYS VISIBLE */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Happiness - PRIMARY */}
                    <div className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border border-pink-500/30 rounded-xl p-3">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Heart className="text-pink-400" size={18} />
                        <span className="text-pink-400 font-bold text-2xl">
                          {entry.happiness}%
                        </span>
                      </div>
                      <div className="text-gray-300 text-xs text-center font-medium">
                        Happiness
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-xl p-3">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Flame className="text-orange-400" size={18} />
                        <span className="text-orange-400 font-bold text-2xl">
                          {entry.feedingStreak}
                        </span>
                      </div>
                      <div className="text-gray-300 text-xs text-center font-medium">
                        Day Streak
                      </div>
                    </div>

                    {/* Health */}
                    <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-xl p-3">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Zap className="text-green-400" size={18} />
                        <span className="text-green-400 font-bold text-2xl">
                          {entry.health}%
                        </span>
                      </div>
                      <div className="text-gray-300 text-xs text-center font-medium">
                        Health
                      </div>
                    </div>
                  </div>

                  {/* Achievement Badges */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-gray-400 font-medium">
                      NFT Badges:
                    </span>
                    <div className="flex gap-1">
                      {entry.achievements.map((badge, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.4, rotate: 15 }}
                          className="text-2xl cursor-pointer"
                          title="Achievement NFT Badge"
                        >
                          {badge}
                        </motion.span>
                      ))}
                      {entry.achievements.length === 0 && (
                        <span className="text-sm text-gray-600">None yet</span>
                      )}
                    </div>
                  </div>

                  {/* Additional Info - Shows on entry (not hover) */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-slate-700/50">
                    <span>Savings: ${entry.totalStaked.toLocaleString()}</span>
                    <span>•</span>
                    <span>NFTs: {entry.achievements.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Your Rank Card - Enhanced */}
      <Card glowColor="purple">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-400 font-medium">
              Your Stella's Rank
            </div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
            >
              #12
            </motion.div>
            <div className="text-gray-400">You (Milan)</div>
          </div>

          {/* Your Stella's Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-500/20 rounded-xl p-4 text-center">
              <Heart className="text-pink-400 mx-auto mb-2" size={24} />
              <div className="text-pink-400 font-bold text-3xl mb-1">75%</div>
              <div className="text-gray-300 text-sm font-medium">Happiness</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 rounded-xl p-4 text-center">
              <Flame className="text-orange-400 mx-auto mb-2" size={24} />
              <div className="text-orange-400 font-bold text-3xl mb-1">4</div>
              <div className="text-gray-300 text-sm font-medium">
                Day Streak
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-4 text-center">
              <Star className="text-purple-400 mx-auto mb-2" size={24} />
              <div className="text-purple-400 font-bold text-3xl mb-1">2</div>
              <div className="text-gray-300 text-sm font-medium">
                NFT Badges
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-400">
              Keep feeding Stella to climb the ranks! 🚀
            </p>
          </div>
        </div>
      </Card>

      {/* Achievement Legend */}
      <Card glowColor="blue">
        <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
          <Crown size={24} />
          NFT Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-all">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-white font-bold text-sm">Top Saver</div>
            <div className="text-gray-400 text-xs">Reach top 10</div>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-all">
            <div className="text-4xl mb-2">💎</div>
            <div className="text-white font-bold text-sm">Diamond Hands</div>
            <div className="text-gray-400 text-xs">Save $1000+</div>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-all">
            <div className="text-4xl mb-2">👑</div>
            <div className="text-white font-bold text-sm">Pet Master</div>
            <div className="text-gray-400 text-xs">Reach Level 10</div>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-all">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-white font-bold text-sm">Hot Streak</div>
            <div className="text-gray-400 text-xs">30-day streak</div>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-all">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-white font-bold text-sm">Consistent</div>
            <div className="text-gray-400 text-xs">7-day streak</div>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-all">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-white font-bold text-sm">Goal Crusher</div>
            <div className="text-gray-400 text-xs">Hit your goal</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-gray-400 text-center">
            💡 Each badge is a unique NFT minted on Stellar blockchain
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
