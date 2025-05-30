const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../models/User.cjs');

module.exports = (db) => {
  router.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de signup!' });
  });

  router.post('/', async (req, res) => {
    const {username, email, password} = req.body;
    try {
      const existsUser = await UserModel.existsUser(username, email, db)
      if (existsUser) {
        res.status(409).json({error: 'Nome ou Email já está em uso'});
        return;
      };
      await UserModel.insertUser({username, email, password}, db);
      res.send({username, email, password});
      console.log('Inserção de usuário autorizada');
    } catch (err) {
      res.status(500).json({message: err.message});
      console.log('Erro inesperado na inserção de usuário')
    }
  });

  return router;
}


