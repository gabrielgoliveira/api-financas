const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next)=> {

    const authHeader = req.headers.authorization;

    const parts = authHeader.split(' ');
    const [scheme, token] = parts;
    
    if(parts.length != 2) return res.status(401).send({err: 'Token malformated'});

    if(!/^Bearer$/i.test(scheme)) return res.status(401).send({err: 'invalid token'});

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({err: 'Invalid Token'});
        req.userId = decoded.id;
        return next();
    });
}