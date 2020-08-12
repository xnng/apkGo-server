const ossConfig = require('../config/app').oss
const crypto = require('crypto')

exports.generageOSSsin = (sessionKey) => {
  const { ossId, ossKey, host, cloudBasePath, callbackUrl } = ossConfig

  // 签名需要在生成后的 10 秒内被使用
  const expiration = new Date(new Date().getTime() + 10 * 1000).toISOString()
  // apk 最大限制 100MB
  const fileMaxSize = 100 * 1024 * 1024
  const policyString = {
    expiration,
    conditions: [
      ['content-length-range', 0, fileMaxSize],
      ['starts-with', '$key', cloudBasePath]
    ]
  }

  const policy = Buffer.from(JSON.stringify(policyString)).toString('base64')
  const signature = crypto.createHmac('sha1', ossKey).update(policy).digest('base64')
  const uploadPath = cloudBasePath

  const callbackStr = {
    callbackUrl,
    callbackBody: `sessionKey=${sessionKey}`,
    callbackBodyType: 'application/x-www-form-urlencoded'
  }
  const callbackBase64 = Buffer.from(JSON.stringify(callbackStr)).toString('base64')

  return { ossId, host, policy, signature, uploadPath, callback: callbackBase64 }
}