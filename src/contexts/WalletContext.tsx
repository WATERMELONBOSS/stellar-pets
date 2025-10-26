// Real Freighter wallet with fallback to mock
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as freighterApi from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock wallet as fallback
const MOCK_WALLET = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);

  const connect = async () => {
    setConnecting(true);
    try {
      console.log('🔄 Attempting Freighter connection...');
      
      // Try real Freighter first
      const freighterInstalled = await freighterApi.isConnected();
      
      if (freighterInstalled) {
        console.log('✅ Freighter detected! Requesting access...');
        
        try {
          // Step 1: Request permission (triggers popup)
          console.log('📝 Requesting Freighter permission...');
          await freighterApi.requestAccess();
          console.log('✅ Permission granted!');
          
          // Step 2: Now get the address
          const result = await freighterApi.getAddress();
          console.log('🔍 DEBUG - getAddress result:', result);
          
          const address = typeof result === 'string' ? result : result?.address;
          console.log('🔍 DEBUG - final address:', address);
          
          if (address && address !== '') {
            console.log('✅ Real wallet connected:', address);
            setPublicKey(address);
            
            // Fetch real balance from Stellar testnet
            const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
            try {
              const account = await server.loadAccount(address);
              const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native');
              const realBalance = xlmBalance ? parseFloat(xlmBalance.balance) : 0;
              setBalance(realBalance);
              console.log('💰 Real balance:', realBalance, 'XLM');
              return; // Success! Exit early
            } catch (balanceErr) {
              console.log('Account not funded, balance = 0');
              setBalance(0);
              return; // Still success, just no balance
            }
          }
        } catch (freighterErr) {
          console.warn('⚠️ Freighter error, falling back to mock:', freighterErr);
        }
      } else {
        console.log('⚠️ Freighter not installed, using mock wallet');
      }
      
      // FALLBACK TO MOCK if Freighter fails
      console.log('📝 Using mock wallet for demo');
      await new Promise(resolve => setTimeout(resolve, 500));
      setPublicKey(MOCK_WALLET);
      setBalance(100.50);
      console.log('✅ Mock wallet connected');
      
    } catch (error) {
      console.error('❌ Connection failed:', error);
      // Last resort: use mock
      setPublicKey(MOCK_WALLET);
      setBalance(100.50);
    } finally {
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