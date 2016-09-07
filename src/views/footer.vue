<template>
	<overlay :overlay.sync="overlayStatus">
    <component :is="currentView"></component>
  </overlay>
	<footer class="footer-area">
		<ul class="list">
			<a class="slogan" href="/"></a>
	        <li>
	          <div class="short">
	            <h4 class="number">产品</h4>
	            <p class="detail"><a target="_blank" href="#/">首页</a></p><br>
	          </div>
	        </li>
	        <li>
	          <div class="short">
	            <h4 class="number">公司</h4>
	            <p class="detail"><a target="_blank" href="./belief.html">关于我们</a></p><br>
	            <p class="detail"><a @click="contactus">问题反馈</a></p><br>
	            <p class="detail"> <a target="_blank" href="./statement.html">用户协议</a> </p>
	          </div>
	        </li>
	        <div class="company">
	          <div class="short">
	            <h4 class="number2"><span class="rfont1">趣直播</span></h4>
	            <div class="detail2">
	            	<p>Copyright &copy; <span class="year">2016</span><br> 北京平方根科技有限公司 <a target="_blank" href="http://www.miibeian.gov.cn/"><br><span class="ICP">京ICP备15064530号-4</span></a></p>
	            </div>
	          </div>
	        </div>
	     </ul>
	</footer>
</template>

<script type="text/javascript">
import Overlay from '../components/overlay.vue';
import Contactus from '../components/contactus.vue';
var debug = require('debug')('home');
var util = require('../common/util');

export default {
components: {
      overlay: Overlay,
      contactus: Contactus,
    },
    data () {
      return {
        overlayStatus: false,
        currentView: '',
      }
    },
    events:{
      changeView(view){
        this.currentView = view;
      }
    },

    methods: {
      contactus (){
        this.overlayStatus = true;
        this.currentView = 'contactus';
      }
    }
}
</script>

<style lang="stylus">

.footer-area
	background #282F32
	height 338px
	width 100%
	text-align center
	color white
	.list
		width 85%
		margin 0 auto
		display flex
		flex-direction row
		padding-top 60px
		.slogan
			width 375px
			height 50px
			background url("../img/Slogan@2x.png") no-repeat
			background-size 100%
			margin auto auto auto 0
		.company
			text-align left
			margin 0 0 auto auto
			line-height 19px
			.short
				.number2
					margin-bottom 20px
					font-size 24px
					.rfont1
						font-family Helvetica
						font-weight lighter
					.rfont2
						font-family Helvetica
						font-weight bold
				.detail2
					opacity 0.6
					font-size 14px
					line-height 27px
					font-weight normal
					p
						color white
						font-family Helvetica
						margin-top: -5px;
						.year
							font-family Helvetica Neue,Helvetica
						.ICP
							color white
							font-family Helvetica Neue,Helvetica

		li
			text-align left
			margin 0 auto
			line-height 19px
			.number
				margin-bottom 20px
				font-weight 500
				font-size 20px
			.detail
				opacity 0.6
				font-size 14px
				font-weight normal
				a
					color white
					cursor pointer

@media screen and (max-width:768px)
	.slogan
		display none

</style>
