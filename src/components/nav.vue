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
  <div id="message" aria-live="assertive">
    <div class="message message-{{msg.type}}" v-for="msg in messages" v-text="msg.text" transition="fade"></div>
  </div>
</template>

<script type="text/javascript">

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

#message
  position fixed
  top 0
  left 0
  width 100%
  text-align center
  z-index 99999

.message
  font-size 1rem
  line-height 1.8
  padding 10px 20px
  box-sizing border-box
  border-bottom 1px solid #efefef
  background-color rgba(255, 255, 255, 0.9)
  color #565656

.message-success
  background-color rgba(66, 185, 131, 0.9)
  border-color rgb(66, 185, 131)
  color white

.message-error
  background-color rgba(255, 68, 68, 0.9)
  border-color rgb(255, 68, 68)
  color white

.message-warn
  background-color rgba(255, 220, 0, 0.9)
  border-color rgb(255, 220, 0)

</style>
