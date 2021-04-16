<template>
	<view>
		<view class="container">
			<!-- avter start -->
			<common-avter 
			:disRecord="true"
			:avterImg = "avterImg"
			:avterName = "avterName" 
			:avterClassesName="avterClassesName"
			:avterSchoolName="avterSchoolName"
			:recordAllList="recordAllList"
			/>
			<!-- end -->
			
			<!-- calendar start -->
			<view class="container-calendar" @touchstart="nextStart" @touchend="nextEnd">
				<view class="calendar-title">
					<text class="title-name">每日记录</text>
					<text class="title-month">({{tipMonth}}月)</text>
				</view>
				<ren-calendar ref="calendar"
				:chooses="chooesDay" 
				:notChecked='notChecked' 
				:signeddates="signeddates" 
				@onDayClick="onDayClick" 
				@changeMonth="changeMonth" />
			</view>
			<!-- end -->
			<!-- record start -->
			<view class="container-record">
				<view class="record-title">
					<view class="title-img">
						<u-image mode="scaleToFill" 
						src="/static/img/home/indexLeft.png" 
						height="28rpx" width="8rpx">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="title-name">{{tipRecordTitle?tipRecordTitle:'打卡详情'}}</view>
				</view>
				<view class="record">
					<u-time-line>
						<u-time-line-item v-for="(item,index) in recordList" :key="index">
							<template v-slot:content>
								<view class="record-item">
									<view class="item-time">
										<view class="time-name">
											{{item.title  | getTitle}}
										</view>
										<view class="time-tip" :style="item.attendResult | filStyle">
											{{item.attendResult | getAttendResult}}
										</view>
									</view>
									<view class="item-content">
										<view class="content-time">
											<text class="time-name" style="margin-left: 0;">时间:</text>
											<text class="time-date">{{item.time | getTime}}</text>
										</view>
										<view class="content-time">
											<text class="time-name">温度:</text>
											<text class="time-date">{{item.temp | getTemp}}</text>
										</view>
									</view>
									<view class="item-title">
										<u-image shape="circle" src="/static/img/parent/security-handle-locati.png"
										height="26rpx" width="24rpx">
											<u-loading slot="loading"></u-loading>
										</u-image>
										<view class="title">{{item.attendSite || '暂无考勤位置'}}</view>
									</view>
									<view class="item-img" v-if="item.image" @click="priView(item.image)">
										<image :src="'data:image/jpg;base64,'+item.image.replace(/[\r\n]/g,'')">
											
										</image>
										<!-- <u-image shape="circle" :src="'data:image/png;base64,'+item.image"
										height="200rpx" width="200rpx">
											<u-loading slot="loading"></u-loading>
										</u-image> -->
									</view>
								</view>
							</template>
						</u-time-line-item>
					</u-time-line>
					<common-empty 
					 :noData="!recordList.length"
					 boxWidth="100%"
					 :title="tipRecordTitle?tipRecordTitle:'暂无数据'"
					/>
				</view>
			</view>
			<!-- end -->
		</view>
		<!-- 图片放大看 -->
		<view class="magnification" v-if="disMagniSrc" @click.prevent="disMagniSrc = false">
			<image :src="magniSrc" mode="scaleToFill" />
		</view>
	</view>
</template>

<script>
	import commonAvter from "@/components/common-avter.vue"
	import renCalendar from '@/uni-components/ren-calendar/ren-calendar.vue'
	import {getCurrentDate} from "@/common/httpApi/cardHttpApi.js"
	import {
		getMonthAttend,
		getDayAttend
	} from "@/common/httpApi/homeHttpApi.js"
	export default {
		components:{commonAvter,renCalendar},
		data() {
			return {
				// 组件commonAvter的数据
				avterImg:"/static/img/home/avter.png",
				avterName:"Hello unbound",
				avterSchoolName:"暂未绑定家长账号",
				avterClassesName:null,
				studentId:null,
				// 总考勤
				recordAllList:[
					{
						title:"总考勤次数",
						number:0,
					},
					{
						title:"迟到次数",
						number:0,
					},
					{
						title:"缺勤次数",
						number:0,
					},
					{
						title:"早退次数",
						number:0,
					}
				],
				//考勤异常的天数  格式 2021-4-8
				notChecked:[], 
				//考勤正常的天数  格式 2021-4-8
				signeddates:[], 
				// 选择日期
				chooesDay:'',
				clientX:'',
				recordList:[],
				tipMonth:'',
				// 月考勤数据
				attendMonthDate:{},
				// 提示标题
				tipRecordTitle:null,
				// 图片放大
				disMagniSrc:false,
				magniSrc:null,
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		methods:{
			async getInitDate(options){
				const stuStore = uni.getStorageSync("student");
				this.studentId = stuStore.id || null;
				this.avterImg = stuStore["iconLink"] || this.avterImg;
				this.avterName = stuStore["studentName"] || this.avterName;
				this.avterSchoolName = stuStore["classes"]["schoolName"] || this.avterSchoolName;
				this.avterClassesName = stuStore["classes"]["classesName"] || this.avterClassesName;
				this.chooesDay = getCurrentDate(5);
				this.tipMonth = getCurrentDate(3).substr(5,2);
				
				const valList = this.chooesDay.split('-');
				this.getMonthDate(valList);
				this.getDayDate(valList);
			},
			// 手指开始滑动
			nextStart(e){
				this.clientX = e.changedTouches[0].clientX;
			},
			// 手指结束滑动
			nextEnd(e){
				if(this.clientX > e.changedTouches[0].clientX && this.clientX-e.changedTouches[0].clientX > 200){
					this.$refs.calendar.turning('next');
				}else if(this.clientX < e.changedTouches[0].clientX && e.changedTouches[0].clientX-this.clientX > 200){
					this.$refs.calendar.turning();
				}
			},
			onDayClick(val) {
				const valList = val.split('-');
				this.getDayDate(valList);
			},
			changeMonth(val){
				const valList = val.split('/');
				this.tipMonth = valList[1] >=10 ? valList[1] : '0'+valList[1];
				this.getMonthDate(valList);
				this.getDayDate(valList);
			},
			async getMonthDate(val){
				const data = {
					studentId: this.studentId,
					year:val[0],
					month:val[1]
				}
				const homeDate = await getMonthAttend(data);
				if(homeDate){
					this.attendMonthDate = homeDate;
					this.recordAllList = [
						{
							title:"总考勤次数",
							number:homeDate.attendCount,
						},
						{
							title:"迟到次数",
							number:homeDate.lateCount,
						},
						{
							title:"缺勤次数",
							number:homeDate.absenceCount,
						},
						{
							title:"早退次数",
							number:homeDate.earlyCount,
						},
					]
				}else{
					this.attendMonthDate = {};
					this.recordAllList = [
						{
							title:"总考勤次数",
							number:0,
						},
						{
							title:"迟到次数",
							number:0,
						},
						{
							title:"缺勤次数",
							number:0,
						},
						{
							title:"早退次数",
							number:0,
						},
					]
				}
			},
			async getDayDate(val){
				// 构造需要的数据
				const year = val[0]; 
				const month = val[1] >= 10 ? val[1] : '0'+val[1];
				const day = val[2] >= 10 ? val[2] : '0'+val[2];
				const date = year +'-'+ month +'-'+ day;
				
				const data = {
					studentId: this.studentId,
					data: date
				}
				const homeDate = await getDayAttend(data);
				console.log(homeDate);
				if(homeDate){
					if(Array.isArray(homeDate)){
						this.recordList = homeDate;
						this.tipRecordTitle = null;
					}else{
						this.tipRecordTitle = homeDate;
						this.recordList = []
					}
				}else{
					this.recordList = []
				}
			},
			// 查看图
			priView(val){
				this.magniSrc = 'data:image/jpg;base64,'+val.replace(/[\r\n]/g,'');
				this.disMagniSrc = true;
			},
		},
		filters:{
			getAttendResult(val){
				switch(val){
					case 0:
					return "缺勤";
					case 1:
					return "正常";
					break;
					case 2:
					return "迟到";
					break;
					case 3:
					return "早退";
					break;
					case 4:
					return "离校";
					case 5:
					return "异常";
					break;
				}
			},
			filStyle(val){
				let color;
				if(val == 2 || val == 3 || val == 4 || val == 5){
					color = '#F29A0F'
				}else if(val == 0){
					color = '#F7402E'
				}
				return `color:${color};border: 2rpx solid ${color};`
			},
			getTitle(val){
				if(val){
					return val.substr(0,7)+'考勤'
				}
				return '暂无时间段考勤'
			},
			getTime(val){
				if(val){
					return val.substr(11,5);
				}
				return '暂无'
			},
			getTemp(val){
				if(val){
					return val+'°C'
				}
				return '暂无'
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.container{
	width: 100%;
	.container-calendar{
		width: 100%;
		@include flex();
		flex-direction: column;
		padding: 0 60rpx;
		background-color: #FFFFFF;
		.calendar-title{
			@include flex($hov:center);
			height: 70rpx;
			.title-name{
				font-size: 34rpx;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: 400;
				color: #333333;
			}
			.title-month{
				font-size: $fontSize04;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				color: #b3b3b3;
				margin-left: 20rpx;
			}
		}
	}
	.container-record{
		width: 100%;
		margin-top: 40rpx;
		padding: 0 30rpx;
		background-color: #FFFFFF;
		.record-title{
			display: flex;
			align-items: center;
			height: 60rpx;
			.title-name{
				font-size: $fontSize04;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: 400;
				color: #333333;
				margin-left: 20rpx;
			}
		}
		.record{
			margin:20rpx 10rpx 0 10rpx;
			.record-item{
				margin-bottom: 80rpx;
				.item-time{
					display: flex;
					align-items: center;
					font-size: $fontSize03;
					font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
					font-weight: 400;
					color: #303133;
					.time-tip{
						@include flex($hov:center);
						margin-left: 20rpx;
						width: 68rpx;
						height: 32rpx;
						border: 2rpx solid #1481ff;
						border-radius: 10rpx;
						font-size: 20rpx;
						font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
						font-weight: 400;
						color: #1481ff;
					}
				}
				.item-title{
					height: 60rpx;
					display: flex;
					align-items: center;
					font-size: $fontSize04;
					font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
					font-weight: 400;
					color: #909399;
					.title{
						margin-left: 10rpx;
					}
				}
				.item-content{
					display: flex;
					align-items: center;
					height: 50rpx;
					.content-time{
						font-size: $fontSize04;
						font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
						font-weight: 400;
						color: #909399;
						.time-name{
							margin-left: 20rpx;
						}
						.time-date{
							margin-left: 20rpx;
							color: #0099ff;
						}
					}
				}
				.item-img{
					width: 200rpx;
					height: 200rpx;
					margin-top: 10rpx;
					border-radius: 10rpx;
					overflow: hidden;
				}
			}
		}
	}
}
.magnification{
	@include flex($hov:center);
	width: 100vw;
	min-height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	background-color: rgba($color: #000000, $alpha: .5);
	image{
		width: 640rpx;
		height: 480rpx;
	}
}
</style>
