const express = require('express');
const routers = require('./routes');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(express.json());
//app.use(authMiddleware);
app.use(routers);


app.listen(3001);