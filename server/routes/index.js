const router = require('express').Router()
const crypto = require('crypto')
const ids = require('short-id')
const AppList = require('../models/appList')
const AppVersion = require('../models/appVersion')

router.post('/getPolicy', async (req, res) => {
  const { packageName, versionCode, versionName, updateText, icon } = req.body

  const oldApp = await AppList.findOne({ where: { packageName } })
  if (oldApp) {
    if (icon !== oldApp.icon) {
      oldApp.icon = icon
      await oldApp.save()
    }
    const oldVersion = await AppVersion.findOne({ where: { packageName } })
    if (oldVersion.versionName == versionName) {
      res.json({ code: -1, msg: '该包名 app 已存在相同版本号，请勿重复上传' })
    } else {
      await AppVersion.create({ packageName, versionCode, versionName, updateText })

      res.json({ code: 0, data: generageSin() })
    }
  } else {
    await AppList.create({ ...req.body, urlKey: ids.store(packageName) })
    await AppVersion.create({ packageName, versionCode, versionName, updateText })

    res.json({ code: 0, data: generageSin() })
  }
})

function generageSin() {
  const { ossId, ossKey, host, cloudBasePath } = require('../config/app').oss

  const expiration = new Date(new Date().getTime() + 10 * 1000).toISOString()
  const fileMaxSize = 100 * 1024 * 1024
  const policyString = {
    expiration,
    conditions: [
      ['content-length-range', 0, fileMaxSize],
      ['starts-with', '$key', cloudBasePath],
    ],
  }

  const policy = new Buffer(JSON.stringify(policyString)).toString('base64')
  const signature = crypto.createHmac('sha1', ossKey).update(policy).digest('base64')
  const fileName = `${cloudBasePath}${new Date().getTime()}.apk`

  return { ossId, host, policy, signature, fileName }
}

module.exports = router
