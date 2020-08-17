const router = require('express').Router();
const { sendCode, validateCode, register } = require('../services/user');
const { getPublicKey } = require('../utils/rsa');

router.get('/sendCode', async (req, res) => {
  if (!req.query.phone) {
    res.json({ code: -1, msg: '缺少必要参数' });
  }
  const result = await sendCode(req.query.phone);
  if (result.type !== 'success') {
    res.json({ code: -1, msg: result.msg });
  } else {
    res.json({ code: 0 });
  }
});

router.post('/validateCode', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    res.json({ code: -1, msg: '缺少必要参数' });
  }
  const result = await validateCode(req.body);
  if (result.type === 'fail') {
    res.json({ code: -1, msg: result.msg });
  } else {
    res.json({ code: 0 });
  }
});

router.get('/getRSA', async (req, res) => {
  const publicKey = getPublicKey;
  res.json({ code: 0, data: publicKey });
});

router.post('/register', async (req, res) => {
  const result = await register(req.body);
  if (result.type === 'fail') {
    res.json({ code: -1, msg: result.msg });
  } else {
    res.json({ code: 0 });
  }
});

module.exports = router;
