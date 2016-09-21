<template>
  <div class="edit-view">

    <loading>
      <div class="write-container">
        <form>
          <div class="status">
            {{statusText}}
          </div>
          <div class="row" id="upload-container">
            <span class="hint">请上传封面(最佳尺寸 750x500)</span>
            <button class="upload-btn" id="pickfiles">本地上传</button>
            <div v-if="coverUrl">
              <img class="cover" :src="coverUrl"/>
            </div>
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
                <markdown-area class="form-field form-content" :content.sync="content" placeholder="" @submit="saveLive" required></markdown-area>
                <p class="tip">支持 Markdown</p>
            </div>
          </div>

          <div class="row row-action">
            <button class="btn btn-blue" @click="saveLive">保存</button>
            <button class="btn btn-blue" @click="publishLive">提交审核</button>
          </div>

        </form>
      </div>
    </loading>

  </div>
</template>

<script type="text/javascript">

import MarkdownArea from "../components/markdown-area.vue"
import UserAvatar from "../components/user-avatar.vue"
import util from '../common/util'
import VDatePicker from '../components/date_picker.vue'
import Loading from '../components/loading.vue'

require('moxie');
require('plupload'); // use for Qiniu js sdk
import Qiniu from 'qiniu-js-sdk'

var debug = require('debug')('EditView');

export default {
  name: 'EditView',
  components: {
    'markdown-area': MarkdownArea,
    'user-avatar': UserAvatar,
    'v-date-picker': VDatePicker,
    'loading': Loading
  },
  data() {
    return {
      live: {},
      content: '',
      title: '',
      user: {},
      amount: 0,
      myDate: '',
      coverUrl: ''
    }
  },
  computed: {
    statusText () {
      return util.statusText(this.live.status)
    }
  },
  created() {
    this.fetchUser()
    this.fetchLive()
  },
  ready() {
    this.initQiniu()
  },
  methods: {
    fetchUser() {
      this.$http.get('self').then((res) => {
        if (util.filterError(this, res)) {
          this.$dispatch('updateUser', res.data.result)
        }
      }, util.httpErrorFn(this))
    },
    fetchLive() {
      this.$broadcast('loading')
      this.$http.get('lives/lastPrepare').then((res) => {
        if (util.filterError(this, res)) {
          this.$broadcast('loaded')
          this.setLive(res.data.result)
        }
      }, util.httpErrorFn(this))
    },
    setLive(live) {
      this.live = live
      this.title = live.subject
      this.amount = live.amount / 100
      this.content = live.detail
      this.myDate = live.planTs
      this.coverUrl = live.coverUrl
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
      this.saveLiveData(data)
    },
    saveLiveData(data) {
      this.$http.post('lives/' + this.live.liveId, data).then((res) => {
        if (util.filterError(this, res)) {
          util.show(this, 'success', '保存成功')
        }
      }, util.httpErrorFn(this))
    },
    publishLive() {
      this.$http.get('lives/' + this.live.liveId + '/submitReview').then((res) => {
        if (util.filterError(this, res)) {
          util.show(this, 'success', '提交审核成功')
        }
      }, util.httpErrorFn(this))
    },
    updateCover(url) {
      this.coverUrl = url
      var data = {
        coverUrl: this.coverUrl
      }
      this.saveLiveData(data)
    },
    initQiniu() {
      var component = this;
      this.$http.get('files/uptoken').then((res) => {
        if (util.filterError(this, res)) {
          var result = res.data.result;
          var uptoken = result.uptoken;
          var bucketUrl = result.bucketUrl;
          var key =result.key;
          var uploader = Qiniu.uploader({
              runtimes: 'html5,flash,html4',    //上传模式,依次退化
              browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
              uptoken_url: 'useless',
              uptoken: uptoken,
              domain: bucketUrl,
              flash_swf_url: 'js/plupload/Moxie.swf',
              unique_names: false,
              save_key: false,
              get_new_uptoken: false,           //设置上传文件的时候是否每次都重新获取新的token
              container: 'upload-container',    //上传区域DOM ID，默认是browser_button的父元素，
              max_file_size: '100mb',           //最大文件体积限制
              max_retries: 3,                   //上传失败最大重试次数
              dragdrop: false,                  //开启可拖曳上传
              drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
              chunk_size: '4mb',                //分块上传时，每片的体积
              auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
              init: {
                  'FilesAdded': function(up, files) {
                  },
                  'BeforeUpload': function(up, file) {
                  },
                  'UploadProgress': function(up, file) {
                  },
                  'FileUploaded': function(up, file, info) {
                         // info:
                         // {
                         //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                         //    "key": "gogopher.jpg"
                         //  }
                         var res = JSON.parse(info);
                         var sourceLink = bucketUrl + '/' + res.key;
                         debug('sourceLink: %j', sourceLink);
                         component.updateCover(sourceLink)
                  },
                  'Error': function(up, err, errTip) {
                         debug('qiniu error %j errTip %j', err, errTip);
                         util.show(component, 'error', errTip)
                  },
                  'UploadComplete': function() {
                  },
                  'Key': function(up, file) {
                      // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                      // 该配置必须要在 unique_names: false , save_key: false 时才生效
                      return result.key;
                  }
              }
          });
        }
      }, util.httpErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

.edit-view
  justify-content center
  .write-container
    width 50%
    margin-left 25%
    background-color #fff
    margin-top 0
    margin-bottom 0
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
      width 95%
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
    #upload-container
      img
        width 200px
        margin-top 10px
    .status
      border 1px solid #1CB2EF
      border-radius 3px
      padding 3px
      float right

</style>
