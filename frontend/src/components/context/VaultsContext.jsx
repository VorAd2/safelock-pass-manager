/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { AvatarColorManager } from "../shared";

export const VaultsContext = createContext();

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState([])

  const changeVaultTitle = (vaultId, newTitle) => {
    setVaults((prev) => 
      prev.map(vault =>
        vault._id === vaultId
          ? {...vault, title: newTitle}
          : vault
      )
    )
  }

  const addVault = (vault) => setVaults((prev) => [...prev, vault])

  const deleteVault = (vaultId, vaultOwner) => {
    setVaults((prev) => prev.filter(vault => vault._id !== vaultId));
    const ownerStillExists = vaults.find(vault => vault.ownerUser === vaultOwner)
    if (!ownerStillExists) {
      AvatarColorManager.removeUserColor(vaultOwner);
    }
  }

  const isDuplicateVault = (vaultTitle, ownerUser) => {
    for (let vault of vaults) {
      if (vault.title === vaultTitle && vault.ownerUser === ownerUser) return true;
    }
    return false
  }

  const setAllVaults = (vaultsArr) => setVaults(vaultsArr);

  const addCredential = (vaultId, credential) => {
    setVaults((prev) =>
      prev.map(vault =>
        vault._id === vaultId
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

  const setFavoritism = (vaultId, username, toFavorite) => {
    setVaults((prev) =>
      prev.map((vault) => {
        if (vault._id !== vaultId) return vault;
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

  const setSharing = (vaultId, recipientUsername) => {
    setVaults((prev) => {
      return prev.map(vault => {
        if (vault._id !== vaultId) return vault;
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
      { vaults, changeVaultTitle, addVault, deleteVault, isDuplicateVault, setAllVaults, addCredential, deleteCredential, setFavoritism, getFavorites, setSharing, getShared }
    }>
      {children}
    </VaultsContext.Provider>
  );
}
