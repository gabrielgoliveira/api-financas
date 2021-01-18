const connection = require('../database/connection');
const bcrypt = require('bcryptjs');

module.exports = {
    async create (req, res){
        const data = req.body;
        const hash = await bcrypt.hash(data.password, 10);
        
        console.log(hash);
        data.password = hash;

        connection.insert(data).into('users')
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            return res.send(err);
        });

    }
}
    
