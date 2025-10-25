import React, { useState, useContext } from "react";
import type { ReactNode } from "react";
import { PetContext, type PetContextType } from "./PetContext.types";
import { WalletContext } from "./WalletContext.types";

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const walletContext = useContext(WalletContext);
  const publicKey = walletContext?.publicKey || null;
  const [currentPet, setCurrentPet] = useState(null);
  const [stakingInfo, setStakingInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simple functions that don't do anything complex
  const feedPet = async (amount: number) => {
    console.log("Feed pet called with amount:", amount);
  };

  const withdrawFunds = async (amount: number) => {
    console.log("Withdraw funds called with amount:", amount);
  };

  const mintPet = async (type: "dragon" | "pig" | "puppy", name: string) => {
    console.log("Mint pet called with type:", type, "name:", name);
  };

  const refreshPetData = async () => {
    console.log("Refresh pet data called");
  };

  return (
    <PetContext.Provider
      value={{
        currentPet,
        stakingInfo,
        loading,
        feedPet,
        withdrawFunds,
        mintPet,
        refreshPetData,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};




