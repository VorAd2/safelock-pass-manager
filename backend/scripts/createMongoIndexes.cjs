const { MongoClient } = require('mongodb')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) 
const uri = process.env.MONGO_URI
const dbName = 'safelock-pass-manager'
const collectionName = 'users'

async function createUniqueIndexes() {
    const client = new MongoClient(uri)
    try {
        await client.connect();
        console.log("Conectado ao MongoDB Atlas.");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result1 = await collection.createIndex(
            {username: 1},
            {unique: true}
        )
        console.log(`Índice criado com sucesso: ${result1}`);
        const result2 = await collection.createIndex(
            {email: 1},
            {unique: true}
        )
        console.log(`Índice criado com sucesso: ${result2}`);
    } catch (error) {
        console.error("Erro ao criar o índice:", error);
        if (error.code === 11000) {
            console.error("ERRO: Existe um valor duplicado no campo 'username'.");
            console.error("Por favor, remova os documentos duplicados antes de tentar criar o índice único.");
        }
    } finally {
        await client.close();
        console.log("Conexão com o MongoDB Atlas encerrada.");
    }
}

createUniqueIndexes()