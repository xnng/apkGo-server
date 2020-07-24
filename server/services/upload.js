const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid')

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
  const fileName = `${uuidv1().split('-').join('')}.${fileType || 'apk'}`
  const uploadPath = cloudBasePath

  const callbackStr = {
    callbackUrl,
    callbackBody: `sessionKey=${sessionKey}`,
    callbackBodyType: 'application/x-www-form-urlencoded'
  }
  const callbackBase64 = Buffer.from(JSON.stringify(callbackStr)).toString('base64')

  return { ossId, host, policy, signature, fileName, uploadPath, callback: callbackBase64 }
}

function compareVersion (latest, old) {
  const latestNumber = latest.split('.')
  const latestLeft = parseFloat(`${latestNumber[0]}.${latestNumber[1]}`)
  const latestRight = parseFloat(`${latestNumber[2]}`)

  const oldNumber = old.split('.')
  const oldLeft = parseFloat(`${oldNumber[0]}.${oldNumber[1]}`)
  const oldRight = parseFloat(`${oldNumber[2]}`)

  if (latestLeft === oldLeft) {
    if (latestRight > oldRight) {
      return 1
    } else if (latestRight < oldRight) {
      return -1
    } else {
      return 0
    }
  } else if (latestLeft > oldLeft) {
    return 1
  } else {
    return -1
  }
}

module.exports = {
  generageSin,
  compareVersion
}
