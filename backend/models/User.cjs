const bcrypt = require('bcryptjs');

class UserModel {
    async existsUser(username, email, db) {
        const user = await db.collection('users').findOne({$or: [{username}, {email}] })
        return user !== null
    }

    async insertUser(userData, db) {
        const {username, email, password} = userData
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = {
            username,
            email,
            password: hashedPassword,
            role: 'standard',
            createdAt: new Date(), 
        };
        await db.collection('users').insertOne(user)
    }

    async getUserByEmail(email, db) {
        const user = await db.collection('users').findOne({email: email})
        return user;
    }

    async matchPassword(user, potentialPass, db) {
        return (await bcrypt.compare(potentialPass, user.password))
    }

    async addVault(username, vaultId, db) {
        await db.collection('users').updateOne(
            {username: username},
            {$addToSet: {allVaults: vaultId} }
        )
    }

    async vaultFavoritism(toFavorite, vaultId, username, db) {
        const filter = {username: username}
        const update = toFavorite
            ? {$addToSet: {favoriteVaults: vaultId}}
            : {$pull: {favoriteVaults: vaultId}}
        await db.collection('users').updateOne(filter, update)
    }
}

module.exports = new UserModel();