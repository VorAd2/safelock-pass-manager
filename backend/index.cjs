const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const { MongoClient } = require('mongodb')
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT;

const client = new MongoClient(process.env.MONGO_URI);
(async () => {
    try {
    await client.connect();
    console.log('MongoDB conectado');
    const db = client.db('safelock-pass-manager');

    const homeRouter = require('./routes/home.cjs');
    const signinRouter = require('./routes/signin.cjs')(db);
    const signupRouter = require('./routes/signup.cjs')(db);
    //const myvaultsRouter = require('./routes/myvaults.cjs');

    app.use('/', homeRouter);
    app.use('/signin', signinRouter);
    app.use('/signup', signupRouter);
    //app.use('/myvaults/:name', myvaultsRouter);

    app.get('/', (req, res) => res.send('API funcionando!'));
    app.listen(port, () => console.log('Servidor na porta ' + port));
} catch (err) {
    console.log('Erro')
}
})();


