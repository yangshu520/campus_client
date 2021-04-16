<template>
	<view>
		<view class="container">
			<view class="container-search">
				<navigator class="search-box" :url="'/parent/home/record-list?dateType=3&studentId='+studentId">
					<view class="box-seartip">搜索</view>
				</navigator>
			</view>
			<view class="container-item" @click="navDateilList(0)">
				<view class="item-img">
					<image mode="aspectFill" src="/static/img/home/avter.png" />
				</view>
				<view class="item-name">教师({{bookDate.teacherMap | setBookDate}})</view>
			</view>
			<view class="container-item" @click="navDateilList(1)">
				<view class="item-img">
					<image mode="aspectFill" src="/static/img/home/avter.png" />
				</view>
				<view class="item-name">家长({{bookDate.classesMaps | setBookDate}})</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getPhoneDate} from "@/common/httpApi/boundHttpApi.js"
	export default {
		data() {
			return {
				studentId:null,
				bookDate:""
			};
		},
		onLoad() {
			this.getInitDate();
		},
		methods:{
			async getInitDate(){
				try{
					const student = uni.getStorageSync("student");
					if(student){
						this.studentId = student.id;
						this.bookDate = await getPhoneDate(student.id);
					}else{
						this.$Q.tipUrl({tip:"获取学生数据异常"})
					}
				}catch(e){
					//TODO handle the exception
					console.log("通讯录异常"+e)
				}
			},
			// 跳转到子页面列表
			navDateilList(data){
				uni.navigateTo({
					url:"/parent/home/record-list?studentId="+this.studentId+"&dateType="+data
				})
			}
		},
		filters:{
			setBookDate(date){
				if(date && date.length){
					return date.length
				}
				return 0;
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
			.box-seartip{
				flex: 1;
				text-align: center;
				color: #777;
				letter-spacing: 2rpx;
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
		}
	}
}
</style>
