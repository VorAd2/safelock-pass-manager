import { createContext, useState } from "react";

export const VaultsContext = createContext();

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState([]);

  const addVault = (vault) => setVaults((prev) => [...prev, vault]);
  const setAllVaults = (vaultsArr) => setVaults(vaultsArr);
  const addCredentialByVaultTitle = (vaultTitle, credential) => {
    setVaults((prev) =>
      prev.map(vault =>
        vault.title === vaultTitle
          ? { ...vault, credentials: [...(vault.credentials || []), credential] }
          : vault
      )
    );
  };

  const getCredentialByTitle = (vaultTitle, credentialTitle) => {
    const vault = vaults.find(v => v.title == vaultTitle)
    if (!vault) return undefined
    return (vault.credentials || []).find(c => c.credentialTitle == credentialTitle)
  }

  return (
    <VaultsContext.Provider 
    value={
      { vaults, addVault, setAllVaults, addCredentialByVaultTitle, 
      getCredentialByTitle }
    }>
      {children}
    </VaultsContext.Provider>
  );
}
