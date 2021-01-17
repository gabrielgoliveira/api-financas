const connection = require('../database/connection');

module.exports = {
    async create (req, res){
        const data = req.body;
        connection.insert(data).into('users')
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            return res.send(err);
        });

    }
}
    
