const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware.cjs');
const { connectedUsers } = require('../index.cjs');

const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');
const CredentialModel = require('../models/Credential.cjs');


function emitSocketEvent(data) {
    const {recipientUsername, vaultId, senderUsername, ownerUsername, vaultTitle, sharedUsers, event} = data
    const { allUsers, emitter } = data
    switch (event) {
        case 'vaultShared':
            const recipientSocket = connectedUsers.get(recipientUsername);
            if (recipientSocket) {
                recipientSocket.emit('vaultShared', {
                    vaultId,
                    emitter: senderUsername,
                    message: `${ownerUsername} shared the vault ${vaultTitle} with you.`
                });
            }
            break
        case 'vaultDeleted':
            for (const username of sharedUsers) {
                const recipientSocket = connectedUsers.get(username);
                if (recipientSocket) {
                    recipientSocket.emit('vaultDeleted', {
                        vaultId,
                        emitter: ownerUsername,
                        message: `The vault ${vaultTitle} (${ownerUsername}) shared with you has been deleted`
                    });
                }
            }
            break
        case 'vaultSharingRemoved':
            const array = [...allUsers.sharedUsers, allUsers.vaultOwner];
            for (const us of array) {
                const recipientSocket = connectedUsers.get(us)
                if (recipientSocket && us !== emitter) {
                    recipientSocket.emit('vaultSharingRemoved', {
                        vaultId,
                        emitter: emitter,
                        message: `${emitter} has left the shared vault ${vaultTitle}. All his relative credentials were deleted.`,
                    });
                }
            }
            break
        default:
            console.error(`Unknown event type: ${event}`);
    }
    
}


module.exports = (db) => {
    router.get('/', (req, res) => {
        res.json({ message: 'Get na API de Vault!' });
    });

    router.get('/:username', authenticateToken, async (req, res) => {
        const { username } = req.params;
        if (req.userData.username !== username) {
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.', code: 'ACCESS_DENIED' });
        }
        try {
            const vaultsArray = await VaultModel.getVaultsByUser(username, db);
            if (vaultsArray.length === 0) {
                return res.status(204).json({ message: 'Nenhum vault encontrado para este usuário.' });
            }
            return res.status(200).json(vaultsArray);
        } catch (err) {
            console.error('Erro ao buscar vaults:', err.message);
            return res.status(500).json({ message: 'Erro ao buscar vaults.' });
        }
    });

    router.post('/', authenticateToken, async (req, res) => {
        const {ownerUser, title, pin, desc} = req.body.newVaultData
        if (req.userData.username !== ownerUser) {
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.', code: 'ACCESS_DENIED' });
        }
        try {
            const isDuplicateVault = await VaultModel.isDuplicateVault(db, title, ownerUser)
            if (isDuplicateVault) {
                return res.status(409).json({code: 'DUPLICATE_VAULT'})
            }
            const newVaultData = await VaultModel.insertVault({ownerUser, title, pin, desc}, db)
            const vaultId = newVaultData.insertedId
            const vault = newVaultData.vault
            await UserModel.addVault(ownerUser, vaultId, db)
            return res.status(201).json({ message: 'Vault criado com sucesso', vault: vault });
        } catch (err) {
            console.log('Erro inesperado no POST de Vault: ' + err.message)
            return res.status(500).json({message: err.message});
        }
    })

    router.patch('/favoritism', authenticateToken, async (req, res) => {
        const {username} = req.body
        if (req.userData.username !== username) {
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.', code: 'ACCESS_DENIED' });
        }
        const {toFavorite, vaultId} = req.body
        try {
            await VaultModel.favoritism(toFavorite, vaultId, username, db)
            return res.status(200).json({message: 'Favoritismo de vault atualizado'})
        } catch (err) {
            console.log(`Erro inesperado no PATCH favoritism: ${JSON.stringify(err)}`)
            return res.status(500).json({message: err.message})
        }
    })

    router.patch('/sharing', authenticateToken, async (req, res) => {
        const { senderUsername } = req.body
        if (req.userData.username !== senderUsername) {
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.', code: 'ACCESS_DENIED' });
        }
        const {ownerUsername, vaultId, vaultTitle, recipientUsername} = req.body
        if (ownerUsername !== senderUsername) {
            const msg = `Usuário remetente não possui autorização para compartilhar o cofre: ${ownerUsername} .. ${senderUsername}`
            return res.status(403).json({message: msg})
        }
        if (ownerUsername === recipientUsername) {
            const msg = `Usuário remetente não pode compartilhar um vault consigo mesmo`
            return res.status(403).json({message: msg})
        }
        try {
            const recipientData = await UserModel.getUserByName(db, recipientUsername)
            if (recipientData === null) {
                return res.status(404).json({message: 'Recipient user not found', code: 'RECIPIENT_NOT_FOUND'})
            } else if (recipientData.allVaults.includes(vaultId)) {
                return res.status(409).json({message: 'Recipient user already has this vault', code: 'RECIPIENT_ALREADY'}) 
            }
            await VaultModel.sharing(db, vaultId, recipientUsername)
            await UserModel.addVault(recipientUsername, vaultId, db)
            emitSocketEvent({recipientUsername, vaultId, senderUsername, ownerUsername, vaultTitle, event: 'vaultShared'})
            return res.status(200).json(
                {message: `Vault compartilhado com sucesso entre ${ownerUsername} e ${recipientUsername}`}
            )
        } catch (err) {
            console.log(`Erro no compartilhamento de vault: ${err}`)
            return res.status(500).json({ message: 'Erro interno ao compartilhar vault' })
        }
         
    })

    router.delete('/', authenticateToken, async (req, res) => {
        const { ownerUsername } = req.body
        if (req.userData.username !== ownerUsername) {
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.', code: 'ACCESS_DENIED' });
        }
        try {
            const {vaultId, vaultTitle} = req.body
            const vault = await VaultModel.getVaultById(db, vaultId)
            const sharedUsers = vault.sharedUsers
            await UserModel.removeVault(db, vaultId, ownerUsername, sharedUsers)
            await CredentialModel.deleteAllVaultCredentials(db, vaultId)
            await VaultModel.deleteVault(db, vaultId)
            emitSocketEvent({
                vaultId,
                vaultTitle,
                ownerUsername,
                sharedUsers,
                event: 'vaultDeleted'
            })
            return res.status(200).json({message: 'Vault deleted successfully'})
        } catch (err) {
            console.log(`Erro ao deletar vault: ${err}`)
            return res.status(500).json({message: 'Erro ao deletar vault'})
        }
    })

    router.delete('/sharing', authenticateToken, async (req, res) => {
        const {vaultId, vaultTitle, username} = req.body
        if (req.userData.username !== username) {
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.', code: 'ACCESS_DENIED' });
        }
        try {
            const thereWasVault = await UserModel.removeVaultSharing(db, vaultId, username)
            if (thereWasVault) {
                await VaultModel.removeVaultSharing(db, vaultId, username)
                await CredentialModel.deleteUnsharedCredentials(db, vaultId, username)
                const allUsers = await VaultModel.getSharedUsersAndOwner(db, vaultId)
                emitSocketEvent({
                    vaultId,
                    vaultTitle,
                    allUsers,
                    emitter: username,
                    event: 'vaultSharingRemoved'
                })
                return res.status(200).json({message: 'Vault sharing removed successfully'})
            } else {
                return res.status(404).json({code: 'VAULT_SHARING_NOT_FOUND'})
            }
        } catch (err) {
            console.log(`Erro ao deletar compartilhamento de vault: ${err}`)
            return res.status(500).json({message: 'Error deleting vault sharing. Please, try again'})
        }
    })

    return router
}