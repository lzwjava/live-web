<template>

  <div class="">
    <img src="http://localhost:3005/qrcodes/gen?code=quzhibo-HRkulq9GrCfZWufgKZRwk7oy4bmD2LCv" alt="" />
  </div>

</template>

<script>

import store from '../store'

export default {

  name: 'HomeView',

  components: {
  },

  data () {
    return {
    }
  },

  route: {
    data ({ to }) {
      const page = +to.params.page
      document.title = 'Vue.js HN Clone'
    }
  },

  created () {
  },

  destroyed () {
  },

  methods: {
  },

  filters: {

  }
}
</script>

<style lang="stylus">

</style>
