<template>
	<view>
		<view class="container">
			<common-search 
			:boxStylePad="20"
			placeName="请输入号码或姓名查找"
			searchBgc="#fff"
			boxBgc="#f5f5f5"
			@comfirm = "searchFun"
			/>
			<!-- 家长通讯录列表 -->
			<view  v-if="dateType == 1 || dateType == 3">
				<view style="border-top: 10rpx solid #FFFFFF;height: 60rpx;" class="common-tip" v-if="parentList.length && dateType == 3">家长</view>
				<view class="container-item" v-for="(item,index) in parentList" :key="index">
					<view class="item-img">
						<image mode="aspectFill" src="/static/img/home/avter.png" />
					</view>
					<view class="item-name">
						<view>{{item.parent_name}}</view>
						<view style="font-size: 28rpx;color: #999999;line-height: 50rpx;">{{item.studentName}}</view>
					</view>
					<view class="item-iphone" @click="commonTelPhone(item.parent_phone)">
						<image mode="aspectFill" src="/static/img/home/adress-phone.png" />
					</view>
				</view>
			</view>
			<!-- 教师通讯录列表 -->
			<view  v-if="dateType == 0 || dateType == 3">
				<view class="common-tip"  v-if="tearList.length && dateType == 3">教师</view>
				<view class="container-item" v-for="(item,index) in tearList" :key="index">
					<view class="item-img">
						<image mode="aspectFill" src="/static/img/home/avter.png" />
					</view>
					<view class="item-name">{{item.nick_name}}</view>
					<view class="item-iphone" @click="commonTelPhone(item.tel)">
						<image mode="aspectFill" src="/static/img/home/adress-phone.png" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getPhoneDate} from "@/common/httpApi/boundHttpApi.js"
	import {commonTelPhone} from "@/common/httpApi/comhttpApi.js"
	import commonSearch from "@/components/common-search.vue"
	export default {
		components:{commonSearch},
		data() {
			return {
				parentList:[],
				tearList:[],
				searchName:null,
				dateType:null,
				studentId:null
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		methods:{
			async getInitDate(options){
				const title = options.dateType == 3?'通讯录':(options.dateType == 1?"家长联系人":"教师联系人");
				uni.setNavigationBarTitle({
					title:title
				});
				this.dateType = options.dateType;
				if(options.studentId){
					this.studentId = options.studentId;
					const bookDate = await getPhoneDate(options.studentId);
					this.parentList = bookDate.classesMaps;
					this.tearList = bookDate.teacherMap;
				}else{
					this.$Q.tipUrl({tip:"传输数据异常,重新进入"})
				}
			},
			// 拨打电话
			commonTelPhone(tel){
				commonTelPhone(tel);
			},
			// 搜索
			async searchFun({val}){
				const bookDate = await getPhoneDate(this.studentId,val);
				this.parentList = bookDate.classesMaps;
				this.tearList = bookDate.teacherMap;
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #efefef;
}
.container{
	.container-search{
		height: 98rpx;
		width: 100%;
		@include flex($hov:center);
		border-radius: 16rpx;
		overflow: hidden;
		.search-box{
			width: 680rpx;
			height: 70rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			@include flex($hov:center);
			input{
				flex: 1;
				text-align: center;
			}
		}
	}
	.container-item{
		background-color: #FFFFFF;
		width: 100%;
		height: 160rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		border-bottom: 2rpx solid #efefef;
		.item-img{
			width: 100rpx;
			height: 100rpx;
			overflow: hidden;
			border-radius: 50%;
		}
		.item-name{
			font-size: $fontSize01;
			font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
			color: #333333;
			margin-left: 40rpx;
			letter-spacing: 2rpx;
			flex: 1;
		}
		.item-iphone{
			width: 56rpx;
			height: 56rpx;
			margin-right: 10rpx;
		}
	}
}
.common-tip{
	height: 50rpx;
	line-height: 50rpx;
	font-size: $fontSize03;
	width: 100vw;
	color: #666666;
	padding-left: 20rpx;
	background-color: #efefef;
}
</style>
