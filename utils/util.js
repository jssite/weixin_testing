const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatJson = n => {
    let c = n.split('&');
    let r = {}
    c.forEach((item,index) => {
        let n = item.split('=');
        r[n[0]] = n[1]
    })
    return r;
  }

module.exports = {
  formatTime: formatTime,
  formatJson: formatJson
}
