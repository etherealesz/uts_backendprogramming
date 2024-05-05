const jwt = require('jsonwebtoken');
const config = require('../core/config');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token tidak tersedia' });
    }


    if (!token.toLowerCase().startsWith('jwt')) {
        return res.status(401).json({ message: 'token must start with jwt' });
    }

    const tokenWithoutPrefix = token.slice(4);

    jwt.verify(tokenWithoutPrefix, config.secret.jwt, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid' });
        }
        req.userId = decoded.userId;
        next();
    });
}



module.exports = {
    verifyToken
};

