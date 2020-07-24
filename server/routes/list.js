const router = require('express').Router()
const AppList = require('../models/appList')
const AppVersion = require('../models/appVersion')

router.get('/getAppList', async (req, res) => {
  AppList.hasMany(AppVersion, { foreignKey: 'packageName', sourceKey: 'packageName' })
  AppVersion.belongsTo(AppList, { foreignKey: 'packageName', targetKey: 'packageName' })
  try {
    const data = await AppList.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: AppVersion,
          limit: 1,
          order: [['versionCode', 'DESC']],
          attributes: ['id', 'versionCode', 'versionName']
        }
      ]
    })
    res.json({ code: 0, data })
  } catch (error) {
    res.json({ code: 1, msg: error.message })
  }
})

router.get('/getVersionList', async (req, res) => {
  const { packageName, limit, offset } = req.query
  try {
    const data = await AppVersion.findAndCountAll({
      order: [['createdAt', 'DESC']],
      where: { packageName },
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
    res.json({ code: 0, data })
  } catch (error) {
    res.json({ code: 1, msg: error.message })
  }
})

module.exports = router