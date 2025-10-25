import React from 'react';
import { clsx } from 'clsx';

interface PetEmotionsProps {
  type: 'dragon' | 'pig' | 'puppy';
  health: number;
  happiness: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PetEmotions: React.FC<PetEmotionsProps> = ({
  type,
  health,
  happiness,
  size = 'xl',
}) => {
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-7xl',
    xl: 'text-8xl',
  };

  const getEmoji = () => {
    const baseEmojis = {
      dragon: '🐉',
      pig: '🐷',
      puppy: '🐶',
    };

    // Determine emotion based on health and happiness
    const avgState = (health + happiness) / 2;
    
    if (avgState >= 80) {
      // Happy and healthy
      return baseEmojis[type];
    } else if (avgState >= 50) {
      // Neutral
      return type === 'dragon' ? '🐲' : type === 'pig' ? '🐽' : '🐕';
    } else if (avgState >= 20) {
      // Sad
      return '😢';
    } else {
      // Very sad/sick
      return '😵';
    }
  };

  const getAnimation = () => {
    const avgState = (health + happiness) / 2;
    if (avgState >= 80) return 'animate-bounce-in';
    if (avgState >= 50) return '';
    return 'animate-pulse';
  };

  return (
    <div className={clsx(sizeClasses[size], getAnimation())}>
      {getEmoji()}
    </div>
  );
};



