const Sequelize = require('sequelize')
const sequelize = require('./index')

const AppList = sequelize.define(
  'app_list',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packageName: {
      type: Sequelize.STRING,
      notNull: true,
      unique: true,
      comment: '包名',
    },
    downLoadCount: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
      comment: '下载次数',
    },
    icon: {
      type: Sequelize.STRING,
      notNull: true,
      comment: '图标',
    },
    urlKey: {
      type: Sequelize.STRING,
      notNull: true,
      unique: true,
      comment: '页面访问路径',
    },
    name: {
      type: Sequelize.STRING,
      notNull: true,
      unique: true,
      comment: 'app名称',
    },
  },
  { timestamps: true, underscored: false, comment: '版本信息' }
)

module.exports = AppList
