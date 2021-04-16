<template>
	<view>
		<view class="container">
			<view class="container-title">
				{{newsDate.messageTitle}}
			</view>
			<view class="container-auther">
				<view class="auther-img">
					<image src="/static/img/parent/security-handle-icon.png" mode="aspectFill" />
				</view>
				<view class="auther-content">
					<view class="content-name">{{newsDate.createUser && newsDate.createUser.nickName}}</view>
					<view class="content-time">{{newsDate.updateDate}}</view>
				</view>
			</view>
			<view class="container-content">
				<u-parse :html="newsDate.messageContent" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newsDate:{}
			};
		},
		onLoad() {
			this.newsDate = uni.getStorageSync("newsDate");
			uni.setNavigationBarTitle({
				title: this.newsDate.messageTitle
			});
		},
		onUnload() {
			uni.removeStorageSync("newsDate");
		},
		filters:{
			
		}
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	padding: 30rpx;
	.container-title{
		font-size: $fontSize01;
		font-family: Microsoft YaHei Bold, Microsoft YaHei Bold-Bold;
		font-weight: 700;
		text-align: left;
		color: #101010;
		line-height: 48rpx;
		width: 100%;
	}
	.container-auther{
		margin:40rpx 0;
		width: 100%;
		height: 68rpx;
		display: flex;
		align-items: center;
		.auther-img{
			width: 68rpx;
			height: 68rpx;
			border-radius: 50%;
		}
		.auther-content{
			margin-left: 20rpx;
			font-family: Hiragino Sans GB W3, Hiragino Sans GB W3-W3;
			.content-name{
				font-size: $fontSize03;
				color: #333333;
			}
			.content-time{
				font-size: $fontSize04;
				color: #999999;
				margin-top: 4rpx;
			}
		}
	}
	.container-content{
		font-size: 34rpx;
		font-family: Microsoft YaHei Regular, Microsoft YaHei Regular-Regular;
		font-weight: 400;
		color: #101010;
		line-height: 60rpx;
	}
}
</style>
