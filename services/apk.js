const router = require('express').Router()
const Model = require('../models')
const crypto = require('crypto')
const { compareVersion } = require('../utils/validate')
const { generageOSSsin } = require('../utils/uploadToOSS')
const { generateCDNsin } = require('../utils/downLoadFromCDN')
const { v1: uuidv1, v4: uuidv4 } = require('uuid')

exports.getAppList = async () => {
  Model.AppList.hasMany(Model.AppVersion, { foreignKey: 'packageName', sourceKey: 'packageName' })
  Model.AppVersion.belongsTo(Model.AppList, { foreignKey: 'packageName', targetKey: 'packageName' })
  return Model.AppList.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Model.AppVersion,
        limit: 1,
        order: [['versionCode', 'DESC']],
        attributes: ['id', 'versionCode', 'versionName']
      }
    ]
  })
}

exports.getOneApp = async (id) => {
  console.log('exports.getOneApp -> id', id)
  const versionInfo = await Model.AppVersion.findByPk(id)
  if (versionInfo) {
    const appInfo = await Model.AppList.findOne({ where: { packageName: versionInfo.packageName } })
    return {
      ...appInfo.dataValues,
      versionInfo
    }
  } else {
    return {
      type: 'fail',
      msg: '参数错误'
    }
  }
}

exports.getVersionList = async ({ packageName, limit, offset }) => {
  return Model.AppVersion.findAndCountAll({
    order: [['createdAt', 'DESC']],
    where: { packageName },
    limit: parseInt(limit),
    offset: parseInt(offset)
  })
}

exports.checkUploadInfo = async ({ packageName, versionName }) => {
  const isExist = await Model.AppVersion.findOne({ where: { packageName, versionName } })
  if (isExist) {
    return { type: 'fail', msg: '已上传过该版本，请勿重复上传' }
  }
  const latestVersion = await Model.AppVersion.findOne({ where: { packageName }, order: [['createdAt', 'DESC']] })
  if (latestVersion) {
    if (!/[0-9]\.[0-9]\.[0-9]/.test(versionName)) {
      return { type: 'fail', msg: '版本号格式不正确，正确示例：1.1.1' }
    }
    if (compareVersion(versionName, latestVersion.versionName) !== 1) {
      return { type: 'fail', msg: '版本过低，请调整版本号' }
    }
  }
  return { type: 'success' }
}

exports.getUploadPolicy = (params) => {
  if (!global.uploadQueue) {
    global.uploadQueue = []
  }
  const sessionKey = uuidv4()
  global.uploadQueue.push({ ...params, sessionKey })
  return generageOSSsin(sessionKey)
}

exports.saveUploadInfo = async (sessionKey) => {
  try {
    const uploadData = global.uploadQueue.find(item => item.sessionKey === sessionKey)
    const { packageName, versionCode, versionName, name, updateText, icon, fileName, size } = uploadData
    const oldApp = await Model.AppList.findOne({ where: { packageName } })
    if (oldApp) {
      if (icon !== oldApp.icon) {
        oldApp.icon = icon
        await oldApp.save()
      }
      await Model.AppVersion.create({ packageName, versionCode, versionName, updateText, fileName, size })
    } else {
      await Model.AppList.create({ packageName, icon, name })
      await Model.AppVersion.create({ packageName, versionCode, versionName, updateText, fileName, size })
    }
    return { type: 'success' }
  } catch (error) {
    return { type: 'fail', msg: error.message }
  }
}

exports.downloadApk = async (id) => {
  const apkVersion = await Model.AppVersion.findOne({ where: { id } })
  if (apkVersion) {
    apkVersion.downLoadCount++
    await apkVersion.save()
    const apkObject = await Model.AppList.findOne({ where: { packageName: apkVersion.packageName } })
    apkObject.downLoadCount++
    await apkObject.save()
    return generateCDNsin(apkVersion.fileName)
  } else {
    return { type: 'error', msg: '未找到该文件' }
  }
}
