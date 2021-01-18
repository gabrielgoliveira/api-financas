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
    async authenticate(req, res){
        const {email, password} = req.body;

        const user = await connection.select('*').from('users').where('email', email);

        const saida = await bcrypt.compare(password, user[0].password);

        //Invalid Password
        if(!saida){
            return res.status(400).send({error: 'Invalid password'});
        }


        res.send({
            user: user[0], 
            token: generateToken({id: user[0].email})
        });
    }
}