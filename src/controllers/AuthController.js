const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mailer = require('../config/mailer');


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
            token: 'Bearer ' + generateToken({id: user[0].email})
        });
    },

    async forgot_password(req, res){

        const {email} = req.body;

        try {

            const user = await connection.select('*').from('users').where('email', email);
            
            if(user.length == 0){
                return res.status(400).send({error: 'User not found'});
            }

            //token para redefinir a senha
            const token = crypto.randomBytes(20).toString('hex');

            //validade do token
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 5);

            await connection.where({email}).update({
                passwordresettoken : token,
                passwordresetexpires: expires
            }).table('users');
            
            mailer.sendMail({
                to: email,
                from: 'gabriel.golvs@gmail.com',
                template: 'forgot',
                context : {
                    token
                }
            }, 
            (err) => {
                if(err) {
                    console.log(err)
                    return res.status(400).send({err: 'Cannot send forgot password email'});
                    
                }

                return res.send('ok')
            });


        } catch(err){
            console.log(err)
            res.status(400).send({
                error: 'Error on forgot password, try again',
                msg: err
            });
        }

    },

    async reset_password(req, res) {
        const {email, token, password} = req.body;
        try {

            var user = await connection.select('*').from('users').where('email', email);

            user = user[0];

            const hash = await bcrypt.hash(password, 10);

            if(!(user.passwordresettoken === token)){
                return res.status(401).send({err: 'Invalid Token'})
            }

            //console.log(Date.now(), ' e ', user.passwordresetexpires);

            if(Date.now() > user.passwordresetexpires) {
                return res.status(401).send({err: 'Expired Token'});
            }


            const insercao = await connection.where({email})
            .update({
                password: hash
            })
            .table('users');

            console.log(insercao);

            return res.status(200).send({out: 'modify password'});
            
        } catch(err){
            console.log(err)
            return res.send({err: err})
        }
    }
}
