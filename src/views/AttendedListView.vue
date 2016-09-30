<template>

  <div class="attended-list-view">
    <h3>我参与的直播列表</h3>

    <ul class="live-list">
      <li class="live" v-for="live in attendedLives">
        <button class="btn btn-blue subject" @click="watch(live.liveId)">{{live.subject}}</button>
      </li>
    </ul>
  </div>

</template>

<script type="text/javascript">

import util from '../common/util'

export default {
  name: 'AttendedListView',
  data () {
    return {
      attendedLives: []
    }
  },
  ready() {
  },
  route: {
    data({to}) {
      this.$http.get('lives/attended')
      .then((res) => {
        if (util.filterError(this, res)) {
          this.attendedLives = res.data.result
        }
      })
    }
  },
  components: {

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
