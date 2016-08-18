<template>

  <div class="">
    <img src="http://localhost:3005/qrcodes/gen?code=quzhibo-HRkulq9GrCfZWufgKZRwk7oy4bmD2LCv" alt="" />
  </div>

</template>

<script>

import store from '../store'
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

  route: {
    data ({ to }) {
      const page = +to.params.page
      document.title = 'Vue.js HN Clone'
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
          if (res.data.scanned) {
            // scanned
          } else {
            // not scanned
            poll()
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

</style>
