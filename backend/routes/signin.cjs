const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.cjs');

// Como encontrar um usuario com base no email e senha
module.exports = (db) => {

  router.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de signin!' })
  })

  router.post('/', async (req, res) => {
    const {email, password} = req.body
    try {
      const user = UserModel.findUser(email, db)
      if (user) {
        res.send({name: user.name})
      } else {
        res.status(404).json({error: 'Usuário não encontrado'})
      }
    } catch (err) {
      res.status(500).json({error: err.message})
      console.log('Erro inesperado no login')
    }
  })

  return router
}