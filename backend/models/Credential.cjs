class CredentialModel {
    async insertCredential(db, data) {
        //Verificar existencia do vault
        const { vaultId, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks } = data;
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
        return { 'credentialId': result.insertedId, 'newCredential': newCredential };
    }

    async deleteAllCredentials(db, vaultId) {
        const filter = {vaultId: vaultId}
        await db.collection('credentials').deleteMany(filter)
    }

}

module.exports = new CredentialModel()