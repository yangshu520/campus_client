<template>
	<view>
		<!-- 月周汇总 -->
		<view class="week">
			<view class="week-left">
				<!-- <text @click="weekTrue" :class="!isWeek?'isWeek':''" >周</text> -->
				<text @click="monthFalse" :class="isWeek?'isWeek':''" >月</text>
			</view>
			<view class="week-right">
				<view @click="back(0)" class="iconfont icon-arrowleft" style="font-size: 40rpx;color: #999999;"></view>
				<view class="right-name" v-show="isWeek">{{monthDate.replace(/-/g,'.')}}</view>
				<view class="right-name" v-show="!isWeek">
					<text>{{(lastWeek.substring(5)).replace(/-/g,'.')}}</text><text>—</text><text>{{(nextWeek.substring(5)).replace(/-/g,'.')}}</text>
				</view>
				<view @click="back(1)" class="iconfont icon-arrowright" style="font-size: 40rpx;color: #999999;"></view>
			</view>
		</view>
		<!-- 头像 -->
		<view class="avter-box">
			<view class="box-left">
				<view class="left-img">
					<u-image :src="avterImg" height="114rpx" width="114rpx">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="left-content">
					<view class="content-title">
						{{avterName}}
					</view>
					<view class="content-name">
						<text>{{avterSchoolName}}</text>
						<text style="margin-left: 20rpx;">{{avterClassesName}}</text>
					</view>
				</view>
			</view>
			<navigator class="box-right" url="/parent/home/attendance-record">
				<view class="right-img">
					<u-image src="/static/img/parent/record-icon.png" height="40rpx" width="40rpx">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="right-title">打卡月历</view>
			</navigator>
		</view>
		<!-- 出勤总次数 -->
		<!-- <view >
			attendCoun
		</view> -->
		<!-- 列表 -->
		<view class="count-list">
			<view class="list-item" v-for="(item,index) in countList" :key="index">
				<view class="item" @click="foldCount(item,index)">
					<view class="item-title">{{item.title}}</view>
					<view class="item-content">
						<view class="content-name">{{item.count}}次</view>
						<view class="content-img">
							<image src="/static/img/home/forward-button.png" mode="aspectFill" />
						</view>
					</view>
				</view>
				<view class="item-dateil" v-show="item.unfold">
					<view class="dateil" v-for="(item,index) in dateilList" :key="index">
						<view class="dateil-time">{{item.time | getTime}}</view>
						<view class="dateil-count">{{item.title}}</view>
					</view>
				</view>
			</view>
			<common-empty
			 boxWidth="100%"
			 :noData="!countList.length"
			 />
		</view>
	</view>
</template>

<script>
	import {
		getMonthAttend,
		getDateilAttend
	} from "@/common/httpApi/homeHttpApi.js"
	import {GET_STUDEN_INFO} from "@/common/js/apiUrl.js"
	var currentFirstDate;
	export default {
		data() {
			return {
				// 组件commonAvter的数据
				avterImg:"/static/img/home/avter.png",
				avterName:"Hello unbound",
				avterSchoolName:"暂未绑定家长账号",
				avterClassesName:null,
				studentId:null,
				// 默认显示月 是周还是月
				isWeek:true,
				// 月份数
				monthDate:'',
				// 上一周的时间
				lastWeek:'',
				// 下一周的时间
				nextWeek:'',
				// 列表数据统计
				countList:[],
				// 详情列表
				dateilList:[],
				// 月份数
				months:null
			};
		},
		onLoad(options){
			this.getInitDate(options);
		},
		methods:{
			async getInitDate(option){
				try{
					let stuStore
					if(option.userId){
						// 发请求 存数据
						const result = await this.$http.post(GET_STUDEN_INFO,{userId: option.userId});
						if(result.code == 0 && result.data){
							uni.setStorageSync("student",result.data.student);
							stuStore = result.data.student;
						}else{
							stuStore = uni.getStorageSync("student");
						}
					}else{
						stuStore = uni.getStorageSync("student");
					}
					this.studentId = stuStore.id || null;
					this.avterImg = stuStore["iconLink"] || this.avterImg;
					this.avterName = stuStore["studentName"] || this.avterName;
					this.avterSchoolName = stuStore["classes"]["schoolName"] || this.avterSchoolName;
					this.avterClassesName = stuStore["classes"]["classesName"] || this.avterClassesName;
					// 初始化当前日期
					this.initMonth();
					// 获取周的时间
					// this.setDate(new Date());
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			// 点击周的时候
			weekTrue(){
				this.isWeek=false;
				this.getRequest(`${this.lastWeek}!${this.nextWeek}`,'');
			},
			// 点击月的时候
			monthFalse(){
				this.isWeek=true;
				this.getRequest('',this.monthDate);
			},
			// 默认获取当月 或 当周
			initMonth(){
				const date=new Date();
				const year=date.getFullYear();
				const month=date.getMonth()+1;
				this.monthDate=year+'-'+(month>=10?month:'0'+month);
				this.getRequest('',this.monthDate);
			},
			// 后退
			back(i){
				const isWeek = this.isWeek;
				if(!isWeek){ // 周
					if(i==0){
						this.setDate(this.addDate(currentFirstDate, -7));
						this.getRequest(`${this.lastWeek}!${this.nextWeek}`,'');
					}else if(i==1){
						const newTimes = (new Date()).getTime();
						const nowTimes = (new Date(this.nextWeek)).getTime();
						if(newTimes < nowTimes){
							uni.showToast({
								icon:"none",
								title:"不能选择未来时间"
							});
							return;
						}
						this.setDate(this.addDate(currentFirstDate, 7));
						this.getRequest(`${this.lastWeek}!${this.nextWeek}`,'');
					}	
				}else{
					const monthDate=this.monthDate;
					const arr=monthDate.split('-');
					var year=parseInt(arr[0]);
					var month=parseInt(arr[1]);
					if(i==0){
						month--;
						if(month<10){
							month="0"+month;
							if(parseInt(month)<1){
								year--;
								month="12";
							}
						}
						this.monthDate=year+'-'+month
						this.getRequest('',this.monthDate);
					}else if(i==1){
						const newTimes=(new Date()).getTime();
						const monthDateArr=this.monthDate.split('-');
						const years=monthDateArr[0];
						const months=monthDateArr[1]-0+1;
						const monthDates=years+'-'+months;
						const nowTimes=(new Date(monthDates)).getTime();
						if(newTimes<nowTimes){
							uni.showToast({
								icon:"none",
								title:"不能选择未来时间"
							});
							return;
						}
						month++;
						if(month<10){
							month='0'+month;
						}else{
							if(parseInt(month)>12){
								year++;
								month="01"
							}
						}
						this.monthDate=year+'-'+month
						// console.log(this.monthDate)
						this.getRequest('',this.monthDate);
					}
				}
			},
			// 获取周的时间
			setDate(date) {            
				const week = date.getDay() - 1;
				date =this.addDate(date, week * -1);
				currentFirstDate = new Date(date);
				const weekArr=[]
				for (var i = 0; i < 7; i++) {
					weekArr.push(this.formatDate(i == 0 ? date :this.addDate(date, 1)));
				}
				this.lastWeek=weekArr[0];
				this.nextWeek=weekArr[weekArr.length-1];
			},
			addDate(date,n) {
				date.setDate(date.getDate() + n);
				return date;
			},
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1);
				const day = date.getDate();
				return year+'-' + (month>9?month:'0'+month) +'-'+ (day>9?day:'0'+day);
			},
			async foldCount(val,idx){
				if(val.count == 0){
					this.$Q.tipUrl({
						tip: val.title+'暂无数据',
						timeOut:1000,
					});
					return;
				}
				if(val.type == '0'){
					this.$Q.tipUrl({
						tip: val.title+'没有详细数据',
						timeOut:1000,
					});
					return;
				}
				
				this.countList.map((item,index)=>{
					if(index == idx){
						item.unfold = !item.unfold;
					}else{
						item.unfold = false;
					}
				});
				if(!this.countList[idx].unfold) return;
				const monthList = this.months.split('-');
				const data = {
					studentId: this.studentId,
					year:monthList[0],
					month:monthList[1],
					attendResult:val.type
				}
				const homeDate = await getDateilAttend(data);
				if(homeDate){
					this.dateilList = homeDate;
				}else{
					this.dateilList = [];
				}
				
			},
			async getRequest(week,month){
				this.months = month;
				const monthList = month.split('-');
				const data = {
					studentId: this.studentId,
					year:monthList[0],
					month:monthList[1],
				}
				const homeDate = await getMonthAttend(data);
				if(homeDate){
					this.countList = [
						{
							title:"正常", 
							unfold:false,
							count:homeDate.normalCount, 
							type:'1',
						},
						{
							title:"迟到", 
							unfold:false,
							count:homeDate.lateCount, 
							type:'2',
						},
						{
							title:"早退",
							unfold:false,
							count:homeDate.earlyCount,
							type:'3',
						},
						{
							title:"缺勤",
							unfold:false,
							count:homeDate.absenceCount,
							type:'0',
						},
						{
							title:"异常", 
							unfold:false,
							count:homeDate.aberrantCount, 
							type:'5',
						},
					]
				}
				else{
					this.countList = [];
					this.$Q.tipUrl({tip:"暂无数据"})
				}
			}
		},
		filters:{
			getLate(data){
				if(data==1){
					return '迟到'
				}else if(data==2){
					return '早退'
				}else if(data==3){
					return '异常'
				}
			},
			getTime(time){
				const data = new Date(time).getTime();
				const date = new Date(data);
				const year = date.getFullYear();
				const month = date.getMonth()+1;
				const day = date.getDate();
				const days = date.getDay();
				const hour = date.getHours();
				const minut = date.getMinutes();
				const weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
				const week = weeks[days];
				return year+'.'+(month>10?month:'0'+month)+'.'+(day>=10?day:'0'+day)+'   '+week;
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.count-list{
	width: 100%;
	margin-top: 10rpx;
	.list-item{
		width: 100%;
		.item{
			background-color: #FFFFFF;
			width: 100%;
			height: 88rpx;
			@include flex();
			padding: 0 30rpx;
			border-bottom: 2rpx solid #f5f5f5;
			font-family: Microsoft YaHei Regular, Microsoft YaHei Regular-Regular;
			.item-title{
				font-size: $fontSize02;
				font-weight: 400;
				color: #010101;
			}
			.item-content{
				display: flex;
				align-items: center;
				.content-name{
					font-size: $fontSize02;
					color: #999999;
					vertical-align: middle;
				}
				.content-img{
					margin-left: 20rpx;
					width: 24rpx;
					height: 26rpx;
				}
			}
		}
		.item-dateil{
			width: 100%;
			.dateil{
				width: 100%;
				height: 117rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				background-color: #f5f5f5;
				border-bottom: 2rpx solid #e6e4dc;
				font-family: Microsoft YaHei Regular, Microsoft YaHei Regular-Regular;
				font-weight: 400;
				.dateil-time{
					width: 100%;
					font-size: $fontSize02;
					color: #010101;
					line-height: 50rpx;
				}
				.dateil-count{
					width: 100%;
					font-size: $fontSize04;
					color: #999999;
				}
			}
		}
	}
}
.avter-box{
	width: 100%;
	height: 174rpx;
	@include flex();
	background-color: #FFFFFF;
	margin-top: 20rpx;
	padding: 0 30rpx;
	font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
	.box-left{
		display: flex;
		align-items: center;
		flex: 1;
		.left-img{
			width: 114rpx;
			height: 114rpx;
		}
		.left-content{
			margin-left: 20rpx;
			flex: 1;
			.content-title{
				font-size: $fontSize02;
				color: #000000;
				line-height: 60rpx;
			}
			.content-name{
				font-size: $fontSize04;
				color: #999999;
			}
		}
	}
	.box-right{
		display: flex;
		align-items: center;
		.right-img{
			width: 40rpx;
			height: 40rpx;
		}
		.right-title{
			margin-left: 20rpx;
			font-size: $fontSize04;
			color: #2988f6;
		}
	}
}
.week{
	padding: 0 46rpx;
	height: 88rpx;
	@include flex();
	font-size: $fontSize03;
	background-color: #FFFFFF;
	.week-left{
		color: #00a8ff;
		width: 100rpx;
		height: 52rpx;
		border-radius: 10rpx;
		border: 2rpx solid #00a8ff;
		overflow: hidden;
		text{
			display: inline-block;
			width: 100%;
			height: 100%;
			text-align: center;
			line-height: 48rpx;
		}
		.isWeek{
			background-color: #00a8ff;
			color: #FFFFFF;
		}
	}
	.week-right{
		width: 310rpx;
		height: 52rpx;
		@include flex();
		.right-name{
			color: #000000;
			font-family: $fontFamily01;
			text{
				font-family: $fontFamily01;
			}
		}
	}
}
</style>