<template>
	<view>
		<view class="container">
			<view class="container-title">
				<view class="title-subject"
				 v-if="dateType == 1"
				:style="dateil.subjectName | getSubSty">
					{{dateil.subjectName | getSubject}}
				</view>
				<view class="title-name" v-if="dateType == 1">
					{{dateil.assignmentName}}
				</view>
				<view class="title-names" v-if="dateType == 2">
					{{dateil.messageTitle}}
				</view>
			</view>
			<view class="container-content" v-if="dateType == 1">
				<u-parse :html="dateil.assignmentContent" />
			</view>
			<view class="container-content" v-if="dateType == 2">
				<u-parse :html="dateil.messageContent" />
			</view>
			<view class="container-btm">
				<text>{{dateil.createDate | getTime}}</text> 
				<text class="btm" v-if="dateType == 1">{{dateil.userName}}</text>
				<text class="btm" v-if="dateType == 2">{{dateil.sendUser && dateil.sendUser.nickName}}</text>
				<text>发布{{dateType == 1?'作业':'通知'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dateil: {},
				dateType: 1,
			};
		},
		onLoad(options) {
			this.dateType = options.dateType;
			if(options.dateType == 1){
				this.dateil = uni.getStorageSync("workDateil");
			}else if(options.dateType == 2){
				this.dateil = uni.getStorageSync("newsDateil");
			}
		},
		onHide() {
			uni.removeStorageSync("workDateil");
			uni.removeStorageSync("newsDateil");
		},
		onUnload() {
			uni.removeStorageSync("workDateil");
			uni.removeStorageSync("newsDateil");
		},
		filters:{
			getSubject(val){
				if(val){
					return val.substr(0,1);
				}
				return "未"
			},
			getSubSty(val){
				if(val == "数学"){
					return "background: #838fee;"
				}else if(val == "语文"){
					return "background: #fbbe49;"
				}
			},
			getTime(val){
				if(val){
					return val.substr(0,10)
				}
				return "暂无时间"
			}
		}
	}
</script>

<style lang="scss">
.page{
	background-color: #f5f5f5;
}
.container{
	width: 100%;
	padding: 0 34rpx;
	.container-title{
		width: 100%;
		min-height: 82rpx;
		@include flex();
		.title-subject{
			background: #fbbe49;
			border-radius: 4rpx;
			@include flex($hov:center);
			width: 44rpx;
			height: 44rpx;
			font-size: 26rpx;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
			font-weight: 400;
			color: #ffffff;
		}
		.title-name{
			flex: 1;
			font-size: 34rpx;
			font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
			font-weight: 500;
			text-align: left;
			color: #121212;
			margin-left: 24rpx;
		}
		.title-names{
			flex: 1;
			font-size: 34rpx;
			font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
			font-weight: 500;
			text-align: left;
			color: #121212;
			margin: 20rpx 0;
		}
	}
	.container-btm{
		margin-top: 50rpx;
		border-top: 2rpx solid #ECEBEB;
		padding-top: 62rpx;
		width: 100%;
		@include flex($hov:center);
		font-size: $fontSize04;
		font-family: Source Han Sans CN Light, Source Han Sans CN Light-Light;
		color: #999999;
		line-height: 60rpx;
		letter-spacing: 2rpx;
		.btm{
			margin: 0 30rpx;
		}
	}
}
</style>
