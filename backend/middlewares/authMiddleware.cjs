const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    let token;
    if (authHeader) {
        token = authHeader.split(' ')[1]
    }
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.', code: 'ACCESS_DENIED' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userData = payload.userData;
        next()
    } catch (error) {
        res.status(403).json({ message: 'Token inválido ou expirado.', code: 'ACCESS_DENIED' })
    }
}

module.exports = authenticateToken