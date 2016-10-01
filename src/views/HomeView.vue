<template>

  <div class="home-view">
    <div class="big-word">请在微信版直播页点击电脑按钮 <br>扫描二维码登录电脑版</div>
    <img class="absolute-center" :src="'api/qrcodes/gen?code=' + code" alt="" />
  </div>

</template>

<script>

import util from '../common/util'

var debug = require('debug')('HomeView');

export default {
  name: 'HomeView',
  components: {
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
        this.loginBySessionToken(params.sessionToken)
        return
      }
      debug('params:' + params)
      this.code = this.genCode()
      this.poll()
    }
  },

  created () {

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
            this.$dispatch('loading', true)
            this.$http.get('self').then((res) => {
              this.$dispatch('loading', false)
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
    loginBySessionToken: function (sessionToken) {
      this.$http.get('self', {
        sessionToken: sessionToken
      }).then((resp) => {
        if (util.filterError(this, resp)) {
          var token = resp.data.result.sessionToken
          debug('token:' + token)
          document.cookie = "SessionToken=" + token

          this.$dispatch('loading', true)
          this.$http.get('self').then((res) => {
            this.$dispatch('loading', false)
            if (util.filterError(this, res)) {
              this.$dispatch('updateUser', res.data.result)
              this.$router.go('/mylist')
            }
          }, util.httpErrorFn(this))
        }
      }, util.httpErrorFn(this));
    },
    genCode() {
      return 'quzhibo-' + this.randomString(32)
    },
    randomString(length) {
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var result = ''
      for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
      return result
    },
    fetchUser() {

    },
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

</style>
