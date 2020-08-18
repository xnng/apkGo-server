const decodeJwt = require('../utils/utils');
const Model = require('../models');

const authenticate = async (req, res, next) => {
  if (!/^\/user/.test(req.path)) {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({ code: -1, msg: '未找到token' });
    }
    const verifyResult = decodeJwt(authorization);
    if (verifyResult.code === 0) {
      next();
    }
  } else {
    next();
  }
};

module.exports = authenticate;
