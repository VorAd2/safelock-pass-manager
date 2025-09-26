const express = require('express');
const router = express.Router();
const VaultModel = require('../models/Vault.cjs');
const { default: errorCodes } = require('../errorCodes');
const { default: errorFeedbacks } = require('../errorFeedbacks');

module.exports = (db) => {
    router.get('/:username', async (req, res) => {
        const { username } = req.params
        if (req.userData.username !== username) {
            return res.status(403).json({ message: errorFeedbacks.ACCESS_DENIED, code: errorCodes.ACCESS_DENIED})
        }
        let vaultsArray = []
        try {
            vaultsArray = await VaultModel.getVaultsByUser(username, db)
        } catch (err) {
            console.error('Erro ao buscar vaults:', err.message)
            return res.status(500).json({ message: 'Erro ao buscar vaults.' })
        }
        const isVaultsEmpty = vaultsArray.length === 0
        if (isVaultsEmpty) {
            return res.status(204).json({ message: 'Nenhum vault encontrado para este usuário.' })
        }
        res.status(200).json(vaultsArray)
    })

    return router
}