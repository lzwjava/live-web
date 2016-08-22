<template>
  <nav class="navbar">
    <div class="container">

      <a href="/">
        <div class="left">
          <img class="navbar-brand" src="../img/header_logo.png">
          <div class="title">
            <span class="light">趣直播</span>
          </div>
        </div>
      </a>

      <div class="right">
        <ul class="list">
          <a href="."><li class="hover-btn">首页</li></a>
        </ul>
      </div>

    </div>
  </nav>

  <tip v-el:msg-tip><tip>
</template>

<script type="text/javascript">

import Tip from './tip.vue'
var debug = require('debug')('nav')

export default {
  components: {
    'tip': Tip
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created() {

  },
  ready() {
  },
  events: {
    'show-msg': function (type, message) {
      this.$broadcast('show-tip-msg', type, message)
    }
  }
}

</script>

<style lang="stylus">

.navbar
  height totalHeight = 50px
  padding paddingTop=5px 0
  background white
  border-bottom 1px solid rgba(0,0,0,0.15)
  box-shadow 0 2px 1px 0px rgba(135,135,135,.15)
  width 100%
  left 0
  right 0
  .container
    margin 0 auto
    line-height totalHeight - 2 * paddingTop
    width 80%
    height 100%
  .navbar-brand
    width 35px
    top 3px
    position relative
  .left
    float left
    .title
      font-size 20px
      margin-left 10px
      display inline-block
      .light
        top -2px
        position relative
  .right
    float right
  .list
    li
      padding-left 20px
      padding-right 20px
      text-align left
      cursor pointer
      font-size 14px
      top -2px
      position relative
      &.hover-btn
        border 1px solid #ffff // 避免hover之后颤抖
        font-weight 600
      &.hover-btn:hover
        color blue

</style>
