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
  </div>
</template>

<script type="text/javascript">

import Nav from '../components/nav.vue'

export default {
  components: {
    'my-nav': Nav
  },
  data() {
    return {
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/variables.styl"
@import "../stylus/base.styl"

#wrapper
  position relative
  width 100%
  min-height 80px

.view
  position absolute
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
