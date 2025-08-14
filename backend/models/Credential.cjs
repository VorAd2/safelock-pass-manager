const VaultModel = require('../models/Vault.cjs')
const { ObjectId } = require('mongodb');

class CredentialModel {
    async credentialExists(db, data) {
        const { vaultId, credentialTitle} = data
        const filter = {$and: [{vaultId},{credentialTitle}]}
        const result = await db.collection('credentials').findOne(filter);
        return result !== null;
    }

    async insertCredential(db, data) {
        const { vaultId, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks } = data;
        const vaultExists = await VaultModel.getVaultById(db, vaultId)
        if (!vaultExists) return {'vaultExists': false}
        const credential = {
            vaultId,
            credentialTitle,
            credentialOwner,
            credentialEmail,
            credentialUsername,
            credentialPassword,
            credentialLinks,
            createdAt: new Date(),
        }
        const result = await db.collection('credentials').insertOne(credential);
        const newCredential = await db.collection('credentials').findOne({ _id: result.insertedId });
        return { 'credentialId': result.insertedId, 'newCredential': newCredential, 'vaultExists': true };
    }

    async deleteAllVaultCredentials(db, vaultId) {
        const filter = {vaultId: vaultId}
        await db.collection('credentials').deleteMany(filter)
    }

    async deleteCredential(db, credential) {
        const filter = {_id: new ObjectId(String(credential._id))}
        await db.collection('credentials').deleteOne(filter)
    }

    async deleteUnsharedCredentials(db, vaultId, username) {
        const filter = { $and: [{vaultId: vaultId}, {credentialOwner: username}] }
        await db.collection('credentials').deleteMany(filter)
    }

}

module.exports = new CredentialModel()