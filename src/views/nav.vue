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

          <li v-if="userStatus">
            <dropdown>
              <div class="dropdown-anchor" slot="showText">
                <user-avatar :user="user" @click="viewUserDropdown"></user-avatar>
              </div>
              <div slot="options">
                <user-avatar :user="user"></user-avatar>
                <div class="name">{{user.username}}</div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#/mylist">我发起的直播</a>
                <a class="dropdown-item" href="#/attendedList">我参与的直播</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" @click="logout" href="/">注销</a>
              </div>
            </dropdown>
          </li>
        </ul>
      </div>

    </div>
  </nav>

  <tip v-el:msg-tip><tip>
</template>

<script type="text/javascript">

import Tip from '../components/tip.vue'
import DropDown from '../components/dropdown.vue'
import UserAvatar from '../components/user-avatar.vue'
import util from '../common/util'
import wechat from '../common/wechat'

var debug = require('debug')('nav')

export default {
  name: 'Nav',
  components: {
    'tip': Tip,
    'dropdown': DropDown,
    'user-avatar': UserAvatar
  },
  data () {
    return {
      userStatus: false,
      user: {}
    }
  },
  computed: {
  },
  methods: {
    viewUserDropdown (e) {
        e && e.preventDefault();
        this.showUserDropdown = true;
    },
    logout (e) {
      e && e.preventDefault();
      this.$http.get('logout').then((resp) => {
        this.user = {};
        this.userStatus = false;
        window.localStorage.removeItem('user');
        window.location = '/';
      }, util.httpErrorFn(this));
    },
    loadUser() {
      if(window.localStorage.getItem('user')){
        this.userStatus = true;
        this.user = JSON.parse(window.localStorage.getItem('user'));
      }
    },
    wechatLogin() {
      wechat.oauthLogin()
    }
  },
  created() {
    this.loadUser()
  },
  ready() {
  },
  events: {
    'updateNavUser': function (user) {
      if (user && user.username) {
        // 防止不合法的数据破坏了
        window.localStorage.setItem('user',JSON.stringify(user));
      } else {
        console.log('username is null in setting localStorage');
      }
      this.userStatus = true
      this.user = user
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
    top 6px
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
      display inline-block
      &.hover-btn
        border 1px solid #ffff // 避免hover之后颤抖
        font-weight 600
      &.hover-btn:hover
        color blue
        .dropdown-anchor
          position relative
      .dropdown-inner
        width 220px
        right 0
        &:before,&:after
          left 90%
  .avatar
    width totalHeight - 2 * paddingTop
    height totalHeight - 2 * paddingTop
    img
      border-radius 50%
      border 1px solid #8F9DA4

</style>
