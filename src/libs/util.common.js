export function getUuid () {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16)
      }
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let perforNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (perforNow + random) % 16 | 0
      perforNow = Math.floor(perforNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

export function formatFileSize (filesize) {
  if (!filesize) {
    return '0 Bytes'
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index
  const srcSize = parseFloat(filesize)
  index = Math.floor(Math.log(srcSize) / Math.log(1024))
  let size = srcSize / Math.pow(1024, index)
  size = size.toFixed(2)
  return size + unitArr[index]
}

/**
 * 格式化时间戳
 * @param timespan
 * @returns {string}
 */
export function formatMsgTime (timespan) {
  let dateTime = new Date(timespan) // 将传进来的字符串或者毫秒转为标准时间
  let year = dateTime.getFullYear()
  let month = dateTime.getMonth() + 1
  let day = dateTime.getDate()
  let hour = dateTime.getHours()
  let minute = dateTime.getMinutes()
  let second = dateTime.getSeconds()
  let millisecond = dateTime.getTime() // 将当前编辑的时间转换为毫秒
  let now = new Date() // 获取本机当前的时间
  let nowNew = now.getTime() // 将本机的时间转换为毫秒
  let milliseconds
  let timeSpanStr
  milliseconds = nowNew - millisecond
  if (milliseconds <= 1000 * 60) { // 小于一分钟展示为刚刚
    timeSpanStr = '刚刚'
  } else if (1000 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60) { // 大于一分钟小于一小时展示为分钟
    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
  } else if (1000 * 60 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) { // 大于一小时小于一天展示为小时
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
  } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) { // 大于一天小于十五天展示位天
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
  } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
    timeSpanStr = formatNum(month) + '-' + formatNum(day) + ' ' + formatNum(hour) + ':' + formatNum(minute) + ':' + formatNum(second)
  } else {
    timeSpanStr = year + '-' + formatNum(month) + '-' + formatNum(day) + ' ' + formatNum(hour) + ':' + formatNum(minute) + ':' + formatNum(second)
  }
  function formatNum (num) {
    if (num < 10) {
      return '0' + num
    } else {
      return num
    }
  }
  return timeSpanStr
}

/**
 * 获取地址栏参数
 * @param name
 * @returns {string|null}
 */
export function getQueryString (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return ''
}
