<template>

  <div class="home-view">
    <loading>
      <!-- <div class="big-word">请点击「对准电脑屏幕扫描」按钮<br>然后扫描二维码登录</div> -->

      <div id="login_container"></div>

      <!-- <img class="absolute-center" :src="'api/qrcodes/gen?code=' + code" alt="" /> -->

    </loading>
  </div>

</template>

<script>

import util from '../common/util'
import Loading from '../components/loading.vue'
import wechat from '../common/wechat'

var debug = require('debug')('HomeView');

export default {
  name: 'HomeView',
  components: {
    'loading': Loading
  },
  data () {
    return {
      code: ''
    }
  },
  computed: {
  },
  route: {
    data ({ to }) {
      const page = +to.params.page
      document.title = '趣直播'

      var params = this.$route.query;
      if (params.sessionToken) {
        this.loginBySessionToken(params.sessionToken, params.liveId)
        return
      }
      debug('params:' + params)
      // this.code = this.genCode()
      // this.poll()
    }
  },

  created () {
  },
  ready() {
    this.initWechatLogin()
  },
  destroyed () {
  },
  methods: {
    poll () {
      this.$http.get('qrcodes/scanned', {
        'code': this.code
      }).then((res) => {
        if (util.filterError(this, res)) {
          var result = res.data.result
          if (result.scanned) {
            util.loading(this)
            this.$http.get('self').then((res) => {
              util.loaded(this)
              if (util.filterError(this, res)) {
                this.$dispatch('updateUser', res.data.result)
                // scanned
                if (result.type == 0) {
                  this.$router.go('/mylist')
                } else if (result.type == 1) {
                  var json = JSON.parse(result.data)
                  var liveId = json.liveId
                  this.$router.go('/lives/' + liveId)
                } else {
                  util.show(this, 'error', '未知的类型');
                }
              }
            }, util.httpErrorFn(this))
          } else {
            // not scanned
            this.poll()
          }
        }
      })
    },
    loginBySessionToken: function (sessionToken, liveId) {
      this.$http.get('self', {
        sessionToken: sessionToken
      }).then((resp) => {
        if (util.filterError(this, resp)) {
          var token = resp.data.result.sessionToken
          debug('token:' + token)
          document.cookie = "SessionToken=" + token
          this.$dispatch('updateUser', resp.data.result)

          if (liveId) {
            this.$router.go('/lives/' + liveId)
          } else {
            this.$router.go('/attendedList')
          }
        }
      }, util.httpErrorFn(this));
    },
    genCode() {
      return 'quzhibo-' + util.randomString(32)
    },
    fetchUser() {
    },
    initWechatLogin() {
      var redirectUrl;
      if (util.isDebug()) {
        redirectUrl = 'http://quzhiboapp.com/#wechat/silentOauthTest'
      } else {
        redirectUrl = 'http://quzhiboapp.com/#wechat/silentOauth'
      }
      var obj = new WxLogin({
        id:"login_container",
        appid: wechat.wechatAppId,
        scope: 'snsapi_login',
        redirect_uri: encodeURIComponent(redirectUrl),
        state: util.randomString(6),
        style: 'white'
      })
    }
  },

  filters: {

  }
}
</script>

<style lang="stylus">

@import "../stylus/base.styl"

.home-view
  min-height 700px
  background url("../img/hero.jpg") no-repeat
  background-size cover
  .big-word
    color #fff
    font-size 20px
    text-align center
    margin-top 80px
  img
    width 250px
  #login_container
    padding-top 80px
    width 300px
    margin 0 auto
    .title
        color #fff

</style>
