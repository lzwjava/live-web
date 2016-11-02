var debug = require('debug')('util');


import moment from 'moment-timezone'
moment.locale('zh-cn')

exports.filterError = (component, res) => {
  debug('resp:%j', res.data)
  if (res.data.status != "success") {
    component.$dispatch('show-msg', 'error', res.data.error)
    return false;
  } else {
    return true;
  }
};

exports.escape = (html) => {
  html = html || '';
  return html
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
};

exports.httpErrorFn = (component) => {
  return function (res) {
    var text = res.statusText
    if (text == '') {
      text = '网络超时错误'
    }
    component.$dispatch('show-msg', 'error', text)
  }
};

var show = (component, type, text, duration) => {
  component.$dispatch('show-msg', type, text)
}

exports.promiseErrorFn = (comp, callback) => {
  return (error) => {
    show(comp, 'error', error)
    comp.$dispatch('loading', false)
    callback && callback()
  }
}

exports.statusText = (status) => {
  switch (status) {
    case 1:
      return '编辑中';
    case 5:
      return '审核中';
    case 10:
      return '报名中';
    case 20:
      return '直播中';
    case 30:
      return '已结束';
  }
  return '未知';
}

exports.curUser = () => {
  var userStr = window.localStorage.getItem('user')
  return JSON.parse(userStr)
}

exports.randomString = (length) => {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

exports.timeGap = (ts) => {
  var text = moment.tz(ts, "YYYY-MM-DD hh:mm::ss", 'Asia/Shanghai').fromNow()
  if (text) {
    text = text.replace(/[\u5185]/g, '后')
    text = text.replace(' ', '')
  }
  return text
}

exports.timeDuration = (ts) => {
  var text = moment.tz(ts, "YYYY-MM-DD hh:mm::ss", 'Asia/Shanghai').fromNow(true)
  if (text) {
    text = text.replace(' ', '')
  }
  return text
}

exports.loading = (comp) => {
  comp.$broadcast('loading')
}

exports.loaded = (comp) => {
  comp.$broadcast('loaded')
}

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function isDebug() {
  return process.env.NODE_ENV != 'production'
}

exports.randomString = randomString
exports.isDebug = isDebug
exports.show = show
