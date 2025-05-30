const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware.cjs');

router.get('/', authenticateToken, (req, res) => {
    console.log('Nome do usuário autenticado (do token):', req.user.name);
    console.log('Nome da URL (req.params.name):', req.params.name);
    if (req.user.username !== req.params.username) {
        // O usuário autenticado (do token) não corresponde ao nome de usuário na URL
        return res.status(403).json({ message: 'Acesso negado para o perfil solicitado.' });
    }

    res.json({
        message: `Bem-vindo ao cofre de ${req.user.name}!`,
        // Aqui você buscará os dados reais do cofre para req.user.id
        data: {
            item1: 'Conteúdo Secreto 1',
            item2: 'Conteúdo Secreto 2'
        }
    });
})

module.exports = router