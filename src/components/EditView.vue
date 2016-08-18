<template>
  <div class="edit-view">

    <div class="left-container">
      <user-avatar :user="user"></user-avatar>
    </div>

    <div class="write-container">
      <form>
        <div>
          <span>请上传封面</span>
          <button type="button" name="button">本地上传</button>
        </div>

        <div class="">
          <span>请设定直播门票</span>
          <input type="button" name="name" value="">
        </div>

        <div class="">
          <span>请输入直播标题</span>
          <input v-model="title">
        </div>

        <div>
          <span>请设定直播时间</span>
        </div>

        <div class="">
          <span>请输入直播详细介绍(个人简介、直播内容等)</span>
          <div class="edit-area">
              <markdown-area class="form-field form-content yue" :content.sync="content" placeholder="请输入直播详情" @submit="submitReview" required></markdown-area>
              <p class="tip">支持 Markdown</p>
          </div>
        </div>

        <div class="">
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

var debug = require('debug')('EditView');

export default {
  components: {
    'markdown-area': MarkdownArea,
    'user-avatar': UserAvatar
  },
  data() {
    return {
      content: '',
      title: '',
      user: {}
    }
  },
  created() {
    debug('EditView created');
  },
  methods: {
    submitReview() {
      
    }
  }
}

</script>

<style lang="stylus">

.left-container
  width 20%

.write-container
  margin-left 20%
  max-width 600px
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
