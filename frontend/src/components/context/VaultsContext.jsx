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

        const newVault = {
          ...vault,
          favoritedBy: updatedFavoritedBy,
        }
        console.log(`Vault ${vaultTitle} passado pelo setFav: ${JSON.stringify(newVault, null, 2)}`)
        return newVault
      })
    );
    console.log(`Novo estado de vaults: ${JSON.stringify(vaults, null, 2)}`)
  };

  const getFavorites = (username) => {
    return vaults.filter(vault => vault.favoritedBy.includes(username))
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
