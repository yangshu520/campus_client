<template>
	<view>
		<view class="container" v-if = "noData" :style="'width:'+ boxWidth +';'">
			<u-image 
			width="360rpx"
			height="310rpx"
			:src="noImg">
				<u-loading slot="loading"></u-loading>
			</u-image>
			<view class="container-name">{{title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"common-empty",
		props:{
			title:{
				type:String,
				default:"暂无内容"
			},
			noImg:{
				type:String,
				default: "/static/img/home/nodata-bg.png"
			},
			noData:{
				type:[Boolean,Number],
				default: false
			},
			boxWidth:{
				type:String,
				default: '100vw'
			}
		}
	}
</script>

<style lang="scss">
.container{
	height: 40vh;
	@include flex($hov:center);
	flex-direction: column;
	.container-name{
		margin-top: 40rpx;
		font-size: $fontSize03;
		font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
		font-weight: 400;
		text-align: center;
		color: #999999;
	}
}
</style>
