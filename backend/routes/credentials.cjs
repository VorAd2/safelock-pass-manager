const express = require('express');
const router = express.Router();
const { connectedUsers } = require('../index.cjs');

const VaultModel = require('../models/Vault.cjs');
const CredentialModel = require('../models/Credential.cjs'); 
const { default: errorCodes } = require('../errorCodes');

function emitSocketEvent(data) {
    const {credential, vaultId, vaultTitle, sharedUsers, vaultOwner, event} = data;
    let recipientSocket;
        for (us of sharedUsers) {
            recipientSocket = connectedUsers.get(us === credential.credentialOwner ? vaultOwner : us)
            if (recipientSocket && event === 'credentialAdded') {
                recipientSocket.emit(event, {
                    vaultId,
                    newCredential: credential,
                    emitter: credential.credentialOwner,
                    message: `A new credential has been added by ${credential.credentialOwner} to the vault ${vaultTitle} (${vaultOwner})`
                })
            } else if (recipientSocket && event === 'credentialDeleted') {
                recipientSocket.emit(event, {
                    vaultId,
                    emitter: credential.credentialOwner,
                    message: `The credential ${credential.credentialTitle} (${credential.credentialOwner}) has been deleted from the vault ${vaultTitle} (${vaultOwner}).`
                })
            }
        }
}

module.exports = (db) => {
    router.get('/', (req, res) => {
        res.json({ message: 'Get na API de Credentials!' });
    });

    router.post('/', async (req, res) => {
        const { vaultId, vaultTitle, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks } = req.body;
        if (req.userData.username !== credentialOwner) {
            return res.status(403).json({ message: errorFeedbacks.ACCESS_DENIED, code: errorCodes.ACCESS_DENIED });
        }
        try {
            const credentialExists = await CredentialModel.credentialExists(db, {vaultId, credentialTitle})
            if (credentialExists) {
                return res.status(409).json({message: errorFeedbacks.DUPLICATE_CREDENTIAL, code: errorCodes.DUPLICATE_CREDENTIAL})
            }
            const credentialResult = await CredentialModel.insertCredential(
                db, 
                { vaultId, credentialTitle, credentialOwner, credentialEmail, 
                    credentialUsername, credentialPassword, credentialLinks}
            );
            if (!credentialResult.vaultExists) return res.status(404).json({message: errorFeedbacks.VAULT_NOT_FOUND, code: errorCodes.VAULT_NOT_FOUND})
            await VaultModel.addCredential(vaultId, credentialResult.newCredential, db)
            const {sharedUsers, vaultOwner} = await VaultModel.getSharedUsersAndOwner(db, vaultId)
            emitSocketEvent({credential: credentialResult.newCredential, vaultId, vaultTitle, sharedUsers, vaultOwner, event: 'credentialAdded'})
            return res.status(201).json(credentialResult.newCredential)
        } catch (err) {
            console.log('Erro ao inserir credencial:', err.message);
            return res.status(500).json({ message: 'Erro ao inserir credencial.' });
        }
    })

    router.delete('/', async (req, res) => {
        const {username} = req.body
        if (req.userData.username !== username) {
            return res.status(403).json({ message: errorFeedbacks.ACCESS_DENIED, code: errorCodes.ACCESS_DENIED });
        }
        const {vaultId, vaultTitle, credential} = req.body
        if (credential.credentialOwner !== username) {
            return res.status(403).json({message: errorFeedbacks.CREDENTIAL_ACCESS_DENIED, code: errorCodes.CREDENTIAL_ACCESS_DENIED})
        }
        try {
            await VaultModel.removeCredential(db, vaultId, credential)
            await CredentialModel.deleteCredential(db, credential)
            const {sharedUsers, vaultOwner} = await VaultModel.getSharedUsersAndOwner(db, vaultId)
            emitSocketEvent({sharedUsers, vaultId, vaultTitle, vaultOwner, credential, event: 'credentialDeleted'})
            return res.status(200).json({message: 'Credential deleted successfully'})
        } catch (err) {
            console.warn(`Erro inesperado na deleção de credencial: ${err}`)
            return res.status(500).json({message: 'Unknown error'})
        }
    })

    return router;
}