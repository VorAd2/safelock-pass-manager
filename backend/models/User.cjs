const bcrypt = require('bcryptjs');

class UserModel {
    async existsUser(name, email, db) {
        const existsUser = await db.collection('users').findOne({$or: [{name}, {email}] })
        return existsUser
    }

    async insertUser(userData, db) {
        const {name, email, password} = userData
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(), 
        };
        await db.collection('users').insertOne(user)
    }

    async findUser(email, db) {
        const user = await db.collection('users').findOne({email: email})
        return user;
    }
}

module.exports = new UserModel();