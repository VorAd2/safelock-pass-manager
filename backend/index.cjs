const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URI,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
  }
});
const authenticateToken = require('./middlewares/authMiddleware.cjs');

app.use(cors({
  origin: process.env.FRONT_URI,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());


const connectedUsers = new Map();
io.on('connection', (socket) => {
  console.log('Novo socket conectado');

  socket.on('register', (username) => {
    connectedUsers.set(username, socket);
    console.log(`Usuário ${username} registrado no socket.`);
  });

  socket.on('disconnect', () => {
    for (const [username, userSocket] of connectedUsers.entries()) {
      if (userSocket === socket) {
        connectedUsers.delete(username);
        console.log(`Usuário ${username} desconectado do socket.`);
        break;
      }
    }
  });
});

const port = process.env.PORT;
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const homeRouter = require('./routes/home.cjs');
let db;


const { GoogleGenAI } = require('@google/genai')
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY })


module.exports = { io, connectedUsers };
(async () => {
  try {
    await client.connect();
    console.log('MongoDB conectado');
    db = client.db('safelock-pass-manager');
    const signinRouter = require('./routes/signin.cjs')(db);
    const signupRouter = require('./routes/signup.cjs')(db);
    const dashboardRouter = require('./routes/dashboard.cjs')(db);
    const vaultsRouter = require('./routes/vaults.cjs')(db);
    const credentialsRouter = require('./routes/credentials.cjs')(db);
    const genUsernameRouter = require('./routes/generateUsername.cjs')(gemini);
    app.use('/signin', signinRouter);
    app.use('/signup', signupRouter);
    app.use('/dashboard', authenticateToken, dashboardRouter);
    app.use('/dashboard/vaults', authenticateToken, vaultsRouter);
    app.use('/dashboard/vaults/credentials', authenticateToken, credentialsRouter);
    app.use('/dashboard/generator/username', authenticateToken, genUsernameRouter);
    app.use('/', homeRouter);
    app.get('/', (req, res) => res.send('API funcionando!'));
    server.listen(port, () => console.log('Servidor na porta ' + port));
  } catch (err) {
    console.log('Erro ao conectar ao MongoDB ou iniciar servidor:\n', err);
    process.exit(1);
  }
})();




