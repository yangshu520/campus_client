<template>
	<view>
		<view class="container">
			<!-- sos开关 -->
			<view class="container-item">
				<view class="item-title">SOS报警开关</view>
				<u-switch v-model="sosSwitchs" @change="sosSwitchChange"></u-switch>
			</view>
			<!-- 运动提醒 -->
			<view class="container-item">
				<view class="item-title">运动提醒</view>
				<u-switch v-model="reminderSwitch" @change="exchange"></u-switch>
			</view>
			<!-- 音量大小 -->
			<view class="container-item">
				<view class="item-title">音量大小</view>
				<view class="item-volume">
					<block v-for="(item,index) in ['小','中','大']" :key="index">
						<view class="volume" @click="sliderChange(index)" :class="index == value?'select-volume':''">{{item}}</view>
					</block>
				</view>
			</view>
			<!-- 设备详情 -->
			<view class="container-item" @click="facilityDateil = !facilityDateil">
				<view class="item-title">设备详情</view>
				<view class="item-img">
					<image :class="facilityDateil?'img-rote':''" mode="aspectFill" src="/static/img/home/forward-button.png" />
				</view>
			</view>
			<!-- 设备详情展开 -->
			<view class="container-dateil" v-if="cardDate && facilityDateil">
				<view class="dateil-item">
					<view class="item-title">IMEI</view>
					<view class="item-name">{{cardDate.imei}}</view>
				</view>
				<view class="dateil-item">
					<view class="item-title">设备类型</view>
					<view class="item-name">电子学生证</view>
				</view>
				<view class="dateil-item">
					<view class="item-title">SIM卡号</view>
					<view class="item-name">{{cardDate.simNumber?cardDate.simNumber:'暂无'}}</view>
				</view>
				<view class="dateil-item">
					<view class="item-title">版本号</view>
					<view class="item-name">{{cardDate.versionNumber}}</view>
				</view>
			</view>
			<!-- 终端操作 -->
			<view class="container-item">
				<view class="item-title">设备操作</view>
				<view class="item-operate">
					<view class="operate-shutdown" @click="shutdown">关机</view>
					<view class="operate-reboot" @click="reboot">重启</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getCardParam,
	getOperatorId,
	baseCardParam,
	setCardSpeaker,
	setMovementSwicth,
	setSosSwicth,
	offTimeStatus} from "@/common/httpApi/cardHttpApi.js"
	import {deleteOperation} from "@/common/httpApi/comhttpApi.js"
	import {CARD_CLOSE,CARD_REBOOT} from "@/common/js/apiUrl.js"
	export default {
		data() {
			return {
				// 学生证的imei卡号
				imei:null,
				// 音量的大中小
				volume:null,
				// 多大的声音
				value:-1,
				// 报警开关
				police:false,
				// 课堂模式
				classRoom:false,
				// sos数据
				sosSwitchs:false,
				// 后端需要是谁操作的参数
				operatorId:null,
				// 是否开启运动提醒
				reminderSwitch:false,
				// 学生证数据
				cardDate:null,
				paramDate:null,
				// 是否展开设备详情
				facilityDateil:false,
				// 处于的状态
				status:null
			};
		},
		onLoad(options){
			this.getInitDate(options);
		},
		methods:{
			// 初始化数据
			async getInitDate(option){
				try{
					// 存一下数据
					this.operatorId = getOperatorId();
					this.imei = option.imei;
					const {status} = await getCardParam(option.imei);
					this.status = status;
					this.cardDate = uni.getStorageSync("cardDate");
					// 获取该页面需要的数据
					const paramDate = await baseCardParam(option.imei);
					if(paramDate){
						this.paramDate = paramDate;
						this.value = paramDate.speaker;
						this.sosSwitchs = paramDate.sosSwitch==1?false:true;
						this.reminderSwitch = paramDate.movementReminderSwitch==1?true:false;
					}
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			// 设置音量
			async sliderChange(index){
				if(offTimeStatus(this.status)) return;
				
				const reqDate = {
					imei:this.imei,
					level:String(index),
					operatorId:this.operatorId
				}
				const cardDate = await setCardSpeaker(reqDate);
				if(cardDate){
					this.value = index;
				}
			},
			// 关机操作
			async shutdown(){
				if(offTimeStatus(this.status)) return;
				
				const data = {
					imei:this.imei,
					operatorId:this.operatorId
				};
				const cardDate = await deleteOperation({
					tipTitle:"设备关机操作",
					tipContent:"确定要进行设备关机?",
					confirmText:'关机',
					deleteApi:CARD_CLOSE,
					data:data,
					type:1
				});
			},
			// 重启操作
			async reboot(){
				if(offTimeStatus(this.status)) return;
				
				const data = {
					imei:this.imei,
					operatorId:this.operatorId
				};
				const cardDate = await deleteOperation({
					tipTitle:"设备重启操作",
					tipContent:"确定要进行设备重启?",
					confirmText:'重启',
					deleteApi:CARD_REBOOT,
					data:data,
					type:1
				});
			},
			// sos开关
			async sosSwitchChange(e){
				const switchCode=Number(!e);
				if(offTimeStatus(this.status)){
					this.sosSwitchs = !this.sosSwitchs;
					return;
				}
				const data = {
					imei:this.imei,
					switchCode:String(switchCode),
					operatorId:this.operatorId
				};
				const cardDate = await setSosSwicth(data);
				if(!cardDate){
					this.sosSwitchs=!this.sosSwitchs;
				}
			},
			// 运动提醒功能开关
			async exchange(e){
				const switchFlag = Number(e);
				if(offTimeStatus(this.status)){
					this.reminderSwitch = !this.reminderSwitch;
					return;
				}
				const data = {
					imei:this.imei,
					switchFlag:String(switchFlag),
					operatorId:this.operatorId
				};
				const cardDate = await setMovementSwicth(data);
				if(!cardDate){
					this.reminderSwitch = !this.reminderSwitch;
				}
			}
		}
	}
</script>

<style lang="scss"> 
page{
	background-color: #f5f5f5;
}
.container{
	.container-item{
		padding: 0 40rpx;
		border-bottom: 2rpx solid #f5f5f5;
		font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
		height: 110rpx;
		width: 100vw;
		@include flex($hov:space-between);
		background-color: #FFFFFF;
		.item-title{
			font-size: $fontSize02;
			font-weight: 400;
			color: #333333;
		}
		.item-volume{
			@include flex($hov:space-between);
			width: 320rpx;
			.volume{
				@include flex($hov:center);
				width: 80rpx;
				height: 50rpx;
				border-radius: 4rpx;
				font-size: $fontSize03;
				background-color: #f5f5f5;
				&.select-volume{
					background-color: #0099ff;
					color: #FFFFFF;
				}
			}
		}
		.item-img{
			width: 16rpx;
			height: 24rpx;
			.img-rote{
				transition: all .5s linear;
				transform: rotate(90deg);
			}
		}
		.item-operate{
			@include flex($hov:space-between);
			width: 240rpx;
			font-size: $fontSize02;
			.operate-shutdown{
				@include flex($hov:center);
				width: 96rpx;
				height: 54rpx;
				background-color: #FCF1F2;
				color: #FD0404;
			}
			.operate-reboot{
				@include flex($hov:center);
				width: 96rpx;
				height: 54rpx;
				background-color: #F4FAFE;
				color: #279CF8;
			}
		}
	}
	.container-dateil{
		margin: 20rpx 20rpx;
		border-radius: 12rpx;
		width: 710rpx;
		padding: 0 20rpx;
		background-color: #f9f9f9;
		.dateil-item{
			@include flex($hov:space-between);
			height: 90rpx;
			border-bottom: 2rpx solid #f5f5f5;
			font-size: $fontSize02;
			color: #333333;
			.item-title{
				font-size: $fontSize03;
				color: #666666;
			}
			.item-name{
				font-family: $fontFamily05;
			}
		}
	}
}
</style>