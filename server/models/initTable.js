const AppList = require('./appList')
const AppVersion = require('./appVersion')

AppList.sync({
  force: true
})
AppVersion.sync({
  force: true
})