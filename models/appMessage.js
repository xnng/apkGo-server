const Sequelize = require('sequelize');
const sequelize = require('./config');

const AppMessage = sequelize.define(
  'app_message',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: Sequelize.BIGINT,
      comment: '手机号',
    },
    code: {
      type: Sequelize.INTEGER,
      comment: '验证码',
    },
    sendTime: {
      type: Sequelize.BIGINT,
      comment: '短信发送时间',
    },
  },
  { timestamps: true, underscored: false, comment: '短信发送记录' },
);

module.exports = AppMessage;
