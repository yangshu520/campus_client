<template>
	<view>
		<view class="container">
			<view class="container-item" v-for="(item,index) in smsDate" :key="index">
				<view class="item-time">{{item.sendTimeStamp | formatTime}}</view>
				<view class="item-box">
					<view class="box-img">
						<image src="/static/img/home/avter.png" mode="aspectFill" />
					</view>
					<view class="box-detail">
						<text>{{item.content || '暂无内容'}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import freeBase from '@/common/mixin/free-base.js'
	export default {
		mixins:[freeBase],
		data() {
			return {
				smsDate:[]
			};
		},
		onLoad() {
			this.smsDate = uni.getStorageSync("smsDate")
		},
		onUnload() {
			uni.removeStorageSync("smsDate");
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.container{
	width: 100%;
	padding: 0 30rpx;
	.container-item{
		@include flex($hov:center);
		flex-direction: column;
		width: 100%;
		.item-time{
			font-size: $fontSize04;
			font-family: SourceHanSansCN Normal, SourceHanSansCN Normal-Normal;
			color: #999999;
			margin: 50rpx 0;
		}
		.item-box{
			display: flex;
			width: 100%;
			.box-img{
				width: 112rpx;
				height: 112rpx;
				margin-right: 20rpx;
			}
			.box-detail{
				padding: 34rpx 44rpx;
				border-radius: 20rpx;
				min-height: 100rpx;
				width: 560rpx;
				background-color: #fff;
				font-size: $fontSize03;
				font-family: SourceHanSansCN Normal, SourceHanSansCN Normal-Normal;
				color: #333333;
				line-height: 40rpx;
			}
		}
	}
	
}
</style>
