import { createContext } from "react";
import { Pet, StakingInfo } from "../types";

export interface PetContextType {
  currentPet: Pet | null;
  stakingInfo: StakingInfo | null;
  loading: boolean;
  feedPet: (amount: number) => Promise<void>;
  withdrawFunds: (amount: number) => Promise<void>;
  mintPet: (type: "dragon" | "pig" | "puppy", name: string) => Promise<void>;
  refreshPetData: () => Promise<void>;
}

export const PetContext = createContext<PetContextType | undefined>(undefined);




