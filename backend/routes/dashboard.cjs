const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware.cjs');

const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');


module.exports = (db) => {
    router.get('/:username', authenticateToken, async (req, res) => {
        const { username } = req.params;
        if (req.userData.username !== username) {
            console.log('Backend - Nomes diferentes! Acesso NEGADO (403).');
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.' });
        }
        let vaultsArray = [];
        try {
            vaultsArray = await VaultModel.getVaultsByUser(username, db);
        } catch (err) {
            console.error('Erro ao buscar vaults:', err.message);
            return res.status(500).json({ message: 'Erro ao buscar vaults.' });
        }
        const isVaultsEmpty = vaultsArray.length === 0
        if (isVaultsEmpty) {
            return res.status(404).json({ message: 'Nenhum vault encontrado para este usuário.' });
        }
        res.status(200).json(vaultsArray);
    })

    return router
}