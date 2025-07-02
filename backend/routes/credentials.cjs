const express = require('express');
const router = express.Router();
const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');
const CredentialModel = require('../models/Credential.cjs'); 
const authenticateToken = require('../middlewares/authMiddleware.cjs');

module.exports = (db) => {
    router.get('/', (req, res) => {
        res.json({ message: 'Get na API de Credentials!' });
    });

    router.post('/', authenticateToken, async (req, res) => {
        const { vaultId, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks } = req.body;
        if (req.userData.username !== credentialOwner) {
            console.log('Backend - Nomes diferentes! Acesso NEGADO (403).');
            return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.' });
        }
        try {
            const credentialResult = await CredentialModel.insertCredential(
                db, 
                { vaultId, credentialTitle, credentialOwner, credentialEmail, 
                    credentialUsername, credentialPassword, credentialLinks}
            );
            const vaultResult = await VaultModel.addCredential(
                vaultId, credentialResult.newCredential, db)
            console.warn(`vaultResult: ${JSON.stringify(vaultResult)}`);
            return res.status(201).json(credentialResult.newCredential)
        } catch (err) {
            console.warn('Erro ao inserir credencial:', err.message);
            return res.status(500).json({ message: 'Erro ao inserir credencial.' });
        }
    })


    return router;
}