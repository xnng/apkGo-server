module.exports = (err, req, res, next) => {
  if (err) {
    res.json({ code: 0, msg: '系统错误' });
  } else {
    next();
  }
};
