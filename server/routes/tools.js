const router = require('express').Router()
const AppVersion = require('../models/appVersion')
const AppList = require('../models/appList')
const cdnConfig = require('../config/app').cdn
const ossConfig = require('../config/app').oss
const crypto = require('crypto');

router.get('/download/:id', async (req, res) => {
  const id = req.params.id
  if (id) {
    const apkVersion = await AppVersion.findOne({ where: { id } })
    if (apkVersion) {
      try {
        await setCount(apkVersion)
        const URI = `/${ossConfig.cloudBasePath}${apkVersion.fileName}`
        const timestamp = Math.round(new Date().getTime() / 1000) + 60
        const rand = 0
        const uid = 0
        const privateKey = cdnConfig.key
        const HashString = `${URI}-${timestamp}-${rand}-${uid}-${privateKey}`
        const HashValue = crypto.createHash('md5').update(HashString).digest('hex')
        res.json({
          code: 0,
          data: `${cdnConfig.host}${URI}?auth_key=${timestamp}-${rand}-${uid}-${HashValue}`
        })
      } catch (error) {
        res.json({ code: -1, msg: error.message })
      }
    } else {
      res.json({ code: -1, msg: '未找到该文件' })
    }
  } else {
    res.json({ code: -1, msg: '缺少必要参数' })
  }
})

async function setCount(apkVersion) {
  apkVersion.downLoadCount++
  await apkVersion.save()
  const apkObject = await AppList.findOne({ where: { packageName: apkVersion.packageName } })
  apkObject.downLoadCount++
  await apkObject.save()
}

module.exports = router