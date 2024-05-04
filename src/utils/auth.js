const jwt = require('jsonwebtoken');
const config = require('../core/config');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token tidak tersedia' });
    }
    jwt.verify(token, config.secret.jwt, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid' });
        }
        req.userId = decoded.userId;
        next();
    });
}

function decodeToken(token) {
    try {
        const decodedToken = jwt.verify(token, config.secret.jwt);
        const userId = decodedToken.userId;
        return userId;
    } catch (error) {
        return null; // Token tidak valid atau tidak bisa dideskripsikan
    }
}


module.exports = { 
verifyToken, 
decodeToken 
};
