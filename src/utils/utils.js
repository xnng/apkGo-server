const crypto = require('crypto');

exports.passwordToMD5 = (password) => {
  const salt = ['xnng', 'gnnx', '123'];
  const generateHash = (str) => crypto.createHash('md5').update(str).digest('base64');
  let result = '';
  salt.forEach((item) => {
    result = generateHash(`${password}${item}`);
  });
  return result;
};
