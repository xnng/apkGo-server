exports.isPhone = (phone) => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/g.test(phone);

exports.compareVersion = (latest, old) => {
  const latestNumber = latest.split('.');
  const latestLeft = parseFloat(`${latestNumber[0]}.${latestNumber[1]}`);
  const latestRight = parseFloat(`${latestNumber[2]}`);

  const oldNumber = old.split('.');
  const oldLeft = parseFloat(`${oldNumber[0]}.${oldNumber[1]}`);
  const oldRight = parseFloat(`${oldNumber[2]}`);

  if (latestLeft === oldLeft) {
    if (latestRight > oldRight) {
      return 1;
    } if (latestRight < oldRight) {
      return -1;
    }
    return 0;
  } if (latestLeft > oldLeft) {
    return 1;
  }
  return -1;
};
