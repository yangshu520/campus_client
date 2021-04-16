<template>
	<view>
		<view class="container">
			<!-- 搜索 -->
			<common-search 
			inpType="number"
			placeName="请输入手机号查找信息"
			@comfirm = "comfirm"/>
			<!-- tab栏 -->
			<view class="container-tab">
				<block v-for="(item,index) in ['全部','未读']" :key="index">
					<view class="tab-name" @click="tabChange(index)">
						<view class="name" :class="selectTabIdx == index?'select-name':''">{{item}}</view>
					</view>
				</block>
			</view>
			<!-- 列表 -->
			<view class="container-list">
				<uni-swipe-action>
					<uni-swipe-action-item style="background-color: #f5f5f5;" v-for="(item,index) in selectTabIdx?smsList:smsListAll" :key="index">
						<view class="list-item" @click="smsDateil(item.smsRecordList)">
							<view class="item-img">
								<view class="img-box">
									<image src="/static/img/home/avter.png" mode="aspectFill" />
								</view>
								<view class="img-noread" v-show="item.noRead">{{item.noRead}}</view>
							</view>
							<view class="item-content">
								<view class="content-phone">{{item.phone}}</view>
								<view class="content-dateil">{{item.smsRecordList | getContent}}</view>
							</view>
							<view class="item-time">{{item.smsRecordList | formatTime}}</view>
						</view>
						<template v-slot:right>
							<view class="right-box">
								<view class="box-editor" @click="deleteDate(item.phone,index)">
									<image src="/static/img/parent/delete-bg.png" mode="aspectFill" />
								</view>
							</view>
						</template>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
			<!-- 没有数据 -->
			<common-empty :noData="selectTabIdx?!smsList.length:!smsListAll.length" />
		</view>
	</view>
</template>

<script>
	import {
	getOperatorId,
	getCardParam,
	readSmsDate,
	deleteSmsDate,
	getSmsDate
	} from "@/common/httpApi/cardHttpApi.js"
	import commonSearch from "@/components/common-search.vue"
	export default {
		components:{commonSearch},
		data() {
			return {
				selectTabIdx: 0,
				smsList:[],
				smsListAll:[]
			};
		},
		onLoad(options) {
			this.getInitDate(options)
		},
		onShow() {
			if(this.imei){
				const data = {imei:this.imei};
				this.getInitDate(data);
			}
		},
		methods:{
			async getInitDate(option){
				// 存一下数据
				this.operatorId = getOperatorId();
				this.imei = option.imei;
				const {status} = await getCardParam(option.imei);
				this.status = status;
				const smsList = await getSmsDate({imei:option.imei});
				this.smsList = smsList.filter(item => item.noRead);
				this.smsListAll = smsList;
			},
			// 删除短信
			async deleteDate(val,idx){
				uni.showModal({
					title:"删除短信操作",
					content:"确定删除该号码下面所有短信吗?",
					success:async (res)=>{
						if(res.confirm){
							const data = {
								imei:this.imei,
								phone:val
							};
							const cardDate = await deleteSmsDate(this.status,data);
							if(cardDate){
								this.smsList.splice(idx,1);
								this.smsListAll.splice(idx,1);
								this.$Q.tipUrl({tip:'删除成功'});
							}
						}
					}
				});
			},
			// 搜索短信
			async comfirm({val}){
				const smsList = await getSmsDate({imei:this.imei,phone:val});
				if(smsList){
					this.smsList = smsList.filter(item => item.noRead);
					this.smsListAll = smsList;
				}
			},
			// tab栏切换
			tabChange(idx){
				this.selectTabIdx = idx;
			},
			async smsDateil(val){
				if(val.length){
					for(var i = 0;i < val.length;i++){
						readSmsDate(val[i].id);
					}
					uni.setStorageSync('smsDate',val);
					uni.navigateTo({
						url:"/parent/security/information-detail"
					})
					return
				}
				this.$Q.tipUrl({tip:"数据异常,联系客服"});
				
			}
		},
		filters:{
			getContent(val){
				if(val.length && val[0].content){
					return val[0].content
				}
				return '暂无内容'
			},
			formatTime(val){
				if(val.length && val[0].sendTimeStamp){
					const timeStamp = val[0].sendTimeStamp*1000;
					const date = new Date(timeStamp);
					const y = date.getFullYear();
					const m = date.getMonth()+1;
					const d = date.getDate();
					return y+'/'+m+'/'+d;
				}
				return '暂无'
			}
		}
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	.container-tab{
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #f5f5f5;
		padding: 0 36rpx;
		.tab-name{
			width: 120rpx;
			height: 100%;
			display: flex;
			align-items: center;
			.name{
				height: 100%;
				@include flex($hov:center);
				font-size: $fontSize03;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				color: #999999;
				letter-spacing: 2rpx;
				&.select-name{
					color: #15a2d4;
					border-bottom: 2rpx solid #6ebcdf;
				}
			}
		}
	}
	.container-list{
		.list-item{
			background-color: #FFFFFF;
			width: 100vw;
			height: 160rpx;
			@include flex();
			border-bottom: 2rpx solid #f5f5f5;
			padding: 0 20rpx;
			.item-img{
				width: 112rpx;
				height: 112rpx;
				position: relative;
				.img-box{
					width: 112rpx;
					height: 112rpx;
					border-radius: 50%;
					overflow: hidden;
				}
				.img-noread{
					position: absolute;
					right: 0;
					top: 0;
					background-color: #ff0000;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					@include flex($hov:center);
					color: #FFFFFF;
					font-size: 20rpx;
				}
			}
			.item-content{
				flex: 1;
				margin-left: 40rpx;
				letter-spacing: 2rpx;
				.content-phone{
					font-size: $fontSize01;
					font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
					font-weight: 500;
					color: #010101;
					max-width: 400rpx;
					@include textEllipsis();
				}
				.content-dateil{
					font-size: $fontSize03;
					font-family: SourceHanSansCN Normal, SourceHanSansCN Normal-Normal;
					color: #999999;
					max-width: 430rpx;
					@include textEllipsisTwo();
				}
			}
			.item-time{
				font-size: $fontSize04;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				color: #999999;
			}
		}
	}
	.right-box{
		height: 100%;
		width: 140rpx;
		@include flex($hov:center);
		.box-editor{
			width: 100rpx;
			height: 100rpx;
		}
	}
}
</style>
