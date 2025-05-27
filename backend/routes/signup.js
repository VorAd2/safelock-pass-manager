const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de signup!' });
});

router.post('/', async (req, res) => {
  const {name, email, password} = req.body;

  try {
    const newUser = new User({name, email, password});
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!'});
  } catch (err) {
    if (err.code == 11000) {
      const duplicatedField = Object.keys(err.keyPattern)[0];
      res.status(400).json({ error: `Já existe um usuário com este ${duplicatedField}.` });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;