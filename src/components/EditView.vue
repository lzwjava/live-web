<template>
  <div class="edit-view">

    <div class="left-container">
      <user-avatar :user="user"></user-avatar>
    </div>

    <div class="write-container">
      <form>
        <div class="row">
          <span class="hint">请上传封面</span>
          <button class="upload-btn">本地上传</button>
        </div>

        <div class="row">
          <span class="hint">请设定直播门票</span>
          <input type="number" v-model="amount" class="input-amount"> <span class="suffix">¥<span>
        </div>

        <div class="row">
          <span class="hint">请输入直播标题</span>
          <input type="text" v-model="title" class="input-title">
        </div>

        <div class="row">
          <span class="hint">请设定直播时间</span>
          <div>
            <v-date-picker :date-result.sync="myDate"></v-date-picker>
          </div>
        </div>

        <div class="row">
          <span class="hint">请输入直播详细介绍(个人简介、直播内容等)</span>
          <div class="edit-area">
              <markdown-area class="form-field form-content" :content.sync="content" placeholder="" @submit="submitReview" required></markdown-area>
              <p class="tip">支持 Markdown</p>
          </div>
        </div>

        <div class="row row-action">
          <button class="btn btn-blue" @click="saveLive">保存</button>
          <button class="btn btn-blue" @click="publishLive">发布</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script type="text/javascript">

import MarkdownArea from "../components/markdown-area.vue"
import UserAvatar from "../components/user-avatar.vue"
import util from '../common/util'
import VDatePicker from '../components/date_picker.vue'

var debug = require('debug')('EditView');

export default {
  components: {
    'markdown-area': MarkdownArea,
    'user-avatar': UserAvatar,
    'v-date-picker': VDatePicker
  },
  data() {
    return {
      live: {},
      content: '',
      title: '',
      user: {},
      amount: 0,
      myDate: ''
    }
  },
  created() {
    debug('EditView created')
    this.fetchUser()
    this.fetchLive()
  },
  methods: {
    submitReview() {
    },
    fetchUser() {
      this.$http.get('self').then((res) => {
				if (util.filterError(this, res)) {
					debug(res.data.result)
				}
			}, util.httpErrorFn(this))
    },
    fetchLive() {
      this.$http.get('lives/lastPrepare').then((res) => {
        if (util.filterError(this, res)) {
          this.setLive(res.data.result)
        }
      }, util.httpErrorFn(this))
    },
    setLive(live) {
      this.live = live
      this.title = live.subject
      this.amount = live.amount
      this.content = live.detail
      this.myDate = live.planTs
    },
    saveLive() {
      var data = {};
      if (this.title) {
        data.subject = this.title
      }
      if (this.amount) {
        data.amount = this.amount * 100
      }
      if (this.myDate) {
        data.planTs = this.myDate
      }
      if (this.content) {
        data.detail = this.content
      }
      this.$http.post('lives/' + this.live.liveId, data).then((res) => {
        if (util.filterError(this, res)) {
          debug('save succeed')
        }
      }, util.httpErrorFn(this))
    },
    publishLive() {
      this.$http.get('lives/' + this.live.liveId).then((res) => {
        if (util.filterError(this, res)) {
          debug('publish succeed')
        }
      }, util.httpErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

.edit-view
  display flex
  flex-direction row
  justify-content center
  .left-container
    flex 1
    background-color #403a3a
  .write-container
    flex 3
    background-color #fff
    margin 0 30px
    padding 10px
    border 1px solid rgba(0,0,0,0.15)
    box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    -webkit-box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    .row
      margin 10px 0
      .hint
        color rgba(40,47,49,0.6)
        display block
        line-height 32px
      .suffix
        color rgba(40,47,49,0.6)
      .upload-btn
        background-color #9B9B9B
        border-radius 3px
        color #fff
      input
        line-height 30px
        border 1px solid rgba(40,47,49,0.3)
        border 1px inset
        text-indent 10px
        &:focus
          border 1px solid #1CB2EF
      .input-amount
        width 80px
      .input-title
        width 300px
    .row-action
        text-align center
        button
          width 150px
    .edit-area
      width 600px
      textarea
          width 100%
          height 200px
          font-size 16px
          margin-top 5px
          border 1px solid rgba(40,47,49,0.3)
          font-size 16px
          opacity 0.8
          padding 10px
          &:focus
            border 1px solid #1CB2EF
      p.tip
        color rgba(40,47,49,.6)
        font-size 13px
        margin 8px 0px

</style>
