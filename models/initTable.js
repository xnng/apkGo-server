const AppList = require('./appList')
const AppVersion = require('./appVersion')
const AppMessage = require('./appMessage')

// AppList.sync({
//   force: true
// })
// AppVersion.sync({
//   force: true
// })
AppMessage.sync({
  force: true
})
