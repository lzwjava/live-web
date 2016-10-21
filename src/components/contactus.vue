<template>
	<section class="contact-us" @click="stop($event)">
		<button type="button" class="cancel" @click="close">X</button>
		<h2>联系我们</h2>
		<div class="form">
			<div class="qrcode"></div>
			<div class="wechattext">趣直播微信反馈通道</div>
		</div>
		<p style="padding-top: 30px;font-weight: bold;">邮箱地址：feedback@quzhiboapp.com</p>
	</section>
</template>
<script>
	export default{
		data () {
			return {
			}
		},
		methods:{
			stop (e){
				e.stopPropagation();
			},
			close (){
				this.$parent.overlay = false;
			}
		}
	}
</script>
<style lang="stylus">
@import "../stylus/variables.styl";

	.contact-us
		background white
		width 500px
		height 615px
		padding 50px
		border-radius 3px
		position absolute
		box-shadow 0px 13px 21px 7px rgba(0,0,0,.1)
		-webkit-box-shadow 0px 13px 21px 7px rgba(0,0,0,.1)
		left 50%
		top 50%
		margin -300px 0 0 -250px
		.form
			border-top 1px solid #e9eaec
			border-bottom 1px solid #e9eaec
			padding 30px 0
			margin-top 20px
		.cancel
			position absolute
			width 20px
			height 20px
			right 20px
			top 20px
			background #fff
		p
			font-size 0.8rem
			text-align center
			strong
				color blue
		h2
			font-size 1.5rem
			text-align center
		.qrcode
			width 320px
			height 400px
			background url("../img/lzwjava_qrcode.jpg") no-repeat
			background-size contain
			margin-top 10px
			margin 0 auto
		.wechattext
			text-align center
			margin 0 auto
			font-size 16px
			margin-top 20px
			margin-bottom 10px
			font-weight bold

		.row
			width 100%
			height 58px
			border 1px solid rgba(40,47,49,.3)
			border-radius 3px
			padding-left 30px
			margin-bottom 10px
			input
				width 100%
				height 55px
				margin-top 1px
				border none
				outline none
				font-size 14px

</style>
