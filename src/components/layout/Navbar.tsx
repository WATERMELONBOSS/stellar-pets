import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Home, Trophy, User } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { isConnected, publicKey, disconnect } = useWallet();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-900/80 backdrop-blur border-b border-purple-500/20 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="text-3xl">🎃</div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Stellar Pets
          </div>
        </motion.div>

        {/* Navigation Items */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Wallet Status */}
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-900/50 px-3 py-2 rounded-lg border border-green-500/20">
                <Wallet size={16} className="text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnect}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Disconnect
              </motion.button>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Wallet not connected
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};



