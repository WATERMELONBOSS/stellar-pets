
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { PetProvider } from './contexts/PetContext';
import { Navbar } from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import PetSelectionPage from './pages/PetSelectionPage';

export default function App() {
  return (
    <WalletProvider>
      <PetProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900">
            <Navbar />
            <Routes>
              {/* If no pet, force to pet selection */}
              <Route path="/select-pet" element={<PetSelectionPage />} />
              {/* Main app routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* Default route */}
              <Route path="/" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </PetProvider>
    </WalletProvider>
  );
}