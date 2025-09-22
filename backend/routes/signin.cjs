const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const router = express.Router();

const UserModel = require('../models/User.cjs');
const { default: errorCodes } = require('../errorCodes');
dotenv.config({ path: '../.env' });;


module.exports = (db) => {
  router.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de signin!' })
  })

  router.post('/', async (req, res) => {
    const {email, password} = req.body
    try {
      const user = await UserModel.getUserByEmail(email, db)
      if (user) {
        const isMatch = await UserModel.matchPassword(user, password, db)
        if (isMatch) {
          const payload = {
            userData: {
              id: user._id,
              username: user.username,
              role: user.role,
            }
          }
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {'expiresIn': '1h'},
            (err, token) => {
                if (err) throw err;
                res.json({token: token}) // Envia o token de volta ao cliente
            }
          )
        } else {
          res.status(401).json({message: 'Invalid email or password', code: errorCodes.INVALID_AUTH})
        }
      } else {
        res.status(401).json({message: 'Invalid email or password', code: errorCodes.INVALID_AUTH})
      }
    } catch (err) {
      res.status(500).json({message: err.message})
      console.log('Erro inesperado no login')
    }
  })

  return router
}