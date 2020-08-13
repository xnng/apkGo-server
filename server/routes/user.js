const router = require('express').Router()
const { sendCode, validateCode } = require('../services/user')

const AppMessage = require('../models/appMessage')

router.get('/sendCode', async (req, res) => {
  if (!req.query.phone) {
    res.json({ code: -1, msg: '缺少必要参数' })
  }
  const result = await sendCode(req.query.phone)
  if (result.type !== 'success') {
    res.json({ code: -1, msg: result.msg })
  } else {
    res.json({ code: 0 })
  }
})

router.post('/validateCode', async (req, res) => {
  const { phone, code } = req.body
  if (!phone || !code) {
    res.json({ code: -1, msg: '缺少必要参数' })
  }
  const result = await validateCode(req.body)
  if (result.type == 'fail') {
    res.json({ code: -1, msg: result.msg })
  } else {
    res.json({ code: 0 })
  }
})

module.exports = router