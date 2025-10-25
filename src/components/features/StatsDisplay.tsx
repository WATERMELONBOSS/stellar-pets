import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, DollarSign, Flame } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  color: 'green' | 'purple' | 'orange' | 'blue';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtitle, color }) => {
  const colors = {
    green: 'from-green-900/50 to-emerald-900/50 border-green-500/20',
    purple: 'from-purple-900/50 to-pink-900/50 border-purple-500/20',
    orange: 'from-orange-900/50 to-red-900/50 border-orange-500/20',
    blue: 'from-blue-900/50 to-cyan-900/50 border-blue-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6 text-center`}
    >
      <div className="flex justify-center mb-3 text-white opacity-80">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-300 mb-1">{label}</div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </motion.div>
  );
};

interface StatsDisplayProps {
  totalStaked: number;
  feedingStreak: number;
  totalSaved: number;
  achievements: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  totalStaked,
  feedingStreak,
  totalSaved,
  achievements,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<DollarSign size={32} />}
        label="Total Staked"
        value={`$${totalStaked}`}
        subtitle="Amount currently staked"
        color="green"
      />
      <StatCard
        icon={<Flame size={32} />}
        label="Feeding Streak"
        value={`${feedingStreak} days`}
        subtitle="Consecutive days fed"
        color="orange"
      />
      <StatCard
        icon={<TrendingUp size={32} />}
        label="Total Saved"
        value={`$${totalSaved}`}
        subtitle="Lifetime savings"
        color="purple"
      />
      <StatCard
        icon={<Award size={32} />}
        label="Achievements"
        value={achievements}
        subtitle="Badges earned"
        color="blue"
      />
    </div>
  );
};



