import api from "./api";

class VaultService {
    async createVault(authToken, data) {
        const config = { headers: { 'Authorization': `Bearer ${authToken}` } }
        const res = await api.post('/dashboard/vaults', data, config)
        return res
    }

    async changeVaultTitle(authToken, data) {
        const config = { headers: { Authorization: `Bearer ${authToken}` } }
        await api.patch('/dashboard/vaults/title', data, config)
    }

    async favoriteVault(authToken, data) {
        const config = { headers: { Authorization: `Bearer ${authToken}` } }
        await api.patch('/dashboard/vaults/favoritism', data, config)
    }

    async sendVault(authToken, body) {
        const config = { headers: { Authorization: `Bearer ${authToken}` } }
        await api.patch('/dashboard/vaults/sharing', body, config)
    }

    async deleteVault(authToken, vault) {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                ownerUsername: vault.ownerUser,
                vaultId: vault._id,
                vaultTitle: vault.title
            }
        }
        await api.delete('/dashboard/vaults', config)
    }

    async deleteSharing(authToken, vault, username) {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                vaultId: vault._id,
                vaultTitle: vault.title,
                username
            }
        }
        await api.delete('/dashboard/vaults/sharing', config)
    }
}

export default new VaultService()