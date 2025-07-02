const bcrypt = require('bcryptjs');

class VaultModel {
    async insertVault(data, db) {
        const {originUser, title, pin, desc} = data
        let hashedPin = null
        if (pin != '') {
            const salt = await bcrypt.genSalt(10)
            hashedPin = await bcrypt.hash(pin, salt)
        }
        const vault  = {
            originUser,
            sharedUsers: null,
            title,
            pin: hashedPin,
            desc,
            credentials: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const result = await db.collection('user_vaults').insertOne(vault)
        const newVault = await db.collection('user_vaults').findOne({_id: result.insertedId})
        return {'vaultId': result.insertedId, 'vault': newVault}
    }

    async getVaultsByUser(username, db) {
        const vaultsArray = await db.collection('user_vaults').find({originUser: username}).toArray()
        return vaultsArray
    }

    async addCredential(vaultId, credential, db) {
        const result = await db.collection('user_vaults').updateOne(
            {_id: vaultId},
            {$push: {credentials: credential}}
        )
        return result
    }

}

module.exports = new VaultModel()