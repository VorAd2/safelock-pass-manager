class CredentialModel {
    async insertCredential(db, data) {
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
}

module.exports = new CredentialModel()