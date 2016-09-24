<template>

    <div>

        <object type="application/x-shockwave-flash" :data="live.flvUrl"
                width="1000" height="562" id="swf_play" style="visibility: visible;">

            <param name="allowFullScreen" value="true">
            <param name="wMode" value="Opaque">
            <param name="allowScriptAccess" value="always">
            <param name="allowFullScreenInteractive" value="true">
            <param name="bgColor" value="#000">
        </object>

    </div>

</template>

<script type="text/javascript">

import api from 'api'
import util from '../common/util'

export default {
  data() {
    return {
      liveId: 0,
      live: {}
    }
  },
  created() {
    var params = this.$route.params
    this.liveId = params.liveId
    api.fetchLive(this, this.liveId)
      .then((data) => {
        this.live = data
      }).catch(util.promiseErrorFn)
  },
  computed: {
  },
  methods: {
  }
}

</script>

<style lang="stylus">

</style>
