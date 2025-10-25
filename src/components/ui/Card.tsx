import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'orange' | 'green' | 'blue' | 'pink';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glowColor = 'purple',
  hoverable = false,
}) => {
  const glowColors = {
    purple: 'border-purple-500/20 hover:border-purple-500/40',
    orange: 'border-orange-500/20 hover:border-orange-500/40',
    green: 'border-green-500/20 hover:border-green-500/40',
    blue: 'border-blue-500/20 hover:border-blue-500/40',
    pink: 'border-pink-500/20 hover:border-pink-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hoverable ? { scale: 1.02, y: -5 } : {}}
      className={clsx(
        "bg-slate-800/50 backdrop-blur border rounded-2xl p-6 shadow-2xl transition-all",
        glowColors[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
};



