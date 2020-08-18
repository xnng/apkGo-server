const router = require('express').Router();
const {
  sendCode, validateCode, register, login,
} = require('../services/user');
const { getPublicKey } = require('../utils/rsa');

router.get('/sendCode', async (req, res) => {
  if (!req.query.phone) {
    res.json({ code: -1, msg: '缺少必要参数' });
  }
  const result = await sendCode(req.query.phone);
  res.json(result);
});

router.post('/validateCode', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    res.json({ code: -1, msg: '缺少必要参数' });
  }
  const result = await validateCode(req.body);
  res.json(result);
});

router.get('/getRSA', async (req, res) => {
  const publicKey = getPublicKey;
  res.json({ code: 0, data: publicKey });
});

/**
 * 注册
 * @param {Number} phone 手机号
 * @param {String} nickName 昵称
 * @param {Number} code 手机验证码
 * @param {String} password 加密过的密码
 */
router.post('/register', async (req, res) => {
  const result = await register(req.body);
  res.json(result);
});

/**
 * 登录
 * @param {Number} phone 手机号
 * @param {Number=} code 短信验证码
 * @param {String=} password 加密过的密码
 */
router.post('/login', async (req, res) => {
  const result = await login(req.body);
  res.json(result);
});

module.exports = router;
