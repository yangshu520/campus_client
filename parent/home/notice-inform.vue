<template>
	<view>
		<view class="container">
			<!-- 搜索 -->
			<common-search 
			:boxStylePad=" newsType == 1 ? 20 : 0"
			placeName="请输入消息标题查找"
			@comfirm = "comfirm"/>
			<!-- tab栏 -->
			<view class="container-tab" v-if="newsType == 2">
				<view v-for="(item,index) in newsTabList" 
				:key="index" 
				:class="newsTabIdx == index?'select-name':''" 
				class="tab-name" 
				@click="selectTab(index,item.typeCode)">
					{{item.typeName}}
				</view>
			</view>
			<!-- 作业列表数据 -->
			<view class="container-home">
				<view class="home-item" @click="navToDateil(item)" v-for="(item,index) in newsList" :key="index">
					<view class="item-title">
						<view class="title-img">
							<image src="/static/img/home/notice-icon.png" mode="aspectFill"/>
						</view>
						<view class="title-name">{{item.messageTitle}}</view>
						<view class="title-time">{{item.createDate | getTime }}</view>
					</view>
					<view class="item-content">
						<view class="content-name">
							{{item.messageContent | getContent}}
						</view>
					</view>
					<view class="item-other">
						<view class="other">
							<view class="other-time">
								<text>{{item.sendAreaCode.length < 10?'通知范围':'通知班级'}}:</text>
								<text class="time">{{item.sendAreaName}}</text>
							</view>
							<view class="other-time">
								<text>通知对象:</text>
								<text class="time">{{item.sendRole}}</text>
							</view>
							<view class="other-time">
								<text>发布者:</text>
								<text class="time">{{item.sendUser && item.sendUser.nickName}}</text>
							</view>
						</view>
						<view class="other-img">
							<image src="/static/img/home/forward-button.png" mode="aspectFill"/>
						</view>
					</view>
				</view>
			</view>
			<common-empty :noData="!newsList.length"/>
			<!-- 到底了 -->
			<view class="container-btm" v-show="newsList.length">{{tipTitle}}</view>
		</view>
	</view>
</template>

<script>
	import {
		getNewsBar,
		getNewsDate
	} from "@/common/httpApi/homeHttpApi.js"
	import commonSearch from "@/components/common-search.vue"
	export default {
		components:{commonSearch},
		data() {
			return {
				newsTabList:[],
				newsList:[],
				newsTabIdx: 0,
				studentId:null,
				parentId:null,
				newsType:null,
				searchTitle:"",
				typeCode:'',
				page: 1,
				limit: 10,
				// 提示
				tipTitle:"没有啦"
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		onReachBottom() {
			this.getPullDate();
		},
		methods:{
			// 数据初始化好
			getInitDate(option){
				this.studentId = option.studentId || uni.getStorageSync("student").id;
				this.parentId = uni.getStorageSync("parentId");
				this.newsType = option.newsType; //1 班级通知 2学校通知
				this.getNewsBar(option.newsType);
			},
			// 获取菜单栏
			async getNewsBar(val){
				const homeDate = await getNewsBar();
				if(homeDate.length){
					// 班级通知
					let homeFil = [];
					if(val == 1){
						uni.setNavigationBarTitle({title: '班级通知'});
						homeFil = homeDate.filter(item => item.typeName == "班级通知");
					}else if(val == 2){
						homeFil = homeDate.filter(item => item.typeName == "学校通知" || item.typeName == "部局通知");
					}
					if(homeFil.length){
						this.newsTabList = homeFil;
						this.typeCode = homeFil[0].typeCode;
						this.newsList = await this.getNewsList(this.typeCode);
						this.getTip(this.newsList);
					}else{
						this.$Q.tipUrl({tip:"获取通知tab失败,联系客服"});
					}
				}
			},
			// 获取消息列表
			async getNewsList(val){
				const data = {
					studentId: this.studentId,
					parentId: this.parentId,
					typeCode: val,
					messageTitle: this.searchTitle,
					page: String(this.page),
					limit: String(this.limit)
				};
				return await getNewsDate(data);
			},
			// 搜索
			async comfirm({val}){
				this.searchTitle = val;
				this.page = 1;
				this.newsList = await this.getNewsList(this.typeCode);
				this.getTip(this.newsList);
			},
			// 切换tab栏
			async selectTab(idx,code){
				this.newsTabIdx = idx;
				this.typeCode = code;
				this.page = 1;
				this.newsList = await this.getNewsList(code);
				this.getTip(this.newsList);
			},
			// 查看详情
			navToDateil(val){
				uni.navigateTo({
					url:"/parent/home/work-dateil?dateType=2"
				});
				uni.setStorageSync("newsDateil",val);
			},
			// 下拉刷新
			async getPullDate(){
				if(this.newsList.length % 10 != 0) return;
				this.page ++;
				this.tipTitle = "数据获取中..."
				const newsList = await this.getNewsList(this.typeCode);
				this.getTip(newsList)
				if(newsList.length){
					this.newsList = this.newsList.concat(newsList);
				}else{
					this.$Q.tipUrl({tip:"没有更多数据啦"})
				}
			},
			getTip(val){
				if(val.length && val.length % 10 == 0){
					this.tipTitle = "下拉加载更多数据"
				}else{
					this.tipTitle = "没有啦"
				}
			},
		},
		filters:{
			getTime(val){
				if(val){
					return val.substr(5,5);
				}
				return '暂无时间'
			},
			getContent(val){
				if(val){
					return val.replace(/<[^>]+>/g,"").replace(/nbsp;/g,"").replace(/&/g,"");
				}
				return "暂无内容"
			},
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
			height: 356rpx;
			margin-top: 20rpx;
			.item-title{
				width: 100%;
				height: 82rpx;
				@include flex();
				padding: 0 30rpx;
				border-bottom: 2rpx solid #f5f5f5;
				.title-time{
					font-size: $fontSize04;
					font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
					color: #999999;
				}
				.title-name{
					flex: 1;
					font-size: 34rpx;
					font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
					font-weight: 500;
					text-align: left;
					color: #121212;
					margin-left: 24rpx;
					max-width: 500rpx;
					@include textEllipsis();
				}
				.title-img{
					width: 44rpx;
					height: 44rpx;
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
				height: 148rpx;
				@include flex();
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
				.other-img{
					width: 16rpx;
					height: 28rpx;
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