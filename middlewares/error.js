module.exports = (err, req, res, next) => {
  console.log("err---------------", err)
  if (err) {
    res.json({ code: 0, msg: '系统错误' })
  }
}