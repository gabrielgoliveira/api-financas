const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next)=> {
    const authHeader = req.headers.authorization;

    jwt.verify(authHeader, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({err: 'Invalid Token'});
        req.userId = decoded.id;
        return next();
    });
}