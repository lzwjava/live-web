<template>

  <div class="home-view">
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
    }
  },

  created () {
    this.code = this.genCode()
    this.poll()
  },

  destroyed () {
  },
  methods: {
    poll () {
      this.$http.get('qrcodes/scanned', {
        'code': this.code
      }).then((res) => {
        if (util.filterError(this, res)) {
          if (res.data.result.scanned) {
            // scanned
            window.location.href = '#/edit'
          } else {
            // not scanned
            this.poll()
          }
        }
      })
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
    }
  },

  filters: {

  }
}
</script>

<style lang="stylus">

@import "../stylus/base.styl"

.home-view
  min-height 500px
  img
    width 250px

</style>
