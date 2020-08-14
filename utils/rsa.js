const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const priv = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCs9Sxx2XL7z6IE6Ytr5orEwd78YeBx/+Dd68jTVE4oiiwv4YUf
q/mRqhJkN91DhMlfHs9c/5U4U5ELPzGFvcrlBovBQ5LodY7/KC8Gme2AdsGgu2ol
YgrYcds7DxN6cZgRkhXDOM2wLMbWzsjrOI43YlehhN0Ld0JO5wyhtmaocwIDAQAB
AoGAIxLM4oGAKcRfTLO3jDgCKAhQmcmXZEbJaPdpkEFmYB40+7i18EhFod5lQGF7
wzdoRpvO3UMPFY8MuMUl28MzI4z3DhH6jmR+V5GCxhHfD8D/IaxXddj9QBRUTyxM
5z5g0To6PobHhE4UEFrlY86aUoSYMc4zXUzLCukQ92BhswECQQDhYfNi8cNiJzNj
019PNh8PfqbuCR/ca7g3KxkMoP593EnxIHzJ6kv7Zd2POYbIyg3amOSMYKyw4h4o
I7r8nifBAkEAxHQPlOB5HhnvcbcBPFz4EwdJj0EoVw/eW/dgI5PROOKVEESBx+Fx
uRiTj9AjwL5mf3yo5DLzZvE0ewfd9Fv9MwJAf4Pipy1vxN229pjFiNRvGF4o5e4l
p5kOfbAVmQ6RTfZPo2wlDjxQRukoRHtgpcOjuPTeAgpESkN0mnM0vO5iQQJBAI8w
aQsCckVWcghYczYkLUzxStR3kYejsVcm/5Pu8dicjjnFNTMTR2i6WRPBic26+cqC
ejeaS38E4FOscELjqbECQGU0r90wmkJeMXi/FZ+8zgZ319sjoTaWp4HVZZppT+uG
KkX82OgzrppHIP91J+WMQqckVKE43QMjFsUqroCZoak=
-----END RSA PRIVATE KEY-----
`

const pub = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCs9Sxx2XL7z6IE6Ytr5orEwd78
YeBx/+Dd68jTVE4oiiwv4YUfq/mRqhJkN91DhMlfHs9c/5U4U5ELPzGFvcrlBovB
Q5LodY7/KC8Gme2AdsGgu2olYgrYcds7DxN6cZgRkhXDOM2wLMbWzsjrOI43Yleh
hN0Ld0JO5wyhtmaocwIDAQAB
-----END PUBLIC KEY-----
`

/**
 * @returns {Base64} 公钥
 */
exports.getPublicKey = () => {
  return new Buffer(pub).toString('base64')
}

/**
 * @param {String} str 需要加密的字符串
 * @returns {Base64} 加密后的 base64
 */
exports.encode = (str) => {
  return crypto.publicEncrypt(pub, Buffer.from(str)).toString('base64')
}

/**
 * 
 * @param {Base64} str 加密 base64
 * @returns {String} 解密后的字符串
 */
exprots.decode = (str) => {
  return crypto.privateDecrypt(priv, Buffer.from(str, 'base64')).toString()
}