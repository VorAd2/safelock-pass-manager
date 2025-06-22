const bcrypt = require('bcryptjs');

class VaultModel {
    async insertVault(data, db) {
        const {originUser, title, pin, desc} = data
        let hashedPin = null
        if (pin != null) {
            const salt = await bcrypt.genSalt(10)
            hashedPin = await bcrypt.hash(pin, salt)
        }
        const vault  = {
            originUser,
            sharedUsers: null,
            title,
            pin: hashedPin,
            desc,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const result = await db.collection('user_vaults').insertOne(vault)
        return result.insertedId
    }
}

module.exports = new VaultModel()