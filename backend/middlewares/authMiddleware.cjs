const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = (req, res) => {
    const authHeader = req.headers['authorization']
    let token;
    if (authHeader) {
        token = authHeader.split(' ')[1]
    }
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user;
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' })
    }
}

module.exports = authenticateToken