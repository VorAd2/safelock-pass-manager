const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const port = process.env.PORT;
const homeRouter = require('./routes/home');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
app.use('/', homeRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB conectado')
        await User.init();
        console.log('Índices do User garantidos');
        app.listen(port, () => console.log('Servidor na porta ' + port));
    })
    .catch(err => console.log('Erro ao conectar MongoDB: ' + err));


app.get('/', (req, res) => res.send('API funcionando!'));