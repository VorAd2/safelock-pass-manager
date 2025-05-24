const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const homeRouter = require('./routes/home');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
app.use('/', homeRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);



app.get('/', (req, res) => res.send('API funcionando!'));
app.listen(3001, () => console.log('Servidor na porta 3001'));
