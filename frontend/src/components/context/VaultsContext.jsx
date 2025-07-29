/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const VaultsContext = createContext();

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState([])

  const addVault = (vault) => setVaults((prev) => [...prev, vault])
  const deleteVault = (vaultId) => {
    setVaults((prev) => prev.filter(vault => vault._id !== vaultId));
  }
  const isDuplicateVault = (vaultTitle, ownerUser) => {
    for (let vault of vaults) {
      if (vault.title === vaultTitle && vault.ownerUser === ownerUser) return true;
    }
    return false
  }

  const setAllVaults = (vaultsArr) => setVaults(vaultsArr);

  const addCredentialByVaultTitle = (vaultTitle, credential) => {
    setVaults((prev) =>
      prev.map(vault =>
        vault.title === vaultTitle
          ? { ...vault, credentials: [...(vault.credentials || []), credential] }
          : vault
      )
    );
  }

  const deleteCredential = (vaultId, credential) => {
    setVaults((prev) => {
      return prev.map(vault => {
        if (vault._id !== vaultId) return vault;
        const updatedCredentials = vault.credentials.filter(c => c.credentialTitle !== credential.credentialTitle)
        return {...vault, credentials: updatedCredentials}
      })
    })
  }

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
        return newVault
      })
    );
  }

  const getFavorites = (username) => {
    return vaults.filter(vault => vault.favoritedBy.includes(username))
  }

  const setSharing = (vaultTitle, recipientUsername) => {
    setVaults((prev) => {
      return prev.map(vault => {
        if (vault.title !== vaultTitle) return vault;
        let updatedSharedUsers = [...vault.sharedUsers, recipientUsername];
        const newVault = {
          ...vault,
          sharedUsers: updatedSharedUsers
        }
        return newVault;
      })
    })
  }

  const getShared = () => {
    return vaults.filter(vault => vault.sharedUsers.length !== 0)
  }

  
  return (
    <VaultsContext.Provider 
    value={
      { vaults, addVault, deleteVault, isDuplicateVault, setAllVaults, addCredentialByVaultTitle, deleteCredential, setFavoritism, getFavorites, setSharing, getShared }
    }>
      {children}
    </VaultsContext.Provider>
  );
}
