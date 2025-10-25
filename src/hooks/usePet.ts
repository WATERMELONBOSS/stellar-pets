import { useContext } from "react";
import { PetContext } from "../contexts/PetContext.types";

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) throw new Error("usePet must be used within PetProvider");
  return context;
};
