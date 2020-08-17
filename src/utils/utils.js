const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const jwtSecret = 'apk.xnngs.cn';

exports.getJwtToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '30 days' });

exports.decodeJwt = (token) => {
  try {
    const result = jwt.verify(token, jwtSecret);
    return { code: 0, data: result };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { code: -1, msg: 'token过期' };
    }
    return { code: -1, msg: 'token无效' };
  }
};

exports.passwordToMD5 = (password) => {
  const salt = ['xnng', 'gnnx', '123'];
  const generateHash = (str) => crypto.createHash('md5').update(str).digest('base64');
  let result = '';
  salt.forEach((item) => {
    result = generateHash(`${password}${item}`);
  });
  return result;
};
