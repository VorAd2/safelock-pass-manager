const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware.cjs');
const { io, connectedUsers } = require('../index.cjs');

const VaultModel = require('../models/Vault.cjs');
const CredentialModel = require('../models/Credential.cjs'); 

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
            const credentialExists = await CredentialModel.credentialExists(db, {vaultId, credentialTitle})
            if (credentialExists) {
                return res.status(409).json({message: 'Credential title already in use'})
            }
            const credentialResult = await CredentialModel.insertCredential(
                db, 
                { vaultId, credentialTitle, credentialOwner, credentialEmail, 
                    credentialUsername, credentialPassword, credentialLinks}
            );
            if (!credentialResult.vaultExists) return res.status(404).json({message: 'The vault no longer exists'})
            const vaultResult = await VaultModel.addCredential(vaultId, credentialResult.newCredential, db)
            const sharedUsers = await VaultModel.getSharedUsers(db, vaultId)
            for (us of sharedUsers) {
                let recipientSocket = connectedUsers.get(us)
                if (recipientSocket) {
                    recipientSocket.emit('credentialAdded', {
                        vaultId,
                        newCredential: credentialResult.newCredential,
                        emitter: credentialOwner,
                        message: `Uma nova credencial foi adicionada por ${credentialOwner} a um dos vaults`
                    })
                }
            }
            console.log(`vaultResult: ${JSON.stringify(vaultResult, null, 2)}`);
            return res.status(201).json(credentialResult.newCredential)
        } catch (err) {
            console.log('Erro ao inserir credencial:', err.message);
            return res.status(500).json({ message: 'Erro ao inserir credencial.' });
        }
    })


    return router;
}