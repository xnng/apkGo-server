const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const { generageSin, compareVersion } = require('../services/upload')
const AppList = require('../models/appList')
const AppVersion = require('../models/appVersion')

const queue = []

async function checkInfo ({ packageName, versionName, res }) {
  const isExist = await AppVersion.findOne({ where: { packageName, versionName } })
  if (isExist) {
    res.json({ code: -1, msg: '已上传过该版本，请勿重复上传' })
    return false
  }
  const latestVersion = await AppVersion.findOne({ where: { packageName }, order: [['createdAt', 'DESC']] })
  if (latestVersion) {
    if (!/[0-9]\.[0-9]\.[0-9]/.test(versionName)) {
      res.json({ code: -1, msg: '版本号格式不正确，正确示例：1.1.1' })
      return false
    }
    const test = compareVersion(versionName, latestVersion.versionName)
    if (compareVersion(versionName, latestVersion.versionName) !== 1) {
      res.json({ code: -1, msg: '版本过低，请调整版本号' })
      return false
    }
  }
  return true
}

router.post('/getPolicy', async (req, res) => {
  const { packageName, versionName, fileType } = req.body
  if (!await checkInfo({ packageName, versionName, res })) return

  const sessionKey = uuidv4()
  queue.push({ ...req.body, sessionKey })
  const sendBody = generageSin(sessionKey, fileType)
  const cacheItem = queue.find(item => item.sessionKey === sessionKey)
  cacheItem.downloadUrl = `${sendBody.host}/${sendBody.fileName}`

  res.json({ code: 0, data: sendBody })
})

router.post('/uploadCallback', async (req, res) => {
  const cacheQuery = queue.find(item => item.sessionKey === req.body.sessionKey)
  const { packageName, versionCode, versionName, name, updateText, icon, downloadUrl } = cacheQuery

  try {
    const oldApp = await AppList.findOne({ where: { packageName } })
    if (oldApp) {
      if (icon !== oldApp.icon) {
        oldApp.icon = icon
        await oldApp.save()
      }

      if (!await checkInfo()) return
      await AppVersion.create({ packageName, versionCode, versionName, updateText, downloadUrl })
    } else {
      await AppList.create({ packageName, icon, name })
      await AppVersion.create({ packageName, versionCode, versionName, updateText, downloadUrl })
    }

    res.json({ code: 0 })
  } catch (error) {
    res.json({ code: -1, msg: error.message })
  }
})

module.exports = router
