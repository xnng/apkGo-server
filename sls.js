const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initSequelize } = require('./models/index');
const apk = require('./routes/apk');
const user = require('./routes/user');
const errorMiddleware = require('./middlewares/error');

const app = express();
initSequelize();

app.use(cors({ credentials: true, origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/apk', apk);
app.use('/user', user);
app.use(errorMiddleware);
app.listen(3003);
