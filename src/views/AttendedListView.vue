<template>

  <div class="attended-list-view">

      <loading>

        <h3>我参与的直播列表</h3>

        <ul class="live-list">
          <li class="live" v-for="live in attendedLives">
            <button class="btn btn-blue subject" @click="watch(live.liveId)">{{live.subject}}</button>
          </li>
        </ul>

      </loading>

  </div>

</template>

<script type="text/javascript">

var debug = require('debug')('AttendedListView')

import util from '../common/util'
import Loading from '../components/loading.vue'

export default {
  name: 'AttendedListView',
  components: {
    'loading': Loading
  },
  data () {
    return {
      attendedLives: []
    }
  },
  created() {
  },
  ready() {
  },
  route: {
    data({to}) {
      util.loading(this)
      this.$http.get('lives/attended')
      .then((res) => {
        util.loaded(this)
        if (util.filterError(this, res)) {
          this.attendedLives = res.data.result
        }
      },util.httpErrorFn(this))
    }
  },
  methods: {
    watch(liveId) {
      this.$router.go('/lives/' + liveId)
    }
  }
}


</script>

<style lang="stylus">

.attended-list-view
  min-height 500px
  text-align center
  .live-list
    .live
      text-align center
      .subject
        font-size 18px

</style>
