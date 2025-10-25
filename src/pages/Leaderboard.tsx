// ===FILE: src/pages/Leaderboard.tsx===
import React from "react";
import { Card } from "../components/ui/Card";
import { Trophy, Medal, Award } from "lucide-react";
import { LeaderboardEntry } from "../types";

const Leaderboard: React.FC = () => {
  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      user: "GABC...XYZ",
      petName: "Sparkles",
      petType: "dragon",
      totalStaked: 5000,
      feedingStreak: 45,
      health: 100,
    },
    {
      rank: 2,
      user: "GDEF...ABC",
      petName: "Piglet",
      petType: "pig",
      totalStaked: 3500,
      feedingStreak: 38,
      health: 95,
    },
    {
      rank: 3,
      user: "GHIJ...DEF",
      petName: "Buddy",
      petType: "puppy",
      totalStaked: 2800,
      feedingStreak: 30,
      health: 90,
    },
    {
      rank: 4,
      user: "GKLM...GHI",
      petName: "Dragon",
      petType: "dragon",
      totalStaked: 2200,
      feedingStreak: 25,
      health: 85,
    },
    {
      rank: 5,
      user: "GNOP...JKL",
      petName: "Hammy",
      petType: "pig",
      totalStaked: 1800,
      feedingStreak: 20,
      health: 80,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-400" size={24} />;
      default:
        return (
          <div className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold">
            #{rank}
          </div>
        );
    }
  };

  const getPetEmoji = (type: "dragon" | "pig" | "puppy") => {
    const emojis = { dragon: "🐉", pig: "🐷", puppy: "🐶" };
    return emojis[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-400">Top Savers & Their Pets</p>
      </div>

      {/* Leaderboard Card */}
      <Card glowColor="orange">
        <div className="space-y-3">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-700 transition-all"
            >
              {/* Rank */}
              <div className="flex-shrink-0">{getRankIcon(entry.rank)}</div>

              {/* Pet */}
              <div className="text-4xl">{getPetEmoji(entry.petType)}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">
                  {entry.petName}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {entry.user}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold">
                    ${entry.totalStaked}
                  </div>
                  <div className="text-gray-500 text-xs">Staked</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold">
                    🔥 {entry.feedingStreak}
                  </div>
                  <div className="text-gray-500 text-xs">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-bold">{entry.health}%</div>
                  <div className="text-gray-500 text-xs">Health</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Rank */}
      <Card glowColor="purple">
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-400">Your Current Rank</div>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            #12
          </div>
          <div className="text-sm text-gray-400">
            Keep feeding your pet to climb higher!
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
