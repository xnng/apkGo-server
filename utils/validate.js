exports.isPhone = (phone) => {
  return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/g.test(phone)
}

exports.compareVersion = (latest, old) => {
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