<template>
	<view>
		<view class="container">
			<view class="container-item">
				<view class="item-title">是否启用</view>
				<u-switch v-model="sleepSwitch"></u-switch>
			</view>
			<view class="container-item">
				<view class="item-title">开始时间</view>
				<view
				 :style="startTimes?'color: #333;':''"
				 class="item-time" @click="$refs['start-time'].show()">
					{{startTimes?startTimes:'选择开始时间'}}
				</view>
			</view>
			<view class="container-item">
				<view class="item-title">结束时间</view>
				<view 
				:style="endTimes?'color: #333;':''"
				class="item-time" @click="$refs['end-time'].show()">
					{{endTimes?endTimes:'选择结束时间'}}
				</view>
			</view>
			<view class="container-save">
				<button class="save" @click="sleepMode">保存</button>
			</view>
			
			<date-time-picker 
			ref='start-time' 
			:type='timeType' 
			:datestring='startTimes' 
			@change='startTimeChange' />
			<date-time-picker 
			ref='end-time' 
			:type='timeType' 
			:datestring='endTimes' 
			@change='endTimeChange' />
		</view>
	</view>
</template>

<script>
	import DateTimePicker from '@/uni-components/bory-dateTimePicker/bory-dateTimePicker.vue'
	import {
	getOperatorId,
	getCardParam,
	setStandby,
	baseCardParam
	} from "@/common/httpApi/cardHttpApi.js"
	export default {
		components:{
			DateTimePicker
		},
		data() {
			return {
				sleepSwitch:true,
				startTimes:'',
				endTimes:'',
				operatorId:null,
				imei:null,
				status:null,
				timeType:'time',
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		methods:{
			async getInitDate(option){
				// 存一下数据
				this.operatorId = getOperatorId();
				this.imei = option.imei;
				const {status} = await getCardParam(option.imei);
				this.status = status;
				// 获取该页面需要的数据
				const paramDate = await baseCardParam(option.imei);
				if(paramDate && paramDate.sleepStart && paramDate.sleepStart){
					// 对数据进行处理
					const startArr = [paramDate.sleepStart.substr(0,2),paramDate.sleepStart.substr(2,2),paramDate.sleepStart.substr(4,2)];
					const endArr = [paramDate.sleepEnd.substr(0,2),paramDate.sleepEnd.substr(2,2),paramDate.sleepEnd.substr(4,2)];
					this.startTimes = startArr[0]+':'+startArr[1]+':'+startArr[2];
					this.endTimes = endArr[0]+':'+endArr[1]+':'+endArr[2];
				}
			},
			// 选择时间
			startTimeChange(val){
				this.startTimes = val;
			},
			endTimeChange(val){
				this.endTimes = val;
			},
			// 保存睡眠模式
			async sleepMode(){
				if(!this.startTimes){
					this.$Q.tipUrl({
						tip:"请选择开始时间"
					});
					return
				}
				if(!this.endTimes){
					this.$Q.tipUrl({
						tip:"请选择结束时间"
					});
					return
				}
				if(this.startTimes == this.endTimes){
					this.$Q.tipUrl({
						tip:"不能选择相同时间"
					});
					return
				}
				const data = {
					imei: this.imei,
					startTime: this.startTimes,
					endTime: this.endTimes,
					switchCode: String(Number(this.sleepSwitch)),
					operatorId: this.operatorId
				};
				const cardDate = await setStandby(this.status,data);
				if(cardDate){
					this.$Q.tipUrl({
						tip:"保存成功",
						url:"/pages/index/index",
						isTab:true
					})
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
	width: 100vw;
	.container-item{
		@include flex($hov:space-between);
		width: 100%;
		height: 100rpx;
		padding: 0 34rpx;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #f5f5f5;
		font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
		.item-title{
			font-size: $fontSize02;
			color: #333333;
		}
		.item-time{
			font-size: $fontSize03;
			color: #9c9c9c;
		}
	}
	.container-save{
		font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
		padding: 0 60rpx;
		.save{
			margin-top: 200rpx;
			width: 100%;
			height: 90rpx;
			background-color: #00d2ff;
			font-size: 32rpx;
			color: #fff;
			@include flex($hov:center);
		}
	}
}
</style>
