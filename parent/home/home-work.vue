<template>
	<view>
		<view class="container">
			<!-- 搜索 -->
			<common-search 
			@comfirm = "comfirm"
			placeName="请输入作业标题查找"
			:boxStylePad="20"/>
			<!-- tab栏 -->
			<!-- <view class="container-tab" >
				<view v-for="(item,index) in ['今日作业','历史作业']" 
				:key="index" 
				:class="selectTabIdx == index?'select-name':''" 
				class="tab-name" 
				@click="selectTab(index)">
					{{item}}
				</view>
			</view> -->
			<!-- 作业列表数据 -->
			<view class="container-home" v-show="assignList.length">
				<view class="home-item" @click="navToDateil(item)" v-for="(item,index) in assignList" :key="index">
					<view class="item-title">
						<view class="title-subject" :style="item.subjectName | getSubSty">{{item.subjectName | getSubject}}</view>
						<view class="title-name">{{item.assignmentName}}</view>
						<view class="title-img">
							<image src="/static/img/home/forward-button.png" mode="aspectFill"/>
						</view>
					</view>
					<view class="item-content">
						<view class="content-name">
							{{item.assignmentContent | getContent}}
						</view>
					</view>
					<view class="item-other">
						<view class="other-time">
							<text>发布者:</text>
							<text class="time">{{item.userName}}</text>
						</view>
						<view class="other-time">
							<text>时&nbsp;&nbsp;&nbsp;间:</text>
							<text class="time">{{item.createDate | getTime}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 没事数据 -->
			<common-empty :noData="!assignList.length" />
			<!-- 到底了 -->
			<view class="container-btm" v-show="assignList.length">{{tipTitle}}</view>
		</view>
	</view>
</template>

<script>
	import {
		getAssginList
	} from "@/common/httpApi/homeHttpApi.js"
	import commonSearch from "@/components/common-search.vue"
	export default {
		components:{commonSearch},
		data() {
			return {
				assignList:[],
				selectTabIdx: 0,
				subjectId: '',
				searchName: '',
				classesId: '',
				page: 1,
				limit: 10,
				tipTitle:"到底啦"
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		onReachBottom() {
			this.getReachDate();
		},
		methods:{
			async getInitDate(option){
				if(option.classesId){
					this.classesId = option.classesId;
				}else{
					const student = uni.getStorageSync("student");
					this.classesId = student && student.classesId || null;
				}
				this.assignList = await this.getAssginDate(this.classesId);
				this.getTip(this.assignList);
			},
			// 需要多次调用获取数据  则封装出来
			async getAssginDate(classesId){
				const data = {
					classesId: classesId,
					subjectId:this.subjectId,
					assignmentName:this.searchName,
					page: String(this.page),
					limit: String(this.limit)
				}
				const homeDate = await getAssginList(data);
				if(homeDate){
					return homeDate;
				}
				return [];
			},
			// 搜索
			async comfirm({val}){
				this.page = 1;
				this.searchName = val;
				this.assignList = await this.getAssginDate(this.classesId);
				this.getTip(this.assignList);
			},
			// 切换tab栏
			selectTab(idx){
				this.selectTabIdx = idx;
			},
			// 查看详情
			navToDateil(val){
				uni.navigateTo({
					url:"/parent/home/work-dateil?dateType=1"
				});
				uni.setStorageSync("workDateil",val);
			},
			getTip(val){
				if(val.length && val.length % 10 == 0){
					this.tipTitle = "下拉加载更多数据"
				}else{
					this.tipTitle = "没有啦"
				}
			},
			async getReachDate(){
				if(this.assignList.length % 10 != 0) return;
				
				this.page ++;
				this.tipTitle = "数据获取中..."
				const assginList = await this.getAssginDate(this.classesId);
				this.getTip(assginList)
				if(assginList.length){
					this.assignList = this.assignList.concat(assginList);
				}else{
					this.$Q.tipUrl({tip:"没有更多数据啦"})
				}
			}
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
			getContent(val){
				if(val){
					return val.replace(/<[^>]+>/g,"").replace(/nbsp;/g,"").replace(/&/g,"");
				}
				return "暂无内容"
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
page{
	background-color: #f5f5f5;
}
.container{
	.container-tab{
		width: 100%;
		display: flex;
		height: 90rpx;
		background-color: #FFFFFF;
		.tab-name{
			flex: 1;
			text-align: center;
			line-height: 90rpx;
			&.select-name{
				animation: all .5s;
				border-bottom: 4rpx solid #15A2D4;
				color: #15A2D4;
			}
		}
	}
	.container-home{
		width: 100%;
		padding: 0 20rpx;
		.home-item{
			width: 100%;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			height: 316rpx;
			margin-top: 20rpx;
			.item-title{
				width: 100%;
				height: 82rpx;
				@include flex();
				padding: 0 30rpx;
				border-bottom: 2rpx solid #f5f5f5;
				.title-subject{
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
					max-width: 552rpx;
					@include textEllipsis();
				}
				.title-img{
					width: 30rpx;
					height: 30rpx;
				}
			}
			.item-content{
				padding: 0 34rpx;
				width: 100%;
				height: 124rpx;
				line-height: 50rpx;
				font-size: $fontSize03;
				font-family: Microsoft YaHei Regular, Microsoft YaHei Regular-Regular;
				text-align: left;
				color: #333333;
				border-bottom: 2rpx solid #f5f5f5;
				letter-spacing: 2rpx;
				display: flex;
				align-items: center;
				.content-name{
					@include textEllipsisTwo();    
				}
			}
			.item-other{
				padding: 0 34rpx;
				width: 100%;
				height: 108rpx;
				display: flex;
				justify-content: center;
				flex-direction: column;
				.other-time{
					font-size: $fontSize04;
					font-family: Source Han Sans CN Light, Source Han Sans CN Light-Light;
					font-weight: 300;
					color: #999999;
					line-height: 40rpx;
					.time{
						color: #333333;
						margin-left: 20rpx;
					}
				}
			}
		}
	}
	.container-btm{
		font-size: $fontSize04;
		font-family: Source Han Sans CN Light, Source Han Sans CN Light-Light;
		font-weight: 300;
		color: #999999;
		line-height: 60rpx;
		margin-bottom: 40rpx;
		@include flex($hov:center);
		width: 100%;
		margin-top: 60rpx;
		letter-spacing: 2rpx;
	}
}
</style>
