import React from "react";
import { Card } from "../components/ui/Card";
import { Award, Calendar, TrendingUp, Target } from "lucide-react";

const Profile: React.FC = () => {
  const achievements = [
    {
      icon: "🎯",
      name: "First Feed",
      description: "Fed your pet for the first time",
      earned: true,
    },
    {
      icon: "🔥",
      name: "7-Day Streak",
      description: "Fed your pet 7 days in a row",
      earned: true,
    },
    {
      icon: "💎",
      name: "Diamond Hands",
      description: "Staked over $500",
      earned: false,
    },
    {
      icon: "🏆",
      name: "Top 10",
      description: "Reached top 10 on leaderboard",
      earned: false,
    },
    {
      icon: "👑",
      name: "Pet Master",
      description: "Reached Level 10",
      earned: false,
    },
    {
      icon: "💰",
      name: "Whale",
      description: "Staked over $5000",
      earned: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          👤 Your Profile
        </h1>
        <p className="text-gray-400">Track your journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glowColor="green">
          <div className="flex items-center gap-4">
            <Calendar className="text-green-400" size={32} />
            <div>
              <div className="text-2xl font-bold text-white">30 days</div>
              <div className="text-sm text-gray-400">Member Since</div>
            </div>
          </div>
        </Card>
        <Card glowColor="purple">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-purple-400" size={32} />
            <div>
              <div className="text-2xl font-bold text-white">$250</div>
              <div className="text-sm text-gray-400">Total Saved</div>
            </div>
          </div>
        </Card>
        <Card glowColor="orange">
          <div className="flex items-center gap-4">
            <Target className="text-orange-400" size={32} />
            <div>
              <div className="text-2xl font-bold text-white">50%</div>
              <div className="text-sm text-gray-400">Goal Progress</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card glowColor="blue">
        <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
          <Award size={28} />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`
                rounded-xl p-4 border transition-all
                ${
                  achievement.earned
                    ? "bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/20"
                    : "bg-slate-800/30 border-slate-700/30 opacity-50"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-1">
                    {achievement.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {achievement.description}
                  </div>
                  {achievement.earned && (
                    <div className="text-xs text-green-400 mt-2">
                      ✓ Unlocked
                    </div>
                  )}
                  {!achievement.earned && (
                    <div className="text-xs text-gray-500 mt-2">🔒 Locked</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity History */}
      <Card glowColor="purple">
        <h2 className="text-2xl font-bold text-purple-300 mb-6">
          📊 Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            {
              action: "Fed pet",
              amount: "+$50",
              time: "2 hours ago",
              type: "feed",
            },
            {
              action: "Fed pet",
              amount: "+$50",
              time: "1 day ago",
              type: "feed",
            },
            {
              action: "Withdrew funds",
              amount: "-$25",
              time: "3 days ago",
              type: "withdraw",
            },
            {
              action: "Fed pet",
              amount: "+$75",
              time: "4 days ago",
              type: "feed",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`text-2xl ${
                    activity.type === "feed" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {activity.type === "feed" ? "🍖" : "💸"}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {activity.action}
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              </div>
              <div
                className={`font-bold ${
                  activity.type === "feed" ? "text-green-400" : "text-red-400"
                }`}
              >
                {activity.amount}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
