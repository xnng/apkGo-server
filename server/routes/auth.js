const router = require('express').Router()
const { generateCode } = require('../services/sendMessage')
const { isPhone } = require('../utils/validate')
const AppMessage = require('../models/appMessage')

router.get('/sendCode', async (req, res) => {
  const requestTime = new Date().getTime()
  const phone = req.query.phone
  if (!isPhone(phone)) {
    res.json({ code: -1, msg: '请输入正确的手机号' })
    return
  }
  const existCode = AppMessage.findOne({ where: { phone }, order: [['createdAt', 'DESC']], })
  if (existCode) {
    if (requestTime - existCode.sendTime < 60 * 1000) {
      res.json({ code: -1, msg: '短信发送频繁' })
      return
    }
  }
  const result = await generateCode(phone)
  if (result.error) {
    res.json({ code: -1, msg: result.error })
    return
  }
  try {
    await AppMessage.create({ phone, code: result.code, sendTime: result.sendTime })
    res.json({ code: 0 })
  } catch (error) {
    res.json({ code: -1, msg: error.message })
  }
})

router.post('/validateCode', async (req, res) => {
  const requestTime = new Date().getTime()
  const { phone, code } = req.body
  if (!phone || !code) {
    res.json({ code: -1, msg: '缺少必要参数' })
  }
  const existCode = AppMessage.findAll(where: { phone })
  const validateCode = existCode.filter(item => (requestTime - item.sendTime > 10 * 60 * 1000))
  if (validateCode.find(val => val.code == code)) {
    res.json({ code: 0 })
  } else {
    res.json({ code: -1, msg: '验证码错误' })
  }
})

module.exports = router