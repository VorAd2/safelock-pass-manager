// index.cjs
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
    console.log(`[DEBUG_GLOBAL] Requisição Recebida: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    next(); // CHAME next() para passar a requisição para o próximo middleware/rota
});

app.use(express.json()); 
dotenv.config();
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
        const myvaultsRouter = require('./routes/myvaults.cjs');
        
        app.use('/signin', signinRouter);
        app.use('/signup', signupRouter);
        app.use('/myvaults', myvaultsRouter);
        app.use('/', homeRouter);

        
        app.get('/', (req, res) => res.send('API funcionando!'));
        app.listen(port, () => console.log('Servidor na porta ' + port));
    } catch (err) {
        console.log('Erro ao conectar ao MongoDB ou iniciar servidor:\n', err);
        process.exit(1); // Sai do processo se houver um erro crítico
    }
})();

// Se você tiver rotas que NÃO dependem do DB, pode defini-las aqui FORA do async block.
// Ex: app.get('/health', (req, res) => res.status(200).send('OK'));


