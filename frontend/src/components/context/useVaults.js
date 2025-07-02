import { useContext } from "react";
import  {VaultsContext}  from "./VaultsContext";

export function useVaults() {
  return useContext(VaultsContext);
}