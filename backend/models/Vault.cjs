const { ObjectId } = require('mongodb');

class VaultModel {

    async insertVault(data, db) {
        const {ownerUser, title, pin, desc} = data
        const vault  = {
            ownerUser,
            sharedUsers: [],
            title,
            pin,
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

    async updateTitle(db, vaultId, newTitle) {
        const filter = {_id: new ObjectId(String(vaultId))}
        const update = {$set: {title: newTitle}}
        await db.collection('user_vaults').updateOne(filter, update)
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

    async removeCredential(db, vaultId, credential) {
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

    async removeVaultSharing(db, vaultId, recipientUsername) {
        const filter = {_id: new ObjectId(String(vaultId))}
        const update = {
            $pull: {
                sharedUsers: recipientUsername,
                credentials: {credentialOwner: recipientUsername},
                favoritedBy: recipientUsername
            }
        }
        const result = await db.collection('user_vaults').updateOne(filter, update)
        return result.modifiedCount > 0;
    }

}

module.exports = new VaultModel()