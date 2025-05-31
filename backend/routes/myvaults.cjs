const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware.cjs');

router.get('/:username', authenticateToken, (req, res) => {
    console.log('Nome do usuário autenticado (do token):', req.userData.username);
    console.log('Nome da URL (req.params.username):', req.params.username);
    if (req.userData.username !== req.params.username) {
        console.log('Backend - Nomes diferentes! Acesso NEGADO (403).');
        return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.' });
    }

    res.json({
        message: `Bem-vindo ao cofre de ${req.userData.username}!`,
        data: {
            item1: 'Conteúdo Secreto 1',
            item2: 'Conteúdo Secreto 2'
        }
    });
})

module.exports = router