const Model = require('../models');
const { isPhone } = require('../utils/validate');
const { sendShortMessage } = require('../utils/sendShortMessage');

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

exports.validateCode = async ({ phone, code }) => {
  const requestTime = new Date().getTime();
  const existCode = await Model.AppMessage.findAll({ where: { phone, code } });
  if (existCode.length === 0) {
    return { type: 'fail', msg: '验证码错误' };
  }
  const validateCode = existCode.filter((item) => (requestTime - item.sendTime < 10 * 60 * 1000));
  if (validateCode.length !== 0) {
    return { type: 'success' };
  }
  return { type: 'fail', msg: '验证码已过期' };
};
