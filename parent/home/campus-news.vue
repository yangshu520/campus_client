<template>
	<view>
		<view class="container">
			<!-- tab start -->
			<view class="container-tab" v-show="newsTabList.length">
				<view class="tab-item" 
				v-for="(item,index) in newsTabList" 
				:key="index">
					<view class="item-name"
					 @click="newsTab(index,item.id)"
					:class="newsTabIdx == index?'select-name':''">
						{{item.typeName}}
					</view>
				</view>
			</view>
			<!-- end -->
			<!-- swiper start -->
			<view class="container-swiper" v-show="swiperList.length">
				<swiper class="swiper"
				:circular="true"
				:autoplay="true" 
				:interval="2000" 
				:duration="1000">
					<swiper-item v-for="(item,index) in swiperList" :key="index">
						<view class="swiper-item" @click="newsDateil(item)">
							<u-image width="100vw" 
							height="350rpx" 
							mode="aspectFill"
							:src="item.messageTopImg">
								<u-loading slot="loading"></u-loading>
							</u-image>
							<view class="item-name">
								<view class="name">
									{{item.messageTitle}}
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- end -->
			<!-- hot start -->
			<view class="container-hot" v-show="hotNewsList.length">
				<view class="hot">
					<view class="hot-top">
						<u-image width="24rpx"
						height="28rpx" 
						mode="aspectFill"
						src="/static/img/home/news-hot-icon.png">
							<u-loading slot="loading"></u-loading>
						</u-image>
						<view class="top-title">热门精选</view>
					</view>
					<view class="hot-item" v-for="(item,index) in hotNewsList" :key="index">
						<view class="item-name">
							{{item.messageTitle}}
						</view>
						<view class="item-img">
							<image 
							mode="aspectFill"
							src="/static/img/home/news-hot-icon1.png"
							/>
						</view>
					</view>
				</view>
			</view>
			<!-- end -->
			<!-- content start -->
			<view class="container-content" v-show="newsDataList.length">
				<view class="content-item" 
				@click="newsDateil(item)"
				v-for="(item,index) in newsDataList" 
				:key="index">
					<view class="item-title">{{item.messageTitle}}</view>
					<view class="item-img" v-if="item.messageTopImg">
						<image 
						mode="aspectFill"
						:src="item.messageTopImg"
						/>
					</view>
					<view class="item-btm">
						<text class="btm-auther">
							{{item.createUser && item.createUser.nickName}}
						</text>
						<text class="btm-time">
							{{item.updateDate && item.updateDate.substr(5,5)}}
						</text>
					</view>
				</view>
				<view class="content-tip">{{tipTitle}}</view>
			</view>
			<!-- end -->
			<common-empty :noData="!newsDataList.length" />
		</view>
	</view>
</template>

<script>
	import {
		getMationList,
		getMationType,
		getSwiperList
	} from "@/common/httpApi/homeHttpApi.js"
	export default {
		data() {
			return {
				swiperList:[],
				newsTabList:[],
				newsDataList:[],
				hotNewsList:[
					{
						messageTitle:"国家统计局：9月份CPI同比涨幅略有扩大，水果蔬菜价格下降"
					},
					{
						messageTitle:"我国首座公铁两用跨海大桥即将贯通"
					},
					{
						messageTitle:"首届“科学探索奖”获奖名单出炉，50位获奖人揭晓"
					}
				],
				newsTabIdx: 0,
				typeId:null,
				page:1,
				limit:10,
				tipTitle:"没有啦"
			};
		},
		onLoad() {
			this.getInitDate();
		},
		onReachBottom() {
			this.getReachDate();
		},
		methods:{
			// 获取初始胡数据
			async getInitDate(){
				this.newsTabList = await getMationType();
				this.swiperList = await getSwiperList();
				this.typeId = this.newsTabList[0].id;
				this.newsDataList = await this.getDateList(this.typeId);
				this.getTip(this.newsDataList);
			},
			// 根据typeId获取对应信息列表
			async getDateList(val){
				const data = {
					typeId: val,
					page: String(this.page),
					limit: String(this.limit)
				}
				return await getMationList(data);
			},
			async newsTab(idx,val){
				this.newsTabIdx = idx;
				this.page = 1;
				this.typeId = val;
				this.newsDataList = await this.getDateList(val);
				this.getTip(this.newsDataList);
			},
			getTip(val){
				if(val.length && val.length % 10 == 0){
					this.tipTitle = "下拉加载更多数据"
				}else{
					this.tipTitle = "没有啦"
				}
			},
			async getReachDate(){
				if(this.newsDataList.length % 10 != 0) return;
				
				this.page ++;
				this.tipTitle = "数据获取中..."
				const newsDateList = await this.getDateList(this.typeId);
				this.getTip(newsDateList)
				if(newsDateList.length){
					this.newsDataList = this.newsDataList.concat(newsDateList);
				}else{
					this.$Q.tipUrl({tip:"没有更多数据啦"})
				}
			},
			// 查看详情
			newsDateil(val){
				uni.setStorageSync("newsDate",val);
				uni.navigateTo({
					url:"/parent/home/campus-dateil"
				})
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
	.container-tab{
		width: 100%;
		height: 70rpx;
		background-color: #FFFFFF;
		@include flex();
		padding: 0 46rpx;
		.tab-item{
			@include flex($hov:center);
			.item-name{
				height: 50rpx;
				font-size: $fontSize03;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				color: #5a5a5a;
				letter-spacing: -2rpx;
				&.select-name{
					border-bottom: 4rpx solid #e60012;
					color: #e60012;
				}
			}
		}
	}
	.container-swiper{
		width: 100%;
		height: 350rpx;
		background-color: #FFFFFF;
		.swiper{
			width: 100%;
			height: 350rpx;
			.swiper-item{
				width: 100%;
				height: 350rpx;
				position: relative;
				.item-name{
					position: absolute;
					bottom: 0;
					left: 0;
					background-color: rgba(#000000,.5);
					width: 100%;
					height: 50rpx;
					display: flex;
					align-items: center;
					padding: 0 30rpx;
					.name{
						max-width: 100%;
						font-size: $fontSize04;
						color: #FFFFFF;
						letter-spacing: 2rpx;
						@include textEllipsis();
					}
				}
			}
		}
	}
	.container-hot{
		width: 100%;
		background-color: #FFFFFF;
		padding: 30rpx;
		border-bottom: 2rpx solid #f5f5f5;
		.hot{
			width: 100%;
			.hot-top{
				display: flex;
				align-items: center;
				width: 100%;
				height: 60rpx;
				border-bottom: 2rpx solid #bfbfbf;
				.top-title{
					flex: 1;
					padding-left: 20rpx;
					max-width: 660rpx;
					@include textEllipsis();
				}
			}
			.hot-item{
				display: flex;
				align-items: center;
				width: 100%;
				.item-name{
					font-size: $fontSize04;
					font-family: zihun59hao chuangcuhei, zihun59hao chuangcuhei-chuangcuhei;
					color: #5a5a5a;
					line-height: 50rpx;
					padding-right: 20rpx;
					max-width: 660rpx;
					@include textEllipsis();
				}
				.item-img{
					width: 28rpx;
					height: 14rpx;
				}
			}
		}
	}
	.container-content{
		width: 100%;
		.content-item{
			width: 100%;
			margin-bottom: 20rpx;
			background-color: #FFFFFF;
			padding: 20rpx 30rpx 0 30rpx;
			.item-title{
				font-size: $fontSize02;
				text-align: left;
				color: #1a1a1a;
				font-family: 59 -Regular, 59 -Regular--Regular;
				font-weight: -Regular;
				width: 100%;
				line-height: 45rpx;
				@include textEllipsisTwo($row:3);
			}
			.item-img{
				margin-top: 10rpx;
				height: 380rpx;
				width: 100%;
				border-radius: 10rpx;
				overflow: hidden;
			}
			.item-btm{
				font-size: 22rpx;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				text-align: left;
				color: #666666;
				line-height: 30px;
				opacity: 0.65;
				.btm-time{
					margin-left: 20rpx;
				}
			}
		}
		.content-tip{
			background-color: #f5f5f5;
			width: 100%;
			height: 50rpx;
			font-size: 22rpx;
			font-family: Source Han Sans CN Light, Source Han Sans CN Light-Light;
			font-weight: 300;
			color: #999999;
			@include flex($hov:center);
		}
	}
}
</style>
