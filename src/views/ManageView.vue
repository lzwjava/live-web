<template>
  <div class="manage-view">

    <p class="status">当前直播状态:{{statusText}}</p>

    <p class="obs-setting">
      请在 OBS 软件设置:
      <br>
      1)直播地址(URL): {{pushPrefix}}
      <br>
      1.1)如果是在海外，则设为：{{foreignPrefix}}
      <br>
      <br>
      2)流密钥(Streaming Key): {{pushKey}}
    </p>

    <div class="control-btn">

      <button class="btn btn-blue" @click="beginLive">开始直播</button>


      <button class="btn btn-blue" @click="notifyLive">群发短信开播通知</button>

      <button class="btn btn-blue" @click="notifyLiveByWeChat">群发微信开播通知</button>

      <button class="btn btn-blue subject" @click="see(live.liveId)">观看直播</button>

      <button class="btn btn-blue" @click="endLive">转码直播</button>

      <button class="btn btn-blue" @click="finishLive">结束直播</button>

    </div>


    <p>
      微信分享地址:{{shareLink}}
    </p>

    <p>
      二维码:
    </p>

    <img :src="'api/qrcodes/one?text=' + shareLink" alt="" />

  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import debugFn from 'debug'

const debug = debugFn('ManageView')

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
    },
    pushPrefix() {
      return this.urlPrefix(this.live.pushUrl)
    },
    foreignPrefix() {
      return this.urlPrefix(this.live.foreignPushUrl)
    },
    pushKey() {
      if (!this.live.pushUrl) {
        return ''
      }
      var regex = /(rtmp:\/\/.*)\/(.*)/g
      var match = regex.exec(this.live.pushUrl)
      return match[2]
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
    urlPrefix(rtmpUrl) {
      debug('rtmpUrl:%j', rtmpUrl)
      if (!rtmpUrl) {
        return ''
      }
      var regex = /(rtmp:\/\/.*)\/(.*)/g
      var match = regex.exec(rtmpUrl)
      return match[1]
    },
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
            util.show(this, 'success', '已设定为转码')
            this.fetchLive()
          }
        },util.httpErrorFn(this))
    },
    finishLive() {
      this.$http.get('lives/' + this.liveId +'/finish')
        .then((res) => {
          if (util.filterError(this, res)) {
            util.show(this, 'success', '成功结束直播')
            this.fetchLive()
          }
        },util.httpErrorFn(this))
    },
    notifyLive() {
      if (confirm('真的要群发短信通知吗?')) {
        this.notifyLiveWithType('sms')
      }
    },
    notifyLiveByWeChat() {
      if (confirm('真的要群发微信通知吗?')) {
        this.notifyLiveWithType('wechat')
      }
    },
    notifyLiveWithType(type) {
      this.$http.get('lives/' + this.liveId +'/notify', {
        type: type
      }).then((res) => {
          if (util.filterError(this, res)) {
            var result = res.data.result
            util.show(this, 'success', '发送结果: ' + result.succeedCount + '/' +result.total)
          }
        },util.httpErrorFn(this))
    },
    see(liveId) {
      this.$router.go('/lives/' + liveId)
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
  .obs-setting
    font-size 16px

</style>
