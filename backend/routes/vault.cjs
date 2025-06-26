const express = require('express');
const router = express.Router();
const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');

module.exports = (db) => {
    router.get('/', (req, res) => {
        res.json({ message: 'Get na API de Vault!' });
    });

    router.post('/', async (req, res) => {
        const {originUser, title, pin, desc} = req.body
        console.log(`pin: ${pin}`)
        console.log(`desc: ${desc}`)
        try {
            const vaultId = await VaultModel.insertVault({originUser, title, pin, desc}, db)
            await UserModel.addVault(originUser, vaultId, db)
            console.log('POST de Vault finalizado sem err')
            res.status(201).json({ message: 'Vault criado com sucesso' });
        } catch (err) {
            res.status(500).json({message: err.message});
            console.log('Erro inesperado no POST de Vault: ' + err.message)
        }
    })

    return router
}