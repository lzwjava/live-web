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

    <table class="control-table">

      <tbody>
        <tr>
          <td>操作</td>
          <td>说明</td>
        </tr>

        <tr>
          <td><button class="btn btn-blue" @click="beginLive">开始直播</button></td>
          <td class="tips">点击之后，观众可看到画面。确认已开始推流之后点击</td>
        </tr>

        <!-- <tr>
          <td><button class="btn btn-blue" @click="waitLive">测试结束设置成报名状态</button></td>
          <td class="tips">测试直播结束后，可点击来设回报名中</td>
        </tr> -->

        <tr>
          <td><button class="btn btn-blue" @click="notifyLive(1)">群发一小时开播通知</button></td>
          <td class="tips">因为大家可能并不一直看着微信，提前通知一下比较好</td>
        </tr>

        <tr>
          <td><button class="btn btn-blue" @click="notifyLive(0)">群发微信开播通知</button></td>
          <td class="tips">通过微信服务号发送给所有观众通知，确认画面良好、快要正式开始之后点击</td>
        </tr>

        <tr>
          <td><button class="btn btn-blue subject" @click="see(live.liveId)">进入直播间</button></td>
          <td class="tips">进入自己的直播间，用来和观众互动或检测直播正常</td>
        </tr>

        <tr>
          <td><button class="btn btn-blue" @click="finishLive">结束直播</button></td>
          <td class="tips">当结束推流之后，点击结束直播，观众可看到回放</td>
        </tr>

      </tbody>
    </table>

    <!-- <div class="control-btn">



      <button class="btn btn-blue" @click="setLiveReview">设置回审核状态</button>

      <button class="btn btn-blue" @click="notifyLive(1)">群发一小时前通知</button>


    </div>

    <div class="control-btn">

      <button class="btn btn-blue" @click="convertLive">开始转码</button>

      <button class="btn btn-blue" @click="replayLive">开始重播</button>

    </div> -->


    <p class="wechat-share">
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
import api from '../common/api'
import debugFn from 'debug'

const debug = debugFn('ManageView')

export default {
  name: 'ManageView',
  data () {
    return {
      liveId: 0,
      live: {},
      curUser: {}
    }
  },
  computed: {
    statusText () {
      return util.statusText(this.live.status)
    },
    shareLink() {
      return 'http://m.quzhiboapp.com/?liveId=' + this.live.liveId + '&fromUserId=' + this.curUser.userId
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
      this.curUser = util.curUser()
      this.fetchLive()
    }
  },
  created() {
  },
  methods: {
    urlPrefix(rtmpUrl) {
      if (!rtmpUrl) {
        return ''
      }
      var regex = /(rtmp:\/\/.*)\/(.*)/g
      var match = regex.exec(rtmpUrl)
      return match[1]
    },
    fetchLive() {
      api.get(this, 'lives/' + this.liveId)
      .then((data) => {
        this.live = data
      }, util.promiseErrorFn(this))
    },
    beginLive() {
      api.get(this, 'lives/' + this.liveId +'/begin')
       .then((data) => {
         util.show(this, 'success', '成功开启直播')
         this.fetchLive()
       }, util.promiseErrorFn(this))
    },
    waitLive() {
      api.get(this, 'lives/' + this.liveId +'/wait')
      .then((data) => {
        util.show(this, 'success', '成功设置回报名状态')
        this.fetchLive()
      }, util.promiseErrorFn(this))
    },
    endLive() {
      api.get(this, 'lives/' + this.liveId +'/end')
      .then((data) => {
        util.show(this, 'success', '已设定为转码')
        this.fetchLive()
      }, util.promiseErrorFn(this))
    },
    finishLive() {
      api.get(this, 'lives/' + this.liveId +'/finish')
      .then((data) => {
        util.show(this, 'success', '成功结束直播')
        this.fetchLive()
      }, util.promiseErrorFn(this))
    },
    setLiveReview() {
      api.get(this, 'lives/' + this.liveId +'/setReview')
      .then((data) => {
        util.show(this, 'success', '成功设置回审核状态')
        this.fetchLive()
      }, util.promiseErrorFn(this))
    },
    convertLive() {
      api.get(this, 'recordedVideos/convert', {
        liveId: this.liveId
      }).then((data) => {
      }, util.promiseErrorFn(this))
      util.show(this, 'success', '已经发起转码');
    },
    replayLive() {
      api.get(this, 'recordedVideos/replay', {
        liveId: this.liveId
      }).then((data) => {
      }, util.promiseErrorFn(this))
      util.show(this, 'success', '已经发起重播');
    },
    notifyLive(oneHour) {
      if (confirm('真的要群发通知吗?')) {
        api.get(this, 'lives/' + this.liveId +'/notify', {
          'oneHour': oneHour
        }).then((data) => {
          var result = data
          util.show(this, 'success', '发送结果: ' + result.succeedCount + '/' +result.total)
        }, util.promiseErrorFn(this))
      }
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
    margin-left 30px
    margin-right 30px
  .control-btn
    margin-top 50px
  .obs-setting
    font-size 16px
  .control-table
    margin 20px auto
    font-size 16px
    border-top solid #000 1px
    border-left solid #000 1px
    tbody
      td
        border-bottom solid #000 1px
        border-right solid #000 1px
      td.tips
        font-size 14px
        max-width 300px

</style>
