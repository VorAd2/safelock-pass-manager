const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.cjs');


module.exports = (db) => {
  router.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de signin!' })
  })

  router.post('/', async (req, res) => {
    const {email, password} = req.body
    try {
      const user = await UserModel.findUserByEmail(email, db)
      if (user) {
        const isMatch = await UserModel.matchPassword(user, password, db)
        if (isMatch) {
          res.send({name: user.name})
          console.log('Login autorizado')
        } else {
          res.status(401).json({message: 'Email ou senha inválidos'})
        }
      } else {
        res.status(401).json({message: 'Email ou senha inválidos'})
      }
    } catch (err) {
      res.status(500).json({message: err.message})
      console.log('Erro inesperado no login')
    }
  })

  return router
}