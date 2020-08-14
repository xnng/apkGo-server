const sequelize = require('./config');
const AppList = require('./appList');
const AppMessage = require('./appMessage');
const AppVersion = require('./appVersion');

const initSequelize = () => {
  sequelize
    .authenticate()
    .then(() => {
      AppList.sync({ force: false });
      AppVersion.sync({ force: false });
      AppMessage.sync({ force: false });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(`数据库连接出错${err.message}`);
    });
};

module.exports = {
  AppList,
  AppVersion,
  AppMessage,
  initSequelize,
};
