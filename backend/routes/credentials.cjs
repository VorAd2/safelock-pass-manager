const express = require('express');
const router = express.Router();
const VaultModel = require('../models/Vault.cjs');
const UserModel = require('../models/User.cjs');
const CredentialModel = require('../models/Credential.cjs'); 

module.exports = (db) => {
    router.get('/', (req, res) => {
        res.json({ message: 'Get na API de Credentials!' });
    });

    router.post('/', async (req, res) => {
        const { vaultId, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks } = req.body;
        try {
            const credentialResult = await CredentialModel.insertCredential(
                db, 
                { vaultId, credentialTitle, credentialOwner, credentialEmail, 
                    credentialUsername, credentialPassword, credentialLinks}
            );
            const vaultResult = await VaultModel.addCredential(credentialResult.newCredential)
            res.status(201).json(credentialResult.newCredential)
        } catch (err) {
            console.error('Erro ao inserir credencial:', err.message);
            return res.status(500).json({ message: 'Erro ao inserir credencial.' });
        }
        
        
    })


    return router;
}