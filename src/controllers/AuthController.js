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

        if(user.length == 0){
            return res.status(400).send({error: 'User not found'});
        }

        const compare_password = await bcrypt.compare(password, user[0].password);

        if(!compare_password){
            return res.status(400).send({error: 'Invalid password'})
        }
        
        return res.send({
            user_data: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email
            }, 
            token: generateToken({id: user[0].email})
        });
    }
}