const AppList = require('./appList')
const AppVersion = require('./appVersion')

// AppList.sync({
//   force: true
// })
// AppVersion.sync({
//   force: true
// })

AppList.hasMany(AppVersion, {foreignKey: 'packageName', sourceKey: 'packageName'})
AppVersion.belongsTo(AppList, {foreignKey: 'packageName', targetKey: 'packageName'})