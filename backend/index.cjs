const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(cors({
  origin: process.env.FRONT_URI,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json()); 

const port = process.env.PORT;
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);

const homeRouter = require('./routes/home.cjs');
let db; 

(async () => {
    try {
        await client.connect();
        console.log('MongoDB conectado');
        db = client.db('safelock-pass-manager'); 

        const signinRouter = require('./routes/signin.cjs')(db);
        const signupRouter = require('./routes/signup.cjs')(db);
        const dashboardRouter = require('./routes/dashboard.cjs');
        const vaultsRouter = require('./routes/vaults.cjs')(db);
        const credentialsRouter = require('./routes/credentials.cjs')(db);
        
        app.use('/signin', signinRouter);
        app.use('/signup', signupRouter);
        app.use('/dashboard', dashboardRouter);
        app.use('/dashboard/vaults', vaultsRouter);
        app.use('/dashboard/vaults/credentials', credentialsRouter);
        app.use('/', homeRouter);

        
        app.get('/', (req, res) => res.send('API funcionando!'));
        app.listen(port, () => console.log('Servidor na porta ' + port));
    } catch (err) {
        console.log('Erro ao conectar ao MongoDB ou iniciar servidor:\n', err);
        process.exit(1); 
    }
})();




