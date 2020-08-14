const AppList = require('./appList');
const AppVersion = require('./appVersion');
const AppMessage = require('./appMessage');

AppList.sync({
  force: false,
});
AppVersion.sync({
  force: false,
});
AppMessage.sync({
  force: false,
});
