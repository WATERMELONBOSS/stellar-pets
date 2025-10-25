import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface HealthBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: 'red' | 'yellow' | 'green' | 'blue' | 'purple';
  icon?: string;
  showPercentage?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  label,
  value,
  maxValue = 100,
  color = 'red',
  icon,
  showPercentage = true,
}) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  const colors = {
    red: 'from-red-500 to-pink-500',
    yellow: 'from-yellow-500 to-orange-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
  };

  const getEmotionColor = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    if (percentage >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className={clsx("font-medium", getEmotionColor())}>
          {icon && <span className="mr-1">{icon}</span>}
          {label}
        </span>
        {showPercentage && (
          <span className="text-white font-bold">
            {Math.round(value)}/{maxValue}
          </span>
        )}
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={clsx(
            "h-4 rounded-full shadow-lg bg-gradient-to-r",
            colors[color]
          )}
        />
      </div>
    </div>
  );
};



