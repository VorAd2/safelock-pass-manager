const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API da home!' });
});

module.exports = router;