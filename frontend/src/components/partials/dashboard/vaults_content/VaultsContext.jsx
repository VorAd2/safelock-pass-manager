import { createContext, useContext, useState } from "react";

const VaultsContext = createContext();

export function useVaults() {
  return useContext(VaultsContext);
}

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState([]);

  const addVault = (vault) => setVaults((prev) => [...prev, vault]);
  const setAllVaults = (vaultsArr) => setVaults(vaultsArr);

  return (
    <VaultsContext.Provider value={{ vaults, addVault, setAllVaults }}>
      {children}
    </VaultsContext.Provider>
  );
}