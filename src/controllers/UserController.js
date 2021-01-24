const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

module.exports = {
    async create (req, res){
        const user = req.body;
        const hash = await bcrypt.hash(user.password, 10);
        
        user.password = hash;

        connection.insert(user).into('users')
        .then(data => {
            if(data.rowCount){
                return res.send({
                    id: user.id,
                    email: user.email,
                    token : 'Bearer ' + generateToken({id: user.email})
                });
            } else {
                return res.send({
                    'error' : 'nenhum dado foi gravado'
                })
            }
        })
        .catch(err => {
            return res.send(err);
        });

    }
}
    
