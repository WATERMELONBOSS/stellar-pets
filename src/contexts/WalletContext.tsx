// Wallet connection and management context

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);

  const connect = async () => {
    setConnecting(true);
    try {
      console.log('🔄 Connecting wallet...');
      
      // 🔌 INTEGRATE FREIGHTER WALLET HERE
      // Example:
      // const freighter = await window.freighter.getPublicKey();
      // setPublicKey(freighter);
      
      // MOCK FOR DEMO - Replace with real wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      const mockKey = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      
      console.log('✅ Mock connection successful, updating state...');
      
      // Update state in a single batch
      setPublicKey(mockKey);
      setBalance(100.50);
      
      console.log('✅ Wallet connected! Public Key:', mockKey);
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      setPublicKey(null);
      setBalance(0);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      console.log('🔄 Resetting connecting state...');
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setBalance(0);
    console.log('👋 Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: !!publicKey,
        connecting,
        connect,
        disconnect,
        balance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};