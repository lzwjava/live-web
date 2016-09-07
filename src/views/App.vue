<template>
  <div id="wrapper">
    <my-nav></my-nav>

    <!-- main view -->
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>

    <my-footer></my-footer>
  </div>
</template>

<script type="text/javascript">

import Nav from './nav.vue'
import MyFooter from './footer.vue'

export default {
  name: 'App',
  components: {
    'my-nav': Nav,
    'my-footer': MyFooter
  },
  data() {
    return {
    }
  },
  events: {
    'show-msg': function (type, message) {
      this.$broadcast('show-tip-msg', type, message)
    },
    'updateUser': function (user) {
      this.$broadcast('updateNavUser', user)
    },
  }
}

</script>

<style lang="stylus">

@import "../stylus/variables.styl"
@import "../stylus/base.styl"

#wrapper
  width 100%
  min-height 800px

.view
  width 100%
  transition opacity .2s ease
  box-sizing border-box
  padding 8px 20px
  &.v-enter, &.v-leave
    opacity 0

@media screen and (max-width: 700px)
  html, body
    margin 0
  #wrapper
    width 100%

</style>
