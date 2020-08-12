const ossConfig = require('../config/app').oss
const cdnConfig = require('../config/app').cdn
const crypto = require('crypto')

exports.generateCDNsin = (fileName) => {
  const URI = `/${ossConfig.cloudBasePath}${fileName}`
  const timestamp = Math.round(new Date().getTime() / 1000) + 60
  const rand = 0
  const uid = 0
  const privateKey = cdnConfig.key
  const HashString = `${URI}-${timestamp}-${rand}-${uid}-${privateKey}`
  const HashValue = crypto.createHash('md5').update(HashString).digest('hex')
  return `${cdnConfig.host}${URI}?auth_key=${timestamp}-${rand}-${uid}-${HashValue}`
}