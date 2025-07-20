const express = require('express');
const router = express.Router();
const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');
const authenticateToken = require('../middlewares/authMiddleware.cjs');

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
        if (req.userData.username !== ownerUser) {
            console.log('Backend - Nomes diferentes! Acesso NEGADO (403).');
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.' });
        }
        try {
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
        console.log(`toFavorite: ${toFavorite}, vaultId: ${vaultId}, username: ${username}`)
        try {
            await VaultModel.favoritism(toFavorite, vaultId, username, db)
            //await UserModel.vaultFavoritism(toFavorite, vaultId, username, db)
            console.log(`PATCH favoritismo finalizado sem err`)
            return res.status(200).json({message: 'Favoritismo de vault atualizado'})
        } catch (err) {
            console.log(`Erro inesperado no PATCH favoritism: ${JSON.stringify(err)}`)
            return res.status(500).json({message: err.message})
        }
    })

    router.patch('/sharing', authenticateToken, async (req, res) => {
        const {ownerUsername, senderUsername, vaultId, recipientUsername} = req.body
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
            const recipientExists = await UserModel.existsUser(recipientUsername, null, db)
            console.log(`recipientExists: ${recipientExists}`)
            if (recipientExists) {
                await VaultModel.sharing(db, vaultId, recipientUsername)
                await UserModel.addVault(recipientUsername, vaultId, db)
                //disparar notificação no recipientUser para que ele refresh o panel de vaults
                return res.status(200).json(
                    {message: `Vault compartilhado com sucesso entre ${ownerUsername} e ${recipientUsername}`}
                )
            } else {
                return res.status(404).json({message: "Recipient user doesn't exist"})
            }
            
        } catch (err) {
            console.log(`Erro no compartilhamento de vault: ${err}`)
            return res.status(500).json({ message: 'Erro interno ao compartilhar vault' })
        }
         
    })

    return router
}