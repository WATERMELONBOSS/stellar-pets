import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

interface HungerNotificationProps {
  petName: string;
  daysSinceLastFeed: number;
  onFeed: () => void;
  onDismiss: () => void;
}

export const HungerNotification: React.FC<HungerNotificationProps> = ({
  petName,
  daysSinceLastFeed,
  onFeed,
  onDismiss,
}) => {
  const isVisible = daysSinceLastFeed >= 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50 max-w-md w-full px-4"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-600 border-2 border-orange-400 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <Bell className="text-white mt-1 animate-pulse" size={24} />
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  🍖 Stella is Hungry!
                </h3>
                <p className="text-orange-100 text-sm">
                  It's been {daysSinceLastFeed} day{daysSinceLastFeed > 1 ? 's' : ''} since you last fed Stella. 
                  She's getting sad! 😢
                </p>
              </div>
              <button
                onClick={onDismiss}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <button
              onClick={onFeed}
              className="w-full bg-white hover:bg-gray-100 text-orange-600 font-bold py-2 rounded-lg mt-3 transition-all"
            >
              Feed Stella Now →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};