<template>
	<view>
		<view class="container">
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
			<view class="container-item">
				<view :class="item.isWeek?'select-name':''" 
				class="item-name" 
				v-for="(item,index) in weeks" :key="index"
				@click="weekSelect(index)">
					{{item.name}}
				</view>
			</view>
			
			<view class="container-save">
				<button class="save" @click="disturbMode">保存</button>
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
	addAnEdiDisturb,
	} from "@/common/httpApi/cardHttpApi.js"
	export default {
		components:{DateTimePicker},
		data() {
			return {
				startTimes:'',
				endTimes:'',
				operatorId:null,
				imei:null,
				status:null,
				timeType:'hour-minute',
				weeks:[{
						id:7,
						name:'日',
						isWeek:false
					},{
						id:1,
						name:'一',
						isWeek:false
					},{
						id:2,
						name:'二',
						isWeek:false
					},{
						id:3,
						name:'三',
						isWeek:false
					},{
						id:4,
						name:'四',
						isWeek:false
					},{
						id:5,
						name:'五',
						isWeek:false
					},{
						id:6,
						name:'六',
						isWeek:false
					}],
				idx:"0",
				dataType:null
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		onUnload() {
			uni.removeStorageSync("temporaryDateDis");
		},
		methods:{
			async getInitDate(option){
				try{
					this.operatorId = getOperatorId();
					this.imei = option.imei;
					const {status} = await getCardParam(option.imei);
					this.status = status;
					// 处理修改的数据
					if(option.dataType){
						const data = uni.getStorageSync("temporaryDateDis");
						this.idx = "1";
						this.endTimes = data.endTime.substr(0,2)+':'+data.endTime.substr(2,2);
						this.startTimes = data.startTime.substr(0,2)+':'+data.startTime.substr(2,2);
						const weekList = [data.monDisable,data.tueDisable,data.wedDisable,data.thuDisable,data.friDisable,data.satDisable,data.sunDisable]
						const weeksList = [];
						weekList.forEach((item,index)=>{
							weeksList.push(String(index+1)+item);
						});
						const weeksStr = weeksList.join('');
						const week = ['一','二','三','四','五','六','日'];
						const fliterArr = weeksStr.split('').filter((item,index)=> index%2 !== 0);
						const weeks = [];
						fliterArr.forEach((item,index)=>{
							weeks.push({ 
								id:index+1,
								name:week[index],
								isWeek:Boolean(Number(item))
							})
						});
						this.weeks = weeks;
					}
				}catch(e){
					//TODO handle the exception
					console.log("添加或者修改勿扰模式异常"+e)
				}
			},
			// 选择时间
			startTimeChange(val){
				this.startTimes = val;
			},
			endTimeChange(val){
				this.endTimes = val;
			},
			// 选择周期
			weekSelect(idx){
				this.weeks[idx].isWeek = !this.weeks[idx].isWeek;
			},
			// 添加或者修改
			async disturbMode(){
				const weekSelect = this.weeks.filter(item=> item.isWeek == true);
				if(!(this.endTimes && this.startTimes)){
					this.$Q.tipUrl({tip:"请选择时间"});
					return;
				}
				
				if(this.endTimes == this.startTimes){
					this.$Q.tipUrl({tip:"时间不能相同"});
					return;
				}
				
				if(!weekSelect.length){
					this.$Q.tipUrl({tip:"请选择周期"});
					return;
				}
				// 构造后端所需要的数据
				const selectWeeks = [];
				this.weeks.forEach(item=>{
					selectWeeks.push(String(item.id)+Number(item.isWeek))
				});
				
				const data = {
					imei: this.imei,
					startTime: this.startTimes,
					endTime: this.endTimes,
					cycle: selectWeeks.join(''),
					index:this.idx,
					operatorId: this.operatorId
				}
				const cardDate = await addAnEdiDisturb(this.status,data);
				if(cardDate){
					this.$Q.tipUrl({
						tip:"操作成功",
						delta:1
					});
					uni.removeStorageSync("temporaryDateDis");
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
		.item-name{
			font-size: $fontSize03;
			color: #333333;
			@include flex($hov:center);
			width: 50rpx;
			height: 50rpx;
			&.select-name{
				color: #3cb2ef;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
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
