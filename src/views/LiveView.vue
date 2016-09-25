<template>

    <div class="live-view">

      <div class="subject-area">
        <p class="subject">
          {{live.subject}}
          <button class="btn btn-no-play" @click="reload">暂只支持 Chrome、Firebox。若无法播放，点击我</button>
        </p>
      </div>

      <div class="player-area">
        <div class="video-wait" v-show="live.status == 10">
          <p class="big-title">离直播开始还有 {{timeGap}}</p>
          <p class="small-title">感谢参与，开播时您将收到一条短信通知~</p>
        </div>
        <div class="video-on" v-show="live.status == 20 || live.status == 30">
          <video id="my_video_1" class="video-js vjs-default-skin" controls preload="auto" width="800" height="600">

          <div class="video-poster-cover" v-show="playStatus != 2">
            <img :src="live.coverUrl" width="100%" height="100%"/>
            <div class="video-center">
              <img class="loading-img" v-show="playStatus == 1" src="../img/video-circle.png">
              <div class="canplay" v-show="playStatus == 0"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

</template>

<script type="text/javascript">

import api from 'api'
import util from '../common/util'
var videojs = require('../../node_modules/video.js/dist/video.min.js')
require('../../node_modules/video.js/dist/video-js.min.css')
require('font-awesome/css/font-awesome.css')

var debug = require('debug')('LiveView')

export default {
  data() {
    return {
      liveId: 0,
      live: {}
    }
  },
  route: {
    data({to}) {
      var params = to.params
      this.liveId = params.liveId
      debug('liveId:' + this.liveId)
      this.$dispatch('loading', true)
      api.fetchLive(this, this.liveId)
        .then((data) => {
          this.$dispatch('loading', false)
          this.live = data
          if (!this.live.canJoin) {
            util.show(this, 'error', '请先报名参与直播')
            return
          }
          // var player = videojs('my_video_1')
          // debug('before inited')
          // debug(player)
            // debug('hasInitVideo')
            // this.changeSource({
            //   type: 'video/flv',
            //   src: this.live.flvUrl
            // })
            debug('no init video')
          this.playVideo()
        }).catch(util.promiseErrorFn)
    }
  },
  created() {
  },
  ready() {
  },
  computed: {
  },
  methods: {
    playVideo () {
      debug('flvUrl' + this.live.flvUrl)
      debug('videojs')
      debug(videojs)
      player = videojs('my_video_1', {
    		techOrder: ['flash', 'html5'],
    		autoplay: true,
    		sources: [{
    			type: "video/x-flv",
    			src: this.live.flvUrl
    		}]
    	});
      debug(player)
      // player.ready(function() {
      //   // player.load();
		  //   // player.play();
      // })
    },
    changeSource(src) {
      var player = videojs('my_video_1')
    	player.pause();
    	player.currentTime(0);

    	player.src(src);

    	player.ready(function() {
    		player.one('loadeddata', videojs.bind(player, function() {
    			this.currentTime(0);
    		}));
    		player.load();
    		player.play();
    	});
    },
    reload() {
      location.reload()
    }
  }
}

</script>

<style lang="stylus">

.full-space
    position absolute
    top 0
    left 0
    bottom 0
    right 0

.live-view
  min-height 700px
  text-align center
  .subject-area
    .subject
      font-size 20px
  .player-area
    width 800px
    height 600px
    margin 0 auto
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
  #my_video_1
    margin 0 auto
  .live-no-ready
    .tip
      font-size 20px
  .btn-no-play
    background-color #D8D8D8
    font-size 15px
    padding 5px 10px


</style>
