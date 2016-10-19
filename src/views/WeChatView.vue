<template>

  <div class="wechat-view">

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import http from 'api'

var debug = debugFn('WeChatView')

export default {
  name: 'WeChatView',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
  },
  route: {
    data({to}) {
      var params = this.$route.params
      var query = this.$route.query
      if (!query.code || !query.state) {
        util.show(this, 'error', '缺少参数')
        return
      }
      var code = query.code
      var state = query.state
      if (params.type == 'silentOauth') {
        util.loading(this)
        http.get(this, 'wechat/silentOauth', {code: code})
         .then((data) => {
           util.loaded(this)
           this.$router.go('/mylist')
         }, errorFn)
       } else if (params.type == 'silentOauthTest') {
         var url = window.location.href
         var newUrl = url.replace('quzhiboapp.com', 'localhost:9060')
         newUrl = newUrl.replace('silentOauthTest', 'silentOauth')
         window.location = newUrl
       }
    }
  }
}

</script>

<style media="screen" lang="stylus">

</style>
