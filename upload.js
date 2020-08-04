const OSS = require('ali-oss')
const fs = require('fs')
const path = require('path')
const os = require('os')

const client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: process.env.ALI_OSS_ID,
  accessKeySecret: process.env.ALI_OSS_KEY,
  bucket: 'xnng-apks'
})

const config = {
  localBasePath: 'dist',
  cloudBasePath: '/'
}

const initLocalPath = path.resolve(__dirname, config.localBasePath)

async function uploadFileToAliOSS (currentPath = initLocalPath) {
  const currentDir = fs.readdirSync(currentPath)
  for (let i = 0; i < currentDir.length; i++) {
    const fsStatus = fs.statSync(path.join(currentPath, currentDir[i]))
    if (fsStatus.isDirectory()) {
      const nextPath = path.join(currentPath, currentDir[i])
      uploadFileToAliOSS(nextPath)
    } else {
      const relativePath = path.relative(initLocalPath, currentPath)
      const cloudPath = path.join(
        config.cloudBasePath,
        relativePath,
        currentDir[i]
      )
      const localPath = path.join(currentPath, currentDir[i])
      await uploadFile(
        transtormPathToLinuxStyle(cloudPath),
        transtormPathToLinuxStyle(localPath)
      )
    }
  }
}

async function uploadFile (cloudPath, localPath) {
  const fileStream = fs.createReadStream(localPath)
  try {
    const result = await client.putStream(cloudPath, fileStream)
    console.log(`upload success: ${result.res.requestUrls[0]}`)
  } catch (error) {
    console.log(`upload fail：${error}`)
  }
}

function transtormPathToLinuxStyle (path) {
  if (os.platform() === 'win32') {
    return path.split('\\').join('/')
  } else {
    return path
  }
}

uploadFileToAliOSS()
