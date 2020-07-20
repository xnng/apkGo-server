const crypto = require('crypto')

function generageSin (sessionKey, fileType) {
  const { ossId, ossKey, host, cloudBasePath, callbackUrl } = require('../config/app').oss

  const expiration = new Date(new Date().getTime() + 10 * 1000).toISOString()
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
  const fileName = `${cloudBasePath}${new Date().getTime()}.${fileType || 'apk'}`

  const callbackStr = {
    callbackUrl,
    callbackBody: `sessionKey=${sessionKey}`,
    callbackBodyType: 'application/x-www-form-urlencoded'
  }
  const callbackBase64 = Buffer.from(JSON.stringify(callbackStr)).toString('base64')

  return { ossId, host, policy, signature, fileName, callback: callbackBase64 }
}

// function compareVersion (latest, old) {
//   const
// }

module.exports = {
  generageSin
}
