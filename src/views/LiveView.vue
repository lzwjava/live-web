<template>

    <div class="live-view">

        <div class="left-panel">

          <div class="subject-area">
            <p class="subject">
              {{live.subject}}
            </p>

            <p class="tips">
              暂只支持 Chrome，同时需要加载一段时间，请等待
            </p>

          </div>

          <div class="player-area">
            <div class="video-wait" v-show="live.status < 20">
              <p class="big-title">离直播开始还有{{timeDuration}}</p>
              <p class="small-title">感谢参与，开播时您将收到一条短信通知~</p>
            </div>
            <div class="video-on" v-show="live.status == 20 || live.status == 30">
              <video id="my_video_1" class="video-js vjs-default-skin"
                controls preload="auto" width="700" height="500"></video>

              <div class="video-poster-cover" v-show="playStatus != 2">
                <img :src="live.coverUrl" width="100%" height="100%"/>
                <div class="video-center">
                  <img class="loading-img" v-show="playStatus == 1" src="../img/video-circle.png">
                  <div class="canplay" v-show="playStatus == 0" @click="playVideo"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="playlist-area" v-if="videos.length > 1">
            <p>
              播放列表
            </p>
            <cells type="split">
              <select-cell :options="videoOptions" :selected.sync="videoSelected"></select-cell>
            </cells>
          </div>

        </div>

        <div class="right-panel">
          <div class="chat-area">
            <ul class="msg-list" v-el:msg-list>

              <li class="msg" v-for="msg in msgs">

                <div class="system-msg" v-if="msg.type == 2 && live.status != 30">
                  <div class="content">{{msg.text}}</div>
                </div>

                <div class="bubble-msg" v-if="msg.type !=2 ">
                  <span class="name">{{msg.attributes.username}}</span>

                  <div class="content">
                    <div class="bubble">
                      <div class="text-content bubble-cont" v-if="msg.type == -1">
                        <div class="plain">
                          <pre class="text">{{msg.text}}</pre>
                        </div>
                      </div>
                      <div class="text-content bubble-cont" v-if="msg.type == 3">
                        <div class="plain">
                          <pre class="text reward-text">{{msg.text}}</pre>
                        </div>
                      </div>
                      <div class="audio-content bubble-cont" v-if="msg.type == 1">
                        <div class="voice" @click="playVoice(msg.attributes.serverId)">
                          <i class="voice-gray"> </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </li>

            </ul>

            <div class="send-area">

              <div class="input-ways">

                <div class="text-input" v-show="inputMode == 0">
                  <input type="text" v-model="inputMsg" @keydown.enter="sendMsg"> <button type="button" class="btn btn-gray"
                  @click="sendMsg">发送</button>
                </div>
              </div>

            </div>
          </div>
        </div>

    </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import util from '../common/util'
import Loading from '../components/loading.vue'
import {Toast, SelectCell, Cells} from 'vue-weui'

require('font-awesome/css/font-awesome.css')

var flvjs = require('../../node_modules/flv.js/dist/flv.min.js')

var debug = require('debug')('LiveView')

var lcChat = require('leancloud-realtime')
var Realtime = lcChat.Realtime;
var TextMessage = lcChat.TextMessage
var messageType = lcChat.messageType
var TypedMessage = lcChat.TypedMessage

var inherit = require('inherit');
export const WxAudioMessage = inherit(TypedMessage)

var WxAudioType = 1
messageType(WxAudioType)(WxAudioMessage)

export const SystemMessage = inherit(TypedMessage)
var SystemMessageType = 2
messageType(SystemMessageType)(SystemMessage)

export const RewardMessage = inherit(TypedMessage)
var RewardMessageType = 3
messageType(RewardMessageType)(RewardMessage)

var prodAppId = 's83aTX5nigX1KYu9fjaBTxIa-gzGzoHsz'
var testAppId = 'YY3S7uNlnXUgX48BHTJlJx4i-gzGzoHsz'

var realtime = new Realtime({
  appId: prodAppId,
  region: 'cn',
  noBinary: true
})

debug('realtime')
debug(realtime)

realtime.register(WxAudioMessage)
realtime.register(SystemMessage)
realtime.register(RewardMessage)

export default {
  components: {
    'loading': Loading,
    SelectCell,
    Cells
  },
  data() {
    return {
      liveId: 0,
      live: {},
      curUser: {},
      inputMode: 0,
      msgs:[],
      client: {},
      conv: {},
      inputMsg: '',
      messageIterator: null,
      videoSelected: 0,
      videos: [],
      endIntervalId: 0,
      liveViewId: 0,
      flvPlayer: null,
      playStatus: 0,
      isSending: false
    }
  },
  route: {
    data({to}) {
      var params = to.params
      var liveId = params.liveId

      if (liveId == this.liveId) {
        return
      }

      this.liveId = liveId

      this.curUser = util.curUser()
      this.conv = {}
      this.msgs = []
      this.client = {}
      this.playStatus = 0

      util.loading(this)
      Promise.all([
        api.fetchLive(this, this.liveId),
        api.fetchVideos(this, this.liveId)
      ]).then(values => {
        util.loaded(this)
        this.live = values[0]
        this.videos = values[1]
        if (!this.live.canJoin) {
          util.show(this, 'error', '请先报名参与直播')
          return
        }

        if (this.live.status == 20) {
          this.addSystemMsg('连接了直播服务器' + this.liveHost)
        }

        this.openClient()
        this.playVideo()

        this.startLiveView(this.live)

        this.endInterval()

        this.endIntervalId = setInterval(() => {
          this.endLiveView()
        }, 1000 * 30)

      }).catch(util.promiseErrorFn)
    }
  },
  created() {
  },
  ready() {
  },
  detached() {
    debug('detached')
    this.endLiveView()
    this.endInterval()
    this.destoryPlayer()
  },
  computed: {
    timeDuration () {
      return util.timeDuration(this.live.planTs)
    },
    videoOptions() {
      var options = [];
      for(var i = 0; i < this.videos.length; i++) {
        var video = this.videos[i]
        options.push({text: video.title, value: i})
      }
      return options
    },
    optionHeight() {
      if (this.videos.length > 1) {
        return 50
      } else {
        return 0
      }
    },
    liveHost() {
      if (!this.live.flvUrl) {
        return ''
      }
      var regex = /http:\/\/(.*).quzhiboapp.com.*/g
      var match = regex.exec(this.live.flvUrl)
      return match[1]
    }
  },
  watch: {
    videoSelected: function(val, oldVal) {
      // this.changeSource(this.videos[this.videoSelected].url)
      this.playVideo()
    }
  },
  methods: {
    playVideo () {
      debug('playVideo')
      if (this.live.status < 20) {
        return
      }

      if (!flvjs.isSupported() || util.isSafari()) {
        util.show(this, 'error', '当前浏览器不支持观看直播，请使用 Chrome');
        return
      }

      this.destoryPlayer()

      var videoElement = document.getElementById('my_video_1')
      var params
      if (this.live.status == 20) {
        params = {type: 'flv', url: this.live.flvUrl, cors: true}
      } else if (this.live.status == 30) {
        params = {type: 'mp4', url: this.videos[this.videoSelected].url}
      }
      var flvPlayer = flvjs.createPlayer(params)

      debug('LoggingControl')
      flvjs.LoggingControl.enableAll = true

      flvPlayer.on('error', (error) => {
        debug('error event')
        util.show(this, 'error', error)
      })

      flvPlayer.on('loading_complete', () => {
        debug('loading_complete')
      })

      flvPlayer.on('media_info', (info) => {
        debug('media_info: %j', info)
      })

      flvPlayer.on('io_error', () => {
        debug('io_error')
      })

      flvPlayer.on('statistics_info', (info) => {
        debug('statistics_info: %j', info)
      })

      flvPlayer.on('recovered_early_eof', () => {
        debug('recovered_early_eof')
      })

      flvPlayer.attachMediaElement(videoElement)
      flvPlayer.load()
      flvPlayer.play()
      this.flvPlayer = flvPlayer
      debug('initPlayer')
      debug(this.flvPlayer)

      this.playStatus = 1
      setTimeout(() => {
        this.playStatus = 2
      }, 1000)
    },
    canPlayClick() {
      this.playVideo()
    },
    handleError (error) {
      if (typeof error != 'string') {
        error = JSON.stringify(error)
      }
      util.show(this, 'error', error)
    },
    addMsg(msg) {
      var msgList = this.$els.msgList
      var isTouchBottom = msgList.scrollHeight < msgList.scrollTop + msgList.offsetHeight + 5
      this.msgs.push(msg)
      setTimeout(() => {
        if (isTouchBottom) {
          this.scrollToBottom()
        }
      },0)
    },
    scrollToBottom() {
      var msgList = this.$els.msgList
      msgList.scrollTop = msgList.scrollHeight
    },
    addAudioMsg(msg) {
      this.addMsg(msg)
    },
    addChatMsg(msg) {
      this.addMsg(msg)
    },
    addSystemMsg(msg) {
      var textMsg = new TextMessage(msg)
      textMsg.setAttributes({username:'系统'})
      this.addMsg(textMsg)
    },
    sendMsg() {
      if(!this.inputMsg) {
        this.handleError('请输入点什么~')
        return
      }
      var textMsg = new TextMessage(this.inputMsg)
      textMsg.setAttributes({username:this.curUser.username})
      this.commonSendMsg(textMsg)
       .then((msg) => {
         this.inputMsg = ''
       })
    },
    commonSendMsg(msg) {
      if (this.isSending) {
        util.show(this, 'error', '请等待上一条消息发送完成');
        return
      }
      this.isSending = true
      return this.conv.send(msg)
       .then((message) => {
          this.isSending = false
          this.addChatMsg(message)
          return Promise.resolve(message)
        }, (error) => {
          this.isSending = false
          this.handleError(error)
        })
    },
    sendSystemMsg(text) {
      var systemMsg = new SystemMessage()
      systemMsg.setText(text)
      systemMsg.setAttributes({username:this.curUser.username})
      this.commonSendMsg(systemMsg)
    },
    playVoice(serverId) {
      // wx.downloadVoice({
      //   serverId: serverId,
      //   success: function (res) {
      //     wx.playVoice({
      //       localId: res.localId
      //     })
      //   },
      //   fail: this.handleError
      // });
    },
    toggleMode() {
      this.inputMode = !this.inputMode
    },
    registerEvent() {
      this.client.on('message', (message, conversation) => {
        if (message.type == TextMessage.TYPE) {
          this.addChatMsg(message)
        } else if (message.type == WxAudioType) {
          this.addAudioMsg(message)
        } else if (message.type == SystemMessageType){
          this.addChatMsg(message)
        } else if (message.type == RewardMessageType) {
          this.addChatMsg(message)
        } else {
          this.addSystemMsg('此消息暂不支持显示')
        }
      })
      this.client.on('reuse', () => {
        this.addSystemMsg('服务器正在重连...')
      })
      this.client.on('error', (error) => {
        this.addSystemMsg('遇到错误 ' + error)
      })
    },
    openClient() {
      realtime.createIMClient(this.curUser.userId + '')
      .then((client) => {
        this.client = client
        this.addSystemMsg('聊天服务器连接成功')
        this.registerEvent()
        this.fetchConv()
      }).catch((error) => {
        this.addSystemMsg('服务器连接失败 error:' + error);
      })
    },
    fetchConv() {
      debug('convid:' + this.live.conversationId)
      this.client.getConversation(this.live.conversationId)
      .then((conv) => {
        if (conv == null) {
          this.handleError('获取对话失败');
          return
        }
        this.conv = conv
        this.addSystemMsg('正在加载聊天记录...')
        var messageIterator = this.conv.createMessagesIterator({ limit: 200 })
        this.messageIterator = messageIterator
        return messageIterator.next()
      }).then((result)=> {
        this.msgs = this.msgs.concat(result.value)
        return this.conv.join()
      }).then((conv) => {
        if (!util.isDebug()) {
          var needSendIntoRoom = true;
          if (this.msgs.length > 0) {
            var lastMsg = this.msgs[this.msgs.length - 1]
            if (lastMsg.type == SystemMessageType &&
              lastMsg.from == this.client.id) {
                needSendIntoRoom = false
            }
          }
          if (this.live.status == 30) {
            needSendIntoRoom = false
          }
          if (needSendIntoRoom) {
            this.sendSystemMsg(this.curUser.username + '进入了房间')
          }
        }

        conv.count().then((membersCount) => {
          console.log('count:' + membersCount);
        })

        this.scrollToBottom()

        this.initScroll()
      }).catch(this.handleError)
    },
    initScroll() {
      setTimeout(() => {
        var msgList = this.$els.msgList
        msgList.addEventListener('scroll', (e) => {
          var list = e.srcElement
          if (list.scrollTop == 0) {
            util.loading(this)
            this.messageIterator.next().then((result) => {
              util.loaded(this)
              if (result.done) {
                util.show(this, 'warn', '没有更多消息了')
              }
              var originHeight = msgList.scrollHeight
              this.msgs = result.value.concat(this.msgs)
              setTimeout(() => {
                var afterHeight = msgList.scrollHeight
                msgList.scrollTop = afterHeight-originHeight
              }, 0)
            }, (error) => {
              util.loaded(this)
              util.show(this, 'error', error)
            })
          }
        })
      }, 0)
    },
    startLiveView(live) {
      api.post(this, 'liveViews', {
        liveId: live.liveId,
        platform: 'pc',
        liveStatus: live.status
      }).then((data) => {
        this.liveViewId = data.liveViewId
      }, util.promiseErrorFn(this))
    },
    endLiveView() {
      if (this.liveViewId != 0) {
        api.get(this, 'liveViews/' + this.liveViewId + '/end')
        .then((resp) => {
        }, (error) => {
          debug('end error:%j', error);
        })
      } else {
        debug('liveViewId == 0, do not end')
      }
    },
    endInterval() {
      if (this.endIntervalId != 0) {
        clearInterval(this.endIntervalId)
        this.endIntervalId =0
      }
    },
    destoryPlayer() {
      if (this.flvPlayer != null) {
        debug('destroy')
        this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    }
  }
}

</script>

<style lang="stylus">

@import '../../node_modules/rupture/rupture/index.styl'

.full-space
    position absolute
    top 0
    left 0
    bottom 0
    right 0

.live-view
  min-height 700px
  text-align center
  .left-panel
    width 60%
    margin-left 10%
    float left
    .playlist-area
      margin-top 20px
      font-size 16px
    .player-area
      width 100%
      min-height 500px
      margin-left auto
      margin-right auto
      margin-top 15px
      position relative
      background-color #383838
      p.big-title
        margin-top 100px
        text-align center
        color #fff
        font-size 18px
      p.small-title
        text-align center
        color #bebebe
        font-size 14px
      .video-wait
      .video-end
        padding-top 100px
      .video-on
        .video-poster-cover
          @extend .full-space
          text-align center
          background rgba(0, 0, 0, 0.5)
          .video-center
            position absolute
            width 70px
            height 70px
            left 50%
            top 50%
            margin-left -35px
            margin-top -35px
            .loading-img
              width 100%
              height 100%
              animation circle 1s cubic-bezier(0, 0, 0.76, 0.77) infinite
            .canplay
              width 100%
              height 100%
              background url("../img/video-play.png") center no-repeat
              background-size 100% 100%
  .subject-area
    .subject
      font-size 20px
    .tips
      margin-top 5px
      font-size 16px
      color #707070
  #my_video_1
    margin 0 auto
  .live-no-ready
    .tip
      font-size 20px
  .right-panel
    width 320px
    margin-left 72%
    position relative
    .chat-area
      padding 5px
      width 100%
      height 500px
      margin-top 70px
      position relative
      background-color #eee
      tex-align left
      .msg-list
        overflow hidden
        overflow-y scroll
        height 450px
        width 100%
        .msg
          .system-msg
            margin-bottom 3px
            text-align center
            .content
              border-radius 3px
              background-color #dcdcdc
              font-size 12px
              padding 1px 8px
              color #fff
              display inline-block
          .bubble-msg
            margin-bottom 5px
            .name
              color #868686
              float left
            .content
              overflow hidden
              text-align left
              .bubble
                max-width 85%
                min-height 14px
                margin 0 10px
                border-radius 3px
                vertical-align top
                background-color #fff
                display inline-block
                position relative
                &:before
                &:after
                  border 5px solid transparent
                  content " "
                  position absolute
                  top 8px
                  right 100%
                &:after
                  border-right-color #fff
                  border-right-width 5px
                .bubble-cont
                  word-wrap break-word
                  word-break break-all
                  min-height 25px
                .audio-content
                  .voice
                    width 40px
                    padding 0px 0px
                    .voice-gray
                      background url("../img/sprite.png") 0 -2427px
                      width 23px
                      height 23px
                      display inline-block
                      vertical-align middle
                      background-size 150px 2489px
                .text-content
                  .plain
                    padding 3px 5px
                    font-size 14px
                    pre
                      margin 0
                      word-wrap break-word
                      word-break normal
                      white-space pre-wrap
                    .reward-text
                      color #d65239
      .send-area
        box-sizing border-box
        padding-top 3px
        padding-bottom 3px
        .input-ways
          font-size 16px
          .btn-gray
            border 1px solid rgb(203, 204, 208)
            background-color rgb(242,242,245)
            &:active
              background-color rgb(186, 187, 190)
          .text-input
            width 100%
            height 34px
            line-height 34px
            input
              width 60%
              height 30px
              padding-left 10px
              padding-right 10px
              font-size 16px
              vertical-align middle
              border-radius 5px
            button
              width 60px
              vertical-align middle
              padding 7px 5px

@keyframes circle
  0%
    transform rotateZ(0deg)
  100%
    transform rotateZ(360deg)


</style>
