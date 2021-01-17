const express = require('express');
const userController = require('./controllers/UserController');

const routers = express.Router();

routers.get('/', (req, res) => {
    return(res.send('Hello Friend !!'));
});


//routes users
routers.post('/user', userController.create);

module.exports = routers;