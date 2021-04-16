<template>
	<view>
		<view class="container">
			<view class="container-battey">
				<u-image height="470rpx" width="580rpx" :src="status == 1?'/static/img/parent/battery-bgs.png':'/static/img/parent/battery-bg.png'" mode="aspectFill">
					<u-loading slot="loading"></u-loading>
				</u-image>
				<view class="battey-info">
					<view class="info-number">
						<text>{{cardSoc}}</text>
						<text style="font-size: 36rpx;">%</text>
					</view>
					<view class="info-name">{{status == 1?'当前电量':'已离线'}}</view>
				</view>
				<view class="battey-picture" :class="status == -1?'picture-status':''">
					<view class="picture-bgc1" :style="'height:'+ cardSoc +'%;'"></view>
				</view>
			</view>
			<!-- 电量列表 -->
			<view class="container-list">
				<scroll-view scroll-y="true" scroll-with-animation="true" class="list-scroll">
					<view class="srcoll-top" v-show="batteryList.length">
						<view class="top-left">
							<u-image height="34rpx" width="34rpx" src="/static/img/parent/battery-icon1.png" mode="aspectFill">
								<u-loading slot="loading"></u-loading>
							</u-image>
							<view class="left-line"></view>
						</view>
						<view class="top-name">历史电量信息</view>
					</view>
					<!-- 历史电量信息 -->
					<view class="srcoll-history" v-for="(item,index) in batteryList" :key="index">
						<view class="history-left">
							<u-image height="20rpx" width="20rpx" src="/static/img/parent/battery-icon2.png" mode="aspectFill">
								<u-loading slot="loading"></u-loading>
							</u-image>
							<view class="left-line"></view>
						</view>
						<view class="history-right">
							<u-image height="178rpx" width="640rpx" src="/static/img/parent/battery-list-bg.png" mode="aspectFill">
								<u-loading slot="loading"></u-loading>
							</u-image>
							<view class="right-box">
								<view class="box-title">
									<text>日  期:</text>
									<text class="title">{{item.createDate}}</text>
								</view>
								<view class="box-title">
									<text>电  量:</text>
									<text class="title">{{item.electricity}}%</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 没有数据 -->
					<common-empty 
					boxWidth="100%"
					:noData="!batteryList.length" />
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	getCardParam,
	getBatteryInfo
	} from "@/common/httpApi/cardHttpApi.js"
	export default {
		data() {
			return {
				status: 1,
				cardSoc: 0,
				batteryList:[]
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		methods:{
			async getInitDate(option){
				try{
					// 存一下数据
					this.imei = option.imei;
					const {status , cardParam} = await getCardParam(option.imei);
					this.status = status;
					if(cardParam.soc){
						let timer;
						timer = setInterval(()=>{
							if(this.cardSoc >= cardParam.soc){
								clearInterval(timer);
								return;
							}
							this.cardSoc ++
						},50)
					}else{
						this.cardSoc = cardParam.soc
					}
					const batteryList = await getBatteryInfo(this.imei);
					batteryList.map(item=>{
						item.createDate = item.createDate && item.createDate.substr(0,16)
					})
					this.batteryList = batteryList;
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			}
		},
		computed:{
			getStely(){
				if(this.status == -1){
					
				}else{
					
				}
			},
		}
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	padding-top: 60rpx;
	.container-battey{
		position: relative;
		width: 100%;
		height: 40vh;
		@include flex($hov:center);
		flex-direction: column;
		.battey-info{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 99;
			.info-number{
				font-size: 87rpx;
				color: #ffffff;
				letter-spacing: 2rpx;
			}
			.info-name{
				font-size: $fontSize03;
				font-family: PingFang SC-Regular, PingFang SC-Regular-SC-Regular;
				color: #e9f6ff;
				letter-spacing: 4rpx;
			}
		}
		.battey-picture{
			z-index: 90;
			width: 344rpx;
			height: 344rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-55%,-50%);
			background: #cceaff;
			border-radius: 172rpx;
			overflow: hidden;
			.picture-bgc1{
				z-index: 1;
				width: 100%;
				position: absolute;
				bottom: 0;
				left: 0;
				background: linear-gradient(0deg,#0e5fce 0%, #1498f5 100%);
			}
			&.picture-status{
				background: #e6e6e6;
				.picture-bgc1{
					background: linear-gradient(0deg,#848484 0%, #838383 100%);
				}
			}
		}
	}
	.container-list{
		@include flex($hov:center);
		.list-scroll{
			width: 680rpx;
			height:60vh;
			@include comomSlide();
			.srcoll-top{
				display: flex;
				.top-left{
					@include flex($hov:center);
					flex-direction: column;
					.left-line{
						height: 40rpx;
						width: 2rpx;
						background-color: #0067c6;
					}
				}
				.top-name{
					flex: 1;
					padding-left: 30rpx;
					font-size: $fontSize03;
					font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
					text-align: left;
					color: #333333;
				}
			}
			.srcoll-history{
				display: flex;
				.history-left{
					width: 34rpx;
					@include flex($hov:center);
					flex-direction: column;
					.left-line{
						margin-top: 20rpx;
						height: 168rpx;
						width: 2rpx;
						background-color: #0067c6;
					}
				}
				.history-right{
					position: relative;
					
					.right-box{
						position: absolute;
						top: 40%;
						left: 40%;
						transform: translate(-50%,-50%);
						.box-title{
							font-size: $fontSize02;
							font-family: PingFang SC-Medium, PingFang SC-Medium-SC-Medium;
							text-align: left;
							color: #333333;
							line-height: 50rpx;
							.title{
								font-size: $fontSize03;
								font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
								text-align: left;
								color: #666666;
								margin-left: 28rpx;
							}
						}
					}
				}
			}
		}
	}
}
</style>
