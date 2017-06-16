<template>

  <div class="home-view">
    <loading>
      <!-- <div class="big-word">请点击「对准电脑屏幕扫描」按钮<br>然后扫描二维码登录</div> -->

      <button  @click="wechatLogin" class="wechat-login btn btn-blue">
        微信登录
      </button>

      <!-- <div id="login_container"></div> -->

      <!-- <img class="absolute-center" :src="'api/qrcodes/gen?code=' + code" alt="" /> -->

    </loading>
  </div>

</template>

<script>

import util from '../common/util'
import Loading from '../components/loading.vue'
import wechat from '../common/wechat'

require('sprintf-js')

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
    loginBySessionToken (sessionToken, liveId) {
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
    fetchUser() {
    },
    initWechatLogin() {

    },
    wechatLogin() {
      wechat.oauthLogin()
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
  text-align center
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
  .wechat-login
    margin-top 200px
    width 200px
    font-size 20px



</style>
