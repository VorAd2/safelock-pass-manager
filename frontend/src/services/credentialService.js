import api from "./api";

class CredentialService {
    async createCredential(authToken, newCredential) {
        const config = { headers: { Authorization: `Bearer ${authToken}` } }
        const res = await api.post('/dashboard/vaults/credentials',
            newCredential,
            config
        )
        return res
    }

    async deleteCredential(authToken, vault, credential, username) {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                vaultId: vault._id,
                vaultTitle: vault.title,
                credential,
                username
            }
        }
        const res = await api.delete('/dashboard/vaults/credentials', config)
        return res
    }
}

export default new CredentialService()