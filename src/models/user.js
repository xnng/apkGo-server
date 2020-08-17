const Sequelize = require('sequelize');
const sequelize = require('./config');

const User = sequelize.define(
  'app_user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: Sequelize.BIGINT,
      notNull: true,
      unique: true,
      comment: '手机号',
    },
    userId: {
      type: Sequelize.STRING,
      comment: '用户Id',
    },
    nickName: {
      type: Sequelize.STRING,
      comment: '昵称',
    },
  },
  { timestamps: true, underscored: false, comment: '版本信息' },
);

module.exports = User;
