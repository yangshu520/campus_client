<template>
	<view>
		<!-- 时间选择器 -->
		<u-calendar v-model="isCalendarShow" :mode="mode" @change="changeCalendar" :min-date="minDate">
			<view slot="tooltip" class="tip">
				<view :class="mode=='date'?'select-tip':''" @click="mode='date'">单个</view>
				<view>请选择{{mode=='range'?'日期范围':'单个日期'}}</view>
				<view :class="mode=='range'?'select-tip':''" @click="mode='range'">范围</view>
			</view>
		</u-calendar>
		
		<!-- 图表展示 -->
		<view class="qiun-charts" v-show="isqiunCharts">
			<canvas canvas-id="canvasArea" id="canvasArea" class="charts" @touchstart="touchArea"></canvas>
		</view>
		
		<!-- 步数列表 -->
		<view class="setp">
			<view class="step-count" v-for="(item,index) in stepList" :key="index">
				<view class="count-title">{{item.dateTime==isToDay?"今日":(item.dateTime==isYesterDay?"昨天":item.dateTime)}}</view>
				<view class="count-content">
					<view><text class="content-step">步数</text>
					<text class="content-number">{{item.stepNumber}}</text>
					<text class="content-tip">步</text></view>
					<view @click="navTrack(item.needDate)">
						<u-image mode="aspectFit" width="64rpx"  height="64rpx" src="http://47.114.75.140/doc/message/image/18b8b543-9ad7-11e8-aebe-1368d4ec24eb/1604909430064.png">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
				</view>
			</view>
		</view>
		<!-- 没有数据 -->
		<common-empty :noData="!stepList.length" />
	</view>
</template>

<script>
	import uCharts from '@/common/utils/u-charts/u-charts.js';
	import {getSportList} from "@/common/httpApi/cardHttpApi.js"
	
	// 图表数据需要全局定义
	var _self;
	var canvaArea=null;
   
	export default {
		data() {
			return {
				imei:"",
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				isCalendarShow:false,
				mode: 'range',
				minDate:"",
				isqiunCharts:true,
				stepList:[],
				singleTime:"",
				startTime:"",
				endTime:"",
				isToDay:"",
				isYesterDay:"",
				stepMax:"1000"
			}
		},
		onLoad(option) {
			this.imei = option.imei;
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(520);
			this.getMinDate();
		},
		methods: {
			// 只能获取30天的记录
			getMinDate(){
				var date1 = new Date();
				var date2 = new Date(date1);
				date2.setDate(date1.getDate() - 29);
				this.minDate=date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
				
				// 获取30天之前的日期
				const startMonth=(date2.getMonth() + 1)>=10?(date2.getMonth() + 1):"0"+(date2.getMonth() + 1);
				const startDate=date2.getDate()>=10?date2.getDate():"0"+date2.getDate();
				this.startTime=date2.getFullYear()+"-"+startMonth+"-"+startDate+" 00:00:00";
				
				// 获取当天的时间
				const endMonth=(date1.getMonth() + 1)>=10?(date1.getMonth() + 1):"0"+(date1.getMonth() + 1);
				const endDate=date1.getDate()>=10?date1.getDate():"0"+date1.getDate();
				this.endTime=date1.getFullYear()+"-"+endMonth+"-"+endDate+" 23:59:59";
				this.isToDay=endMonth+"月"+endDate+"日";
				
				// 获取昨天的时间
				var date3 = new Date(date1);
				date3.setDate(date1.getDate() - 1);
				const yMonth=(date3.getMonth() + 1)>=10?(date3.getMonth() + 1):"0"+(date3.getMonth() + 1);
				const yDate=date3.getDate()>=10?date3.getDate():"0"+date3.getDate();
				this.isYesterDay=yMonth+"月"+yDate+"日";
				
				this.getServerData();
				
			},
			// 获取图表数据
			async getServerData(){
				const data = {
					imei:this.imei,
					singleTime:this.singleTime,
					startTime:this.startTime,
					endTime:this.endTime
				}
				const cardDate = await getSportList(data);
				
				if(cardDate){
					const list=[];
					const categoriesList=[];
					const seriesList=[];
					cardDate.forEach(item=>{
						list.push({
							stepNumber:item.stepNumber,
							dateTime:(item.createDate&&item.createDate.substr(5,2)+"月")+(item.createDate&&item.createDate.substr(8,2)+"日"),
							needDate:item.createDate&&item.createDate.substr(0,10)
						});
						categoriesList.push((item.createDate&&item.createDate.substr(5,2)+".")+(item.createDate&&item.createDate.substr(8,2)));
						seriesList.push(item.stepNumber);
					});
					this.stepList=list;
					
					// 如果数据有7条或者以上  展示图形统计
					if(categoriesList.length>=7&&seriesList.length>=7){
						const max=Math.max.apply(Math,seriesList.slice(0,7));
						
						this.stepMax=Number(max)+500;
						const chartData= {
							categories: categoriesList.slice(0,7).reverse(),
							series: [{
								name: '步数',
								data: seriesList.slice(0,7).reverse(),
								color: '#1890ff'
							}]
						}
						_self.showArea("canvasArea",chartData);
					}else{
						this.isqiunCharts=false;
					}
				}
				
			},
			// echarts配置
			showArea(canvasId,chartData){
				canvaArea=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'area',
					fontSize:11,
					background:"#0099ff", //背景颜色
					legend:{show:false},
					dataLabel:true,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:3,
					},
					yAxis: {
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:3,
						splitNumber:6,
						disabled:true,
						// 网格的最大值
						max:_self.stepMax
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						area:{
							type: 'curve',
							opacity:0.2,
							addLine:true,
							width:1
						}
					}
				});
				
			},
			// 点击图表的时候
			touchArea(e) {
				canvaArea.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + '共' + item.data +'步'
					}
				});
			},
			// 选择时间或者范围
			changeCalendar(e){
				if(this.mode=="range"){
					this.singleTime="";
					this.endTime=e.endDate+" 23:59:59";
					this.startTime=e.startDate+ " 00:00:00";
				}else{
					this.endTime="";
					this.startTime="";
					this.singleTime=e.result;
				}
				this.getServerData();
				this.isqiunCharts=false;
			},
			// 查看当天的轨迹
			navTrack(needTime){
				uni.navigateTo({
					url:"/parent/security/trajectory-playback?imei="+this.imei+"&time="+needTime
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #f8f8f8;
	}
	.tip{
		@include flex();
		padding: 30rpx 90rpx 0 30rpx;
		.select-tip{
			color: #FFFFFF;
			background-color: #0099ff;
			padding: 0 10rpx;
			border-radius: 10rpx;
		}
	}
	.qiun-charts {
		width: 750rpx;
		height: 500rpx;
		.charts {
			width: 750rpx;
			height: 500rpx;
			background-color: #f8f8f8;
		}
	}
	.setp{
		width: 100vw;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 20rpx 0;
		.step-count{
			width: 680rpx;
			.count-title{
				padding-left: 12rpx;
				font-size: 34rpx;
				color: #000000;
				font-family: Arial, Helvetica, sans-serif;
				height: 80rpx;
				line-height: 80rpx;
			}
			.count-content{
				width: 100%;
				height: 160rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				overflow: hidden;
				@include flex();
				padding: 0 30rpx;
				.content-step{
					font-size: 28rpx;
					color: #000000;
				}
				.content-number{
					margin-right: 20rpx;
					margin-left: 40rpx;
					color: #0099ff;
					font-size: 60rpx;
				}
				.content-tip{
					font-size: 28rpx;
					color: #999999;
				}
			}
		}
	}
</style>