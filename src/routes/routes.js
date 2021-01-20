const express = require('express');

/*Controllers */

const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const spendController = require('../controllers/SpendController');

const authMiddleware = require('../middleware/auth');

const routers = express.Router();

routers.get('/', (req, res) => {
    return(res.send('Hello Friend !!'));
});

//routes authenticate
routers.post('/authenticate', authController.authenticate);

//routes users
routers.post('/user', userController.create);

//routes spend
routers.get('/spend',authMiddleware, spendController.create)

module.exports = routers;