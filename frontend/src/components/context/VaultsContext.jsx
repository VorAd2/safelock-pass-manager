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

  const setFavoritism = (vaultTitle, username, toFavorite) => {
    setVaults((prev) =>
      prev.map((vault) => {
        if (vault.title !== vaultTitle) return vault;
        const alreadyFavorited = vault.favoritedBy.includes(username);
        let updatedFavoritedBy;
        if (toFavorite && !alreadyFavorited) {
          updatedFavoritedBy = [...vault.favoritedBy, username];
        } else if (!toFavorite && alreadyFavorited) {
          updatedFavoritedBy = vault.favoritedBy.filter((user) => user !== username);
        } else {
          return vault;
        }

        return {
          ...vault,
          favoritedBy: updatedFavoritedBy,
        };
      })
    );
  };

  const getFavorites = (username) => {
    return vaults.favoritedBy.filter((name => name === username))
  }

  return (
    <VaultsContext.Provider 
    value={
      { vaults, addVault, setAllVaults, addCredentialByVaultTitle, setFavoritism, getFavorites }
    }>
      {children}
    </VaultsContext.Provider>
  );
}
