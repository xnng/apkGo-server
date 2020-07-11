const router = require('express').Router()
const crypto = require('crypto')

router.get('/getPolicy', async (req, res) => {
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
  res.json({ ossId, host, policy, signature, fileName })
})

module.exports = router
