const { v4: uuidv4 } = require('uuid');
const Model = require('../models');
const { isPhone } = require('../utils/validate');
const { sendShortMessage } = require('../utils/sendShortMessage');
const { passwordToMD5, getJwtToken } = require('../utils/utils');
const { decode } = require('../utils/rsa');

exports.sendCode = async (phone) => {
  if (!isPhone(phone)) {
    return { code: -1, msg: '请输入正确的手机号' };
  }
  const requestTime = new Date().getTime();
  const existCode = Model.AppMessage.findOne({ where: { phone }, order: [['createdAt', 'DESC']] });
  if (existCode) {
    if (requestTime - existCode.sendTime < 60 * 1000) {
      return { code: -1, msg: '短信发送频繁' };
    }
  }
  const result = await sendShortMessage(phone);
  if (result.error) {
    return { code: -1, msg: result.error };
  }
  try {
    await Model.AppMessage.create({ phone, code: result.code, sendTime: result.sendTime });
    return { code: 0 };
  } catch (error) {
    return { code: -1, msg: error.message };
  }
};

const validateCode = async ({ phone, code }) => {
  const requestTime = new Date().getTime();
  const existCode = await Model.AppMessage.findAll({ where: { phone, code } });
  if (existCode.length === 0) {
    return { code: -1, msg: '验证码错误' };
  }
  const validateResult = existCode.filter((item) => requestTime - item.sendTime < 10 * 60 * 1000);
  if (validateResult.length !== 0) {
    return { code: 0 };
  }
  return { code: -1, msg: '验证码已过期' };
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
    return { code: -1, msg: '用户已存在，请直接登录' };
  }
  try {
    const originPassword = decode(password);
    const md5Password = passwordToMD5(originPassword);
    await Model.User.create({
      phone,
      nickName,
      password: md5Password,
      userId: uuidv4(),
    });
    return { code: 0, msg: '注册成功' };
  } catch (error) {
    return { code: -1, msg: error.message };
  }
};

exports.login = async ({ phone, code, password }) => {
  const user = Model.User.findOne({ where: phone });
  const token = getJwtToken({ phone });
  if (!user) {
    return { code: -1, msg: '用户不存在' };
  }
  if (code) {
    const validatePhone = await validateCode({ phone, code });
    if (validatePhone.code === 0) {
      return { code: 0, data: token };
    }
    return validatePhone;
  }
  const originPassword = decode(password);
  const md5Password = passwordToMD5(originPassword);
  if (md5Password === user.password) {
    return { code: 0, data: token };
  }
  return { code: -1, msg: '密码错误' };
};

exports.validateCode = validateCode;
