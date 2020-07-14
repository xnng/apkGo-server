const router = require('express').Router()
const crypto = require('crypto')
const ids = require('short-id')
const { v4: uuidv4 } = require('uuid')
const AppList = require('../models/appList')
const AppVersion = require('../models/appVersion')

let queue = []

router.post('/getPolicy', async (req, res) => {
  const { packageName, versionCode, versionName, updateText, icon, name } = req.body

  const oldVersion = await AppVersion.findOne({ where: { packageName, versionName } })
  if (oldVersion) {
    res.json({ code: -1, msg: '存在重复版本' })
  }

  const sessionKey = uuidv4()
  queue.push({ sessionKey, packageName, versionCode, versionName, updateText, icon, name })

  res.json({ code: 0, data: generageSin(sessionKey) })
})

router.post('/uploadCallback', async (req, res) => {
  const cacheQuery = queue.find(item => item.sessionKey === req.body.sessionKey)
  const { packageName, versionCode, versionName, name, updateText, icon, fileName } = cacheQuery

  try {
    const oldApp = await AppList.findOne({ where: { packageName } })
    if (oldApp) {
      if (icon !== oldApp.icon) {
        oldApp.icon = icon
        await oldApp.save()
      }

      const oldVersion = await AppVersion.findOne({ where: { packageName, versionName } })
      if (oldVersion) {
        res.json({ code: -1, msg: '存在重复版本' })
      }
      await AppVersion.create({ packageName, versionCode, versionName, updateText, fileName })
    } else {
      await AppList.create({ packageName, icon, name, urlKey: await getUrlKey() })
      await AppVersion.create({ packageName, versionCode, versionName, updateText, fileName })
    }

    res.json({ code: 0 })
  } catch (error) {
    res.json({ code: -1, msg: error.message })
  }
})

async function getUrlKey() {
  const newKey = ids.generate()
  const isExistSameKey = await AppList.findOne({ where: { urlKey: newKey } })
  console.log('isExistSameKey', isExistSameKey)
  if (isExistSameKey) {
    await getUrlKey()
  } else {
    return newKey
  }
}

function generageSin(sessionKey) {
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

  const policy = Buffer.from(JSON.stringify(policyString)).toString('base64')
  const signature = crypto.createHmac('sha1', ossKey).update(policy).digest('base64')
  const fileName = `${cloudBasePath}${new Date().getTime()}.apk`

  queue.find(item => item.sessionKey === sessionKey).fileName = `${host}/${fileName}`

  const callbackStr = {
    callbackUrl: "http://ali.xnngs.cn:3001/uploadCallback",
    callbackBody: `sessionKey=${sessionKey}`,
    callbackBodyType: "application/x-www-form-urlencoded"
  }
  const callbackBase64 = Buffer.from(JSON.stringify(callbackStr)).toString('base64')

  return { ossId, host, policy, signature, fileName, callback: callbackBase64 }
}

module.exports = router
