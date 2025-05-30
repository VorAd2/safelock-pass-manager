const bcrypt = require('bcryptjs');

class UserModel {
    async existsUser(name, email, db) {
        const existsUser = await db.collection('users').findOne({$or: [{name}, {email}] })
        return existsUser
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

    async findUserByEmail(email, db) {
        const user = await db.collection('users').findOne({email: email})
        return user;
    }

    async matchPassword(user, potentialPass, db) {
        return (await bcrypt.compare(potentialPass, user.password))
    }
}

module.exports = new UserModel();