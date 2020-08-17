const { v4: uuidv4 } = require('uuid');
const Model = require('../models');
const { isPhone } = require('../utils/validate');
const { sendShortMessage } = require('../utils/sendShortMessage');
const { passwordToMD5 } = require('../utils/utils');
const { encode } = require('../utils/rsa');

exports.sendCode = async (phone) => {
  if (!isPhone(phone)) {
    return { type: 'fail', msg: '请输入正确的手机号' };
  }
  const requestTime = new Date().getTime();
  const existCode = Model.AppMessage.findOne({ where: { phone }, order: [['createdAt', 'DESC']] });
  if (existCode) {
    if (requestTime - existCode.sendTime < 60 * 1000) {
      return { type: 'fail', msg: '短信发送频繁' };
    }
  }
  const result = await sendShortMessage(phone);
  if (result.error) {
    return { type: 'fail', msg: result.error };
  }
  try {
    await Model.AppMessage.create({ phone, code: result.code, sendTime: result.sendTime });
    return { type: 'success' };
  } catch (error) {
    return { type: 'fail', msg: error.message };
  }
};

const validateCode = async ({ phone, code }) => {
  const requestTime = new Date().getTime();
  const existCode = await Model.AppMessage.findAll({ where: { phone, code } });
  if (existCode.length === 0) {
    return { type: 'fail', msg: '验证码错误' };
  }
  const validateResult = existCode.filter((item) => (requestTime - item.sendTime < 10 * 60 * 1000));
  if (validateResult.length !== 0) {
    return { type: 'success' };
  }
  return { type: 'fail', msg: '验证码已过期' };
};

exports.register = async ({
  phone, nickName, code, password,
}) => {
  const validatePhone = await validateCode({ phone, code });
  if (validatePhone.type === 'fail') {
    return validatePhone;
  }
  const isExistUser = await Model.User.findOne({ where: { phone } });
  if (isExistUser) {
    return { type: 'fail', msg: '用户已存在，请直接登录' };
  }
  try {
    const originPassword = encode(password);
    const md5Password = passwordToMD5(originPassword);
    await Model.User.create({
      phone, nickName, password: md5Password, userId: uuidv4(),
    });
    return { type: 'success', msg: '注册成功' };
  } catch (error) {
    return { type: 'fail', msg: error.message };
  }
};

exports.validateCode = validateCode;
