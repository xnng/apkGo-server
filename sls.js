const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initSequelize } = require('./src/models/index');
const apk = require('./src/routes/apk');
const user = require('./src/routes/user');
const authenticate = require('./src/middlewares/auth');

const app = express();
initSequelize();

app.use(cors({ credentials: true, origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authenticate);
app.use('/apk', apk);
app.use('/user', user);
app.listen(3003);
