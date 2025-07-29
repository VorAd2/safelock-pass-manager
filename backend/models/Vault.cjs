const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class VaultModel {

    async insertVault(data, db) {
        const {ownerUser, title, pin, desc} = data
        let hashedPin = null
        if (pin != '') {
            const salt = await bcrypt.genSalt(10)
            hashedPin = await bcrypt.hash(pin, salt)
        }
        const vault  = {
            ownerUser,
            sharedUsers: [],
            title,
            pin: hashedPin,
            desc,
            credentials: [],
            favoritedBy: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const result = await db.collection('user_vaults').insertOne(vault)
        const newVault = await db.collection('user_vaults').findOne({_id: result.insertedId})
        return {'vaultId': result.insertedId, 'vault': newVault}
    }

    async deleteVault(db, vaultId) {
        const filter = {_id: new ObjectId(String(vaultId))}
        await db.collection('user_vaults').deleteOne(filter)
    }

    async isDuplicateVault(db, vaultTitle, ownerUser) {
        const filter = {$and: [{title: vaultTitle}, {ownerUser: ownerUser}]}
        const result = await db.collection('user_vaults').findOne(filter)
        return result !== null
    }

    async addCredential(vaultId, credential, db) {
        const result = await db.collection('user_vaults').updateOne(
            {_id: new ObjectId(String(vaultId))},
            {$push: {credentials: credential}}
        )
        return result
    }

    async  removeCredential(db, vaultId, credential) {
        const filter = { _id: new ObjectId(String(vaultId)) };
        const update = {
            $pull: {
                credentials: { _id: new ObjectId(String(credential._id)) }
            }
        };
        await db.collection('user_vaults').updateOne(filter, update);
    }

    async getVaultsByUser(username, db) {
        const filter = {$or: [{ownerUser: username}, {sharedUsers: username} ]}
        const vaultsArray = await db.collection('user_vaults').find(filter).toArray()
        return vaultsArray
    }

    async getVaultById(db, id) {
        const filter = {_id: new ObjectId(String(id))}
        const vault = await db.collection('user_vaults').findOne(filter)
        return vault
    }

    async getSharedUsersAndOwner(db, vaultId) {
        const filter = {_id: new ObjectId(String(vaultId))}
        const vault = await db.collection('user_vaults').findOne(filter)
        return {sharedUsers: vault.sharedUsers, vaultOwner: vault.ownerUser}
    }    

    async favoritism(toFavorite, vaultId, username, db) {
        const filter = {_id: new ObjectId(String(vaultId))}
        const update = toFavorite
            ? {$addToSet: {favoritedBy: username} }
            : {$pull: {favoritedBy: username} }
        await db.collection('user_vaults').updateOne(filter, update)
    }

    async sharing(db, vaultId, recipientUsername) {
        const filter = {_id: new ObjectId(String(vaultId))}
        const update = {$addToSet: {sharedUsers: recipientUsername}}
        await db.collection('user_vaults').updateOne(filter, update)
    }
}

module.exports = new VaultModel()