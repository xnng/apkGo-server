const express = require('express')
const cors = require('cors')
const sequelize = require('./models/config')
const bodyParser = require('body-parser')
const apk = require('./routes/apk')
const user = require('./routes/user')
const errorMiddleware = require('./middlewares/error')

const app = express()

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

app.use(cors({ credentials: true, origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/apk', apk)
app.use('/user', user)
app.use(errorMiddleware)
app.listen(3003)
