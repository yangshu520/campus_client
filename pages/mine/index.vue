<template>
	<view>
		<view class="container">
			<view class="container-top">
				<view class="top-img">
					<image mode="aspectFill" :src="wxAvter" />
				</view>
				<view class="top-content">
					<view class="content-name">
						{{childreList | getChildrenName}}
					</view>
					<view class="content-phone">
						{{childreList | getChildrenPhone}}
					</view>
				</view>
				<!-- <view class="top-right">
					<image mode="aspectFill" src="/static/img/home/forward-button.png" />
				</view> -->
			</view>
			<view class="container-main">
				<view class="main-func main-one">
					<view class="func-img">
						<image mode="aspectFill" src="/static/img/home/mine-babay.png">
					</view>
					<view class="func-title">我的宝贝</view>
					<scroll-view scroll-with-animation="true" scroll-x="true" class="func-icon">
						<view v-show="childreList.length < 10" class="icon-add" @click="addBabay">
							<image mode="aspectFill" src="/static/img/home/icon-babay-add.png" />
						</view>
						<view class="icon-add" @click="switchStudent(item)" v-for="(item,index) in childreList" :key="index">
							<image mode="aspectFill" :src="item.iconLink || '/static/img/home/avter.png'" />
						</view>
					</scroll-view>
				</view>
				<!-- 功能项 -->
				<view class="main-item">
					<view @click="funcItem(item)" class="main-func" v-for="(item,index) in funcList" :key="index">
						<view class="func-img">
							<image mode="aspectFill" :src="item.imgUrl">
						</view>
						<view class="func-title">{{item.title}}</view>
						<view class="func-phone" v-if="item.type == 2">{{telPhone}}</view>
						<view class="func-right" v-else>
							<image mode="aspectFill" src="/static/img/home/forward-button.png" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getChilderList,setSwicthStudent,getFieldList} from "@/common/httpApi/boundHttpApi.js"
	import {commonTelPhone} from "@/common/httpApi/comhttpApi.js"
	export default {
		data() {
			return {
				funcList:[
					{
						type:1,
						title:"功能介绍",
						pages:"/pages/mine/instruction-use",
						imgUrl:"/static/img/home/instruction-use.png",
					},
					{
						type:1,
						title:"意见反馈",
						pages:"",
						imgUrl:"/static/img/home/advice-feedback.png",
					},
					{
						type:1,
						title:"关于我们",
						pages:"/pages/mine/about-mine",
						imgUrl:"/static/img/home/about-mine.png",
					},
					{
						type:2,
						title:"联系客服",
						tel: this.telPhone,
						imgUrl:"/static/img/home/contact-mine.png",
					},
					{
						type:1,
						title:"角色切换",
						pages:"/pages/mine/switch-roleType",
						imgUrl:"/static/img/home/switch-type.png",
					}
				],
				parentId:null,
				roleType:null,
				childreList:[],
				wxAvter:"/static/img/home/avter.png",
				telPhone:"18285104102",
			};
		},
		onLoad() {
			this.getInitDate();
			this.getCompney();
		},
		methods:{
			// 初始化数据
			getInitDate(){
				try{
					const roleType = uni.getStorageSync("roleType");
					this.roleType = roleType;
					if(roleType == -1){
						this.checkBoundAccount(roleType)
						return;
					}else if(roleType == 1){
						// 做家长事情的方法
						this.getParentFun();
					}else{
						this.getInitDate();
					}
				}catch(e){
					//TODO handle the exception
					console.log("我的页面初始化数据出错"+e)
				}
			},
			// 家长做的事情
			async getParentFun(){
				try{
					const wxDate = uni.getStorageSync("wxUserInfo");
					const parentId = uni.getStorageSync("parentId");
					if(wxDate && parentId){
						this.wxAvter = wxDate.headImgUrl;
						const backList = await getChilderList(parentId);
						if(backList.length){
							this.childreList = backList.filter(item => item.studentId && item.studentParentId && item.student).sort(item => item.loginFlag);
						}else{
							// 获取到的数据是空数组
							this.$Q.tipUrl({
								tip:"学生数据为空,重新绑定",
								url:"/parent/home/add-baby"
							})
						}
					}else{
						this.getParentFun();
					}
				}catch(e){
					//TODO handle the exception
					console.log("获取数据错误"+e)
				}
			},
			// 功能项的点击
			funcItem(date){
				if(date.type == 2){
					commonTelPhone(this.telPhone == '暂无'?'':this.telPhone);
					return;
				}
				if(date.type == 1){
					if(!date.pages){
						this.$Q.tipUrl({tip:"此功能暂未开放"});
						return;
					}
					uni.navigateTo({
						url:date.pages
					})
				}
			},
			// 添加宝贝
			addBabay(){
				if(this.checkBoundAccount()) return;
				
				if(this.childreList.length >= 10){
					this.$Q.tipUrl({tip:"只能绑定10个学生"});
					return
				}
				uni.navigateTo({
					url:"/parent/home/add-baby"
				})
			},
			// 切换学生
			async switchStudent(data){
				const date = {
					parentId:data.studentParentId,
					studentId:data.studentId
				}
				const bankRes = await setSwicthStudent(date);
				if(bankRes){
					uni.setStorageSync("userId",data.student.userId);
					uni.setStorageSync("student",data.student);
					this.$Q.tipUrl({
						tip:"切换成功",
						url:"/pages/index/index",
						isTab:true
					});
					uni.removeStorageSync("cardDate");
				}
			},
			// 获取公司电话
			async getCompney(){
				try{
					const backDate = await getFieldList('staffService',false);
					if(backDate.length){
						this.telPhone = backDate[0].code || "暂无";
					}else{
						this.telPhone = "暂无"
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			// 检测是否绑定账号
			checkBoundAccount(roleType){
				if(this.roleType == -1 || roleType == -1){
					this.$Q.tipUrl({
						tip:"检测未绑定账号",
						url:"/parent/home/select-role"
					});
					return true;
				}
				return false
			}
		},
		filters:{
			getChildrenName(date){
				if(date[0]&&date[0].studentParent&&date[0].studentParent.parentName){
					return date[0].studentParent.parentName
				}else{
					return "检测暂未绑定"
				}
			},
			getChildrenPhone(date){
				if(date[0]&&date[0].studentParent&&date[0].studentParent.parentPhone){
					return date[0].studentParent.parentPhone
				}else{
					return "检测暂未绑定"
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
	.container-top{
		display: flex;
		align-items: center;
		width: 100vw;
		height: 200rpx;
		background-image: url("/static/img/home/mine-bg.png");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		padding: 0 32rpx;
		.top-img{
			width: 120rpx;
			height: 120rpx;
			overflow: hidden;
			border-radius: 20rpx;
		}
		.top-content{
			flex: 1;
			@include textEllipsis();
			padding-left: 20rpx;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
			.content-name{
				font-size: $fontSize01;
				font-weight: 400;
				color: #ffffff;
				line-height: 72rpx;
			}
			.content-phone{
				font-size: $fontSize03;
				color: #7ebafe;
			}
		}
		.top-right{
			width: 19rpx;
			height: 27rpx;
		}
	}
	.container-main{
		width: 100vw;
		@include flex($hov:center);
		flex-direction: column;
		padding: 0 20rpx;
		.main-item{
			background-color: #FFFFFF;
			border-radius: 16rpx;
			overflow: hidden;
			width: 100%;
		}
		.main-func{
			height: 112rpx;
			width: 100%;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #f5f5f5;
			.func-img{
				margin-left: 36rpx;
				width: 52rpx;
				height: 52rpx;
				overflow: hidden;
				border-radius: 50%;
			}
			.func-title{
				margin-left: 26rpx;
				font-size: 30rpx;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				color: #8a8a8a;
				letter-spacing: 2rpx;
				flex: 1;
			}
			.func-icon{
				width: 340rpx;
				height:64rpx;
				padding-right: 30rpx;
				@include comomSlide();
				.icon-add{
					width: 63rpx;
					height: 64rpx;
					display: inline-block;
					overflow: hidden;
					border-radius: 50%;
					margin-right: 24rpx;
				}
			}
			
			.func-phone{
				font-size: 30rpx;
				color: #3cb2ef;
				margin-right: 24rpx;
			}
			.func-right{
				width: 16rpx;
				height: 24rpx;
				margin-right: 24rpx;
			}
		}
		.main-one{
			margin-top: 26rpx;
			margin-bottom: 20rpx;
			border-radius: 12rpx;
			overflow: hidden;
		}
	}
}
</style>
