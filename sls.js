const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initSequelize } = require('./src/models/index');
const apk = require('./src/routes/apk');
const user = require('./src/routes/user');
const errorMiddleware = require('./src/middlewares/error');

const app = express();
initSequelize();

app.use(cors({ credentials: true, origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', (req, res) => {
  res.json({ code: 0 });
});
app.use('/apk', apk);
app.use('/user', user);
app.use(errorMiddleware);
app.listen(3003);
