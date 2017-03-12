import util from './util'
import {sprintf} from 'sprintf-js'

var wechatAppId = 'wxe80a6d2b5d54985c'

var baseOauthUrl = 'https://open.weixin.qq.com/connect/qrconnect?appid=%s&redirect_uri=%s' +
 '&response_type=code&scope=%s&state=%s'

function weixinOauthUrl(redirectUrl) {
  var state = util.randomString(6)
  return sprintf(baseOauthUrl, wechatAppId, encodeURIComponent(redirectUrl), 'snsapi_login', state)
}

function weixinOauthUserUrl() {
  var redirectUrl;
  if (util.isDebug()) {
    redirectUrl = 'http://quzhiboapp.com/#wechat/silentOauthTest'
  } else {
    redirectUrl = 'http://quzhiboapp.com/#wechat/silentOauth'
  }
  return weixinOauthUrl(redirectUrl)
}

function oauthLogin() {
  window.location = weixinOauthUserUrl()
}

exports.oauthLogin = oauthLogin
exports.wechatAppId = wechatAppId
exports.weixinOauthUrl = weixinOauthUrl
