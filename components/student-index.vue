<template>
	<view>
		<view class="content-container">
			<view class="container" :style="index == 1 ? 'margin-top: 26rpx;' : '' " v-for="(item,index) in stuFunList" :key="index">
				<view class="container-title">
					<view class="title-img">
						<u-image mode="scaleToFill" src="/static/img/home/indexLeft.png" height="42rpx" width="10rpx">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="title-name">{{item.title}}</view>
				</view>
				<view class="container-box">
					<view class="box-item" @click="funEntrance(items)" v-for="(items,indexs) in item.stuPageList" :key="indexs">
						<view class="item-img">
							<image :src="items.iconImg"></image>
						</view>
						<view class="item-title">{{items.iconTitle}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {whetherBindCard} from "@/common/httpApi/cardHttpApi.js"
	export default {
		name:"student-index",
		data() {
			return {
				stuFunList:[
					{
						title:"云家校",
						stuPageList:[
							{
								id:1,
								funType:1,
								iconImg:"/static/img/home/attendance-record.png",
								pageUrl:"/parent/home/attendance-count",
								iconTitle:"考勤记录"
							},
							{
								id:2,
								funType:1,
								iconImg:"/static/img/home/class-inform.png",
								pageUrl:"/parent/home/notice-inform?newsType=1",
								iconTitle:"班级通知"
							},
							{
								id:3,
								funType:1,
								iconImg:"/static/img/home/school-notice.png",
								pageUrl:"/parent/home/notice-inform?newsType=2",
								iconTitle:"学校通知"
							},
							{
								id:4,
								funType:1,
								iconImg:"/static/img/home/homework.png",
								pageUrl:"/parent/home/home-work",
								iconTitle:"家庭作业"
							},
							{
								id:5,
								funType:1,
								iconImg:"/static/img/home/campus-news.png",
								pageUrl:"/parent/home/campus-news",
								iconTitle:"校园新闻"
							},
							{
								id:6,
								funType:1,
								iconImg:"/static/img/home/address-list.png",
								pageUrl:"/parent/home/address-record",
								iconTitle:"通 讯 录"
							},
							{
								id:7,
								funType:1,
								iconImg:"/static/img/home/timetable.png",
								pageUrl:"/parent/home/class-schedule",
								iconTitle:"课 程 表"
							},
						]
					},{
						title:"云安全",
						stuPageList:[
							{
								id:1,
								funType:2,
								iconImg:"/static/img/home/real-time-location.png",
								pageUrl:"/parent/security/real-time-location",
								iconTitle:"实时定位"
							},
							{
								id:2,
								funType:2,
								iconImg:"/static/img/home/call-baby.png",
								pageUrl:"/parent/security/call-baby",
								iconTitle:"呼叫宝贝"
							},
							{
								id:3,
								funType:2,
								iconImg:"/static/img/home/kiss-number.png",
								pageUrl:"/parent/security/kiss-number",
								iconTitle:"亲情号码"
							},
							{
								id:4,
								funType:2,
								iconImg:"/static/img/home/white-list.png",
								pageUrl:"/parent/security/whilte-list",
								iconTitle:"白 名 单"
							},
							{
								id:5,
								funType:2,
								iconImg:"/static/img/home/electronic-fence.png",
								pageUrl:"/parent/security/danger-area",
								iconTitle:"危险区域"
							},
							{
								id:6,
								funType:2,
								iconImg:"/static/img/home/remote-listening.png",
								pageUrl:"/parent/security/remote-listening",
								iconTitle:"远程聆听"
							},
							{
								id:7,
								funType:2,
								iconImg:"/static/img/home/trajectory-playback.png",
								pageUrl:"/parent/security/trajectory-playback",
								iconTitle:"轨迹播放"
							},
							{
								id:8,
								funType:2,
								iconImg:"/static/img/home/common-position.png",
								pageUrl:"/parent/security/security-area",
								iconTitle:"安全区域"
							},
							{
								id:9,
								funType:2,
								iconImg:"/static/img/home/sport-record.png",
								pageUrl:"/parent/security/sport-record",
								iconTitle:"运动记录"
							},
							{
								id:10,
								funType:2,
								iconImg:"/static/img/home/sleep-mode.png",
								pageUrl:"/parent/security/sleep-mode",
								iconTitle:"睡眠模式"
							},
							{
								id:11,
								funType:2,
								iconImg:"/static/img/home/classroom-pattern.png",
								pageUrl:"/parent/security/classroom-pattern",
								iconTitle:"课堂模式"
							},
							{
								id:12,
								funType:2,
								iconImg:"/static/img/home/text-information.png",
								pageUrl:"/parent/security/text-information",
								iconTitle:"短信信息"
							},
							{
								id:13,
								funType:2,
								iconImg:"/static/img/home/battery-information.png",
								pageUrl:"/parent/security/battery-information",
								iconTitle:"电量信息"
							},
							{
								id:14,
								funType:2,
								iconImg:"/static/img/home/setting.png",
								pageUrl:"/parent/security/card-setting",
								iconTitle:"设 置"
							},
						]
					}
				],
				cardDate:undefined,
			};
		},
		mounted() {
			this.getInitializeDate();
		},
		methods:{
			getInitializeDate(){
				try{
					this.cardDate = uni.getStorageSync("cardDate");
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			
			// 功能方法
			async funEntrance(date){
				// 先检测是否绑定
				const roleType = uni.getStorageSync("roleType");
				if(roleType == -1){
					this.$Q.tipUrl({
						tip:"检测未绑定账号",
						url:"/parent/home/select-role"
					});
					return;
				}
				
				if(!date.pageUrl){
					this.$Q.tipUrl({
						tip:"该功能暂未开放"
					})
					return;
				}
				// 如果 功能类型为1 云家校
				if(date.funType == 1){
					uni.navigateTo({
						url:date.pageUrl,
					})
					return;
				}
				// 如果 功能类型为2 云安全
				
				if(date.funType == 2){
					try{
						// 如果已经存在了数据
						if(this.cardDate && this.cardDate.imei && this.status){
							// 是否请求到了数据
							uni.navigateTo({
								url:date.pageUrl+'?imei='+this.cardDate.imei
							});
							return;
						}
						// 如果没有绑定才会去发请求
						const studentId = uni.getStorageSync("student")["id"];
						if(!studentId){
							this.$Q.tipUrl({
								tip:"获取学生异常,重新进入或刷新"
							})
							return;
						}
						const cardInfo = await whetherBindCard(studentId);
						
						if(cardInfo){
							if(typeof(cardInfo) == 'string'){
								const cardDate = JSON.parse(cardInfo);
								// 存一下学生证的数据
								uni.setStorageSync("cardDate",cardDate);
								// 获取一下状态
								uni.navigateTo({
									url:date.pageUrl+'?imei='+cardDate.imei
								});
							}else{
								this.$Q.tipUrl({
									tip:"获取学生证数据异常,请联系客服"
								})
							}
						}
					}catch(e){
						//TODO handle the exception
						console.log('获取电子学生证基本信息异常'+e)
					}
				}
			}
		}
	}
</script>

<style lang="scss">
.content-container{
	width: 100%;
	.container{
		width: 100%;
		padding: 0 30rpx;
		background-color: #fff;
		.container-title{
			height: 80rpx;
			display: flex;
			align-items: center;
			.title-img{
				width: 10rpx;
				height: 42rpx;
			}
			.title-name{
				padding-left: 22rpx;
				line-height: 42rpx;
				font-size: 32rpx;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: 500;
				color: #666666;
			}
		}
		.container-box{
			margin-top: 40rpx;
			display: flex;
			flex-wrap: wrap;
			.box-item{
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 56rpx;
				.item-img{
					width: 102rpx;
					height: 102rpx;
				}
				.item-title{
					margin-top: 20rpx;
					font-size: 24rpx;
					font-family: Source Han Sans CN Normal, Source Han Sans CN Normal-Normal;
					color: #333333;
				}
			}
		}
	}
}
</style>
