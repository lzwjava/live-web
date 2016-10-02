<template>
  <div class="manage-view">

    <p class="status">当前直播状态:{{statusText}}</p>

    <p>
      记得要在 OBS 中录制视频
    </p>

    <p>
      请在 OBS 软件设置直播地址: {{live.pushUrl}}
    </p>

    <p>
      微信分享地址:{{shareLink}}
    </p>

    <div class="control-btn">

      <button class="btn btn-blue" @click="beginLive">开始直播</button>

      <button class="btn btn-blue" @click="notifyLive">群发开播短信</button>

      <button class="btn btn-blue" @click="endLive">结束直播</button>

    </div>

    <img :src="'api/qrcodes/one?text=' + shareLink" alt="" />

  </div>
</template>

<script type="text/javascript">

import util from '../common/util'

export default {
  name: 'ManageView',
  data () {
    return {
      liveId: 0,
      live: {}
    }
  },
  computed: {
    statusText () {
      return util.statusText(this.live.status)
    },
    shareLink() {
      return 'http://m.quzhiboapp.com/?liveId=' + this.live.liveId
    }
  },
  route: {
    data({to}) {
      var params = this.$route.params
      this.liveId = params.liveId
      this.fetchLive()
    }
  },
  created() {
  },
  methods: {
    fetchLive() {
      this.$http.get('lives/' + this.liveId)
        .then((res) => {
          if (util.filterError(this, res)) {
            this.live = res.data.result
          }
        },util.httpErrorFn(this))
    },
    beginLive() {
      this.$http.get('lives/' + this.liveId +'/begin')
        .then((res) => {
          if (util.filterError(this, res)) {
            util.show(this, 'success', '成功开启直播')
            this.fetchLive()
          }
        },util.httpErrorFn(this))
    },
    endLive() {
      this.$http.get('lives/' + this.liveId +'/end')
        .then((res) => {
          if (util.filterError(this, res)) {
            util.show(this, 'success', '成功结束直播')
            this.fetchLive()
          }
        },util.httpErrorFn(this))
    },
    notifyLive() {
      if (confirm('真的要群发通知短信吗?')) {
        this.$http.get('lives/' + this.liveId +'/notify')
          .then((res) => {
            if (util.filterError(this, res)) {
              var result = res.data.result
              util.show(this, 'success', '发送短信结果: ' + result.succeedCount + '/' +result.total)
            }
          },util.httpErrorFn(this))
      }
    }
  }
}

</script>

<style lang="stylus">

.manage-view
  min-height 500px
  text-align center
  p.status
    font-size 24px
  button
    margin-left 50px
    margin-right 50px
  .control-btn
    margin-top 50px

</style>
