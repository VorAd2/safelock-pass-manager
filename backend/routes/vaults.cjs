const express = require('express');
const router = express.Router();
const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');

module.exports = (db) => {
    router.get('/', (req, res) => {
        res.json({ message: 'Get na API de Vault!' });
    });

    router.get('/:username', async (req, res) => {
        const { username } = req.params;
        try {
            const vaultsArray = await VaultModel.getVaultsByUser(username, db);
            if (vaultsArray.length === 0) {
                return res.status(404).json({ message: 'Nenhum vault encontrado para este usuário.' });
            }
            res.status(200).json(vaultsArray);
        } catch (err) {
            console.error('Erro ao buscar vaults:', err.message);
            res.status(500).json({ message: 'Erro ao buscar vaults.' });
        }
    });

    router.get('/:username/:vaultTitle', async (req, res) => {
        const { username, vaultTitle } = req.params;
    })

    router.post('/', async (req, res) => {
        const {originUser, title, pin, desc} = req.body
        console.log(`pin: ${pin}`)
        console.log(`desc: ${desc}`)
        try {
            const newVaultData = await VaultModel.insertVault({originUser, title, pin, desc}, db)
            const vaultId = newVaultData.insertedId
            const vault = newVaultData.vault
            await UserModel.addVault(originUser, vaultId, db)
            console.log('POST de Vault finalizado sem err')
            res.status(201).json({ message: 'Vault criado com sucesso', vault: vault });
        } catch (err) {
            res.status(500).json({message: err.message});
            console.log('Erro inesperado no POST de Vault: ' + err.message)
        }
    })

    return router
}