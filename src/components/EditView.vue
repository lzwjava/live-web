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
              <markdown-area class="form-field form-content yue" :content.sync="content" placeholder="请输入直播详情" @submit="submitReview" required></markdown-area>
              <p class="tip">支持 Markdown</p>
          </div>
        </div>

        <div class="row">
          <button>保存</button>
          <button>发布</button>
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
    background-color #f5f5f5
    padding-left 10px
    padding-right 10px
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
    .edit-area
      textarea
          width 100%
          height 200px
          font-size 16px
          margin-top 5px
          border 1px solid rgba(40,47,49,0.3)
          font-size 16px
          opacity 0.8
          padding 10px
          max-width 597px
          &:focus
            border 1px solid #1CB2EF

</style>
