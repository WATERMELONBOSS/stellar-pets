import React, { useState } from 'react';
import { WalletProvider } from './contexts/WalletContext';
import { PetProvider } from './contexts/PetContext';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import { PetSelection } from './pages/PetSelection';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <PetSelection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WalletProvider>
      <PetProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900">
          <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
          {renderPage()}
        </div>
      </PetProvider>
    </WalletProvider>
  );
}