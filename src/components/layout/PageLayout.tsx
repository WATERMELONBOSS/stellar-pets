import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-400">{subtitle}</p>
          )}
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};



