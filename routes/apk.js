const router = require('express').Router();
const {
  getAppList,
  getOneApp,
  getVersionList,
  checkUploadInfo,
  getUploadPolicy,
  saveUploadInfo,
  downloadApk,
} = require('../services/apk');

router.get('/allApk', async (req, res) => {
  const data = await getAppList();
  res.json({ code: 0, data });
});

router.get('/one/:id', async (req, res) => {
  const { id } = req.params;
  const data = await getOneApp(id);
  if (!data.type && data.type !== 'fail') {
    res.json({ code: 0, data });
  } else {
    res.json({ code: -1, msg: data.msg });
  }
});

router.get('/allVersion', async (req, res) => {
  const { packageName, limit, offset } = req.query;
  const data = await getVersionList({ packageName, limit, offset });
  res.json({ code: 0, data });
});

/**
 * 上传时获取签名
 * @param {String} name app 名称
 * @param {String} icon logo
 * @param {String} packageName 包名
 * @param {Number} versionCode build 号
 * @param {String} versionName 版本号
 * @param {String} updateText 更新日志
 * @param {String} fileName 文件名
 * @param {Number} size 文件大小，单位 MB
 */
router.get('/upload/getPolicy', async (req, res) => {
  const checkInfo = await checkUploadInfo(req.body);
  if (checkInfo.type !== 'success') {
    res.json({ code: -1, msg: checkInfo.msg });
    return;
  }
  const data = {
    ...getUploadPolicy(req.body),
    fileName: req.body.fileName,
  };
  res.json({ code: 0, data });
});

router.post('/upload/callback', async (req, res) => {
  const { sessionKey } = req.body;
  const result = await saveUploadInfo(sessionKey);
  if (result.type === 'success') {
    res.json({ code: 0 });
  } else {
    res.json({ code: -1, msg: result.msg });
  }
});

router.get('/download/:id', async (req, res) => {
  const { id } = req.params;
  const data = await downloadApk(id);
  if (!data.type) {
    res.json({ code: 0, data });
  } else {
    res.json({ code: -1, msg: data.msg });
  }
});

module.exports = router;
