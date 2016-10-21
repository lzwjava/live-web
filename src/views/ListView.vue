<template>
  <div class="list-view">

    <loading>
      <button class="btn btn-blue" @click="createLive"> 创建直播</button>

      <h3>我发起的直播列表</h3>

      <ul class="live-list">
        <li class="live" v-for="live in lives">
          {{live.subject}}
          <button class="btn btn-blue subject" @click="edit(live.liveId)">编辑</button>
          <button class="btn btn-blue subject" @click="manage(live.liveId)">控制</button>
        </li>
      </ul>
    </loading>


  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import Loading from '../components/loading.vue'

export default {
  name: 'ListView',
  components: {
    'loading': Loading
  },
  data() {
    return {
      lives: [],
    }
  },
  route:{
    data({to}) {
      util.loading(this)
      this.$http.get('lives/me')
      .then((res) => {
        util.loaded(this)
        if (util.filterError(this, res)) {
          this.lives = res.data.result
        }
      }, util.httpErrorFn(this))
    }
  },
  created() {
  },
  methods:{
    edit(liveId) {
      this.$router.go('/edit/' + liveId)
    },
    manage(liveId) {
      this.$router.go('/manage/' + liveId)
    },
    createLive() {
      util.loading(this)
      this.$http.post('lives')
      .then((res) => {
        util.loaded(this)
        if (util.filterError(this, res)) {
          var live = res.data.result
          this.$router.go('/edit/' + live.liveId)
        }
      }, util.httpErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

.list-view
  min-height 500px
  text-align center
  .live-list
    .live
      text-align center
      .subject
        font-size 18px
        margin-right 20px

</style>
