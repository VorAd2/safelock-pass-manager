const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware.cjs');
const { io, connectedUsers } = require('../index.cjs');

const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');
const CredentialModel = require('../models/Credential.cjs');


module.exports = (db) => {
    router.get('/', (req, res) => {
        res.json({ message: 'Get na API de Vault!' });
    });

    router.get('/:username', authenticateToken, async (req, res) => {
        const { username } = req.params;
        if (req.userData.username !== username) {
            console.log('Backend - Nomes diferentes! Acesso NEGADO (403).');
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.' });
        }
        console.log(`username: ${username}`)
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
        console.log(`userData Username: ${req.userData.username}  ownerUser: ${ownerUser}`)
        if (req.userData.username !== ownerUser) {
            console.log('Backend - Nomes diferentes! Acesso NEGADO (403).');
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.' });
        }
        try {
            const isDuplicateVault = await VaultModel.isDuplicateVault(db, title, ownerUser)
            if (isDuplicateVault) {
                console.log(`Duplicate vault ${title} for ${ownerUser}`)
                return res.status(409).json({code: 'DUPLICATE_VAULT'})
            }
            const newVaultData = await VaultModel.insertVault({ownerUser, title, pin, desc}, db)
            const vaultId = newVaultData.insertedId
            console.log(`novo vault: ${JSON.stringify(newVaultData.vault)}`)
            const vault = newVaultData.vault
            await UserModel.addVault(ownerUser, vaultId, db)
            console.log('POST de Vault finalizado sem err')
            return res.status(201).json({ message: 'Vault criado com sucesso', vault: vault });
        } catch (err) {
            console.log('Erro inesperado no POST de Vault: ' + err.message)
            return res.status(500).json({message: err.message});
        }
    })

    router.patch('/favoritism', authenticateToken, async (req, res) => {
        const {toFavorite, vaultId, username} = req.body
        try {
            await VaultModel.favoritism(toFavorite, vaultId, username, db)
            return res.status(200).json({message: 'Favoritismo de vault atualizado'})
        } catch (err) {
            console.log(`Erro inesperado no PATCH favoritism: ${JSON.stringify(err)}`)
            return res.status(500).json({message: err.message})
        }
    })

    router.patch('/sharing', authenticateToken, async (req, res) => {
        const {ownerUsername, senderUsername, vaultId, vaultTitle, recipientUsername} = req.body
        console.log(`recipientUsername: ${recipientUsername}`)
        if (ownerUsername !== senderUsername) {
            const msg = `Usuário remetente não possui autorização para compartilhar o cofre: ${ownerUsername} .. ${senderUsername}`
            console.log(msg)
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
            const recipientSocket = connectedUsers.get(recipientUsername);
            if (recipientSocket) {
                recipientSocket.emit('vaultShared', {
                    vaultId,
                    emitter: senderUsername,
                    message: `${ownerUsername} shared the vault ${vaultTitle} with you.`
                });
            }
            return res.status(200).json(
                {message: `Vault compartilhado com sucesso entre ${ownerUsername} e ${recipientUsername}`}
            )
        } catch (err) {
            console.log(`Erro no compartilhamento de vault: ${err}`)
            return res.status(500).json({ message: 'Erro interno ao compartilhar vault' })
        }
         
    })

    router.delete('/', authenticateToken, async (req, res) => {
        try {
            const {ownerUsername, vaultId, vaultTitle} = req.body
            console.log(`${ownerUsername} e vault ${vaultId}`)
            const vault = await VaultModel.getVaultById(db, vaultId)
            const sharedUsers = vault.sharedUsers
            await UserModel.removeVault(db, vaultId, ownerUsername, sharedUsers)
            await CredentialModel.deleteAllCredentials(db, vaultId)
            await VaultModel.deleteVault(db, vaultId)
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
            return res.status(200).json({message: 'Vault deleted successfully'})
        } catch (err) {
            console.log(`Erro ao deletar vault: ${err}`)
            return res.status(500).json({message: 'Erro ao deletar vault'})
        }
    })

    router.delete('/sharing', authenticateToken, async (req, res) => {
        const {vaultId, username} = req.body
        try {
            const thereWasVault = await UserModel.removeVaultSharing(db, vaultId, username)
            if (thereWasVault) {
                await VaultModel.removeVaultSharing(db, vaultId, username)
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