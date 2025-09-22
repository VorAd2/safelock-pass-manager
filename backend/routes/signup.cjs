const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const router = express.Router();

const UserModel = require('../models/User.cjs');
const { default: errorCodes } = require('../errorCodes');
dotenv.config({ path: '../.env' });


module.exports = (db) => {
  router.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de signup!' });
  });

  router.post('/', async (req, res) => {
    const {username, email, password} = req.body;
    try {
      const existingUser = await UserModel.existsUser(username, email, db)
      if (existingUser) {
        if (existingUser.username === username) {
          res.status(409).json({message: 'Username already in use', code: errorCodes.INVALID_AUTH, source: 'username'});
        } else {
          res.status(409).json({message: 'Email already in use', code: errorCodes.INVALID_AUTH, source: 'email'});
        }
        return;
      };
      await UserModel.insertUser({username, email, password}, db);

      const payload = {
        userData: {
          username: username,
        }
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {'expiresIn': '1h'},
        (err, token) => {
            if (err) throw err;
            res.json({token: token})
        }
      )
    } catch (err) {
      res.status(500).json({message: err.message});
      console.log('Erro inesperado na inserção de usuário')
    }
  });

  return router;
}


