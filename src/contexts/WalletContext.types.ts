import { createContext } from "react";

export interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: number;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);




