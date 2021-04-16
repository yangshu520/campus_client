<template>
	<view class="container">
		<!-- 图像会追按钮 start -->
		<view class="container-btn">
			<view class="btn-item"
			:class="toolbarIdx == item.id?'btn-select':''"
			v-for="(item,index) in toolbarList" :key="index"
			@click="toolBarFun(item.id)">
				<u-image width="32rpx" height="32rpx" 
				:src="item.srcImg">
					<u-loading slot="loading"></u-loading>
				</u-image>
				<view class="item-name">{{item.name}}</view>
			</view>
		</view>
		<!-- end -->
		
		<!-- 搜索框 start -->
		<view class="container-search">
			<view class="search-box">
				<u-image width="54rpx" height="54rpx" src="/static/img/parent/security-handle-icon.png">
					<u-loading slot="loading"></u-loading>
				</u-image>
				<input placeholder="请输入搜索地址" v-model.trim="searchAdress" @confirm="searchContr" @input="searchContr"/>
				<u-image width="34rpx" height="34rpx" src="/static/img/parent/search-img.png">
					<u-loading slot="loading"></u-loading>
				</u-image>
			</view>
			<scroll-view class="search-content" 
			:scroll-y="true" 
			v-show="addressList.length && disAddressList">
				<view class="content" 
				@click="selectAdress(item.location,item.name)" 
				v-for="(item,index) in addressList" 
				:key="index">
					<view class="content-title">
						<u-image width="32rpx" height="32rpx" src="/static/img/parent/security-handle-locati.png">
							<u-loading slot="loading"></u-loading>
						</u-image>
						<view class="title">{{item.name}}</view>
					</view>
					<view class="content-name">{{item.district+item.address}}</view>
				</view>
			</scroll-view>
		</view>
		<!-- end -->
	</view>
</template>

<script>
	import {
	getAdressLocati
	} from "@/common/httpApi/cardHttpApi.js"
	export default {
		name:"area-handle",
		props:{
			toolbarIdx:{
				type:[String,Number],
				default:-1
			}
		},
		data() {
			return {
				searchAdress:"",
				addressList:[],
				disAddressList:false,
				toolbarList:[
					{
						id:1,
						name:"圆形",
						srcImg:"/static/img/parent/security-handle-circle.png"
					},
					{
						id:2,
						name:"矩形",
						srcImg:"/static/img/parent/security-handle-rectangle.png"
					},
					{
						id:3,
						name:"清除",
						srcImg:"/static/img/parent/security-handle-clear.png"
					}
				],
			};
		},
		methods:{
			// 搜索地址
			async searchContr(){
				// 此处没有做节流 有时间做
				this.disAddressList = false;
				this.addressList = await getAdressLocati(this.searchAdress);
				this.disAddressList = true;
			},
			selectAdress(val,name){
				const latlon = val.split(',');
				this.disAddressList = false;
				const title = name.length > 12 ? name.substr(0,12):name;
				this.searchAdress = name;
				this.$emit("selectAdress",{title:title,latlon:latlon})
			},
			// 点击工具栏触发
			toolBarFun(idx){
				switch(idx){
					case 1:
					this.$emit("handleCircle");
					break;
					case 2:
					this.$emit("handleRectangle");
					break;
					case 3:
					this.$emit("handleClear");
					break;
				}
			},
		}
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	.container-btn{
		background-color: #ffffff;
		position: fixed;
		top: 140rpx;
		right: 30rpx;
		z-index: 99;
		width: 90rpx;
		height: 270rpx;
		border: 1px solid #dcdcdc;
		border-radius: 5rpx;
		box-shadow: 2rpx 2rpx 10rpx 0rpx rgba(0,0,0,0.10); 
		@include flex($hov:center);
		flex-direction: column;
		overflow: hidden;
		.btn-item{
			@include flex($hov:center);
			flex-direction: column;
			flex: 1;
			width: 100%;
			.item-name{
				font-size: $fontSize04;
				font-family: SimHei Regular, SimHei Regular-Regular;
				opacity: .7;
				font-weight: 400;
				text-align: left;
				color: #545663;
				margin-top: 8rpx;
				letter-spacing: 2rpx;
			}
			&.btn-select{
				background-color: #0099ff;
				.item-name{
					color: #FFFFFF;
					opacity: 1;
				}
			}
		}
	}
	.container-search{
		width: 700rpx;
		background-color: #f5f5f5;
		position: fixed;
		top: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		@include flex($hov:center);
		flex-direction: column;
		z-index: 9999;
		.search-box{
			width: 100%;
			height: 80rpx;
			padding: 0 20rpx;
			@include flex();
			background-color: #FFFFFF;
			input{
				padding: 0 20rpx;
				flex: 1;
			}
		}
		.search-slider{
			height: 40rpx;
		}
		.search-content{
			margin: 20rpx 0;
			@include comomSlide();
			width: 96%;
			max-height: 900rpx;
			.content{
				background-color: #FFFFFF;
				width: 100%;
				height: 100rpx;
				border-top-left-radius: 10rpx;
				border-top-right-radius: 10rpx;
				border-bottom: 2rpx solid #f5f5f5;
				display: flex;
				justify-content: center;
				flex-direction: column;
				padding: 0 20rpx;
				.content-title{
					display: flex;
					align-items: center;
					.title{
						margin-left: 10rpx;
						font-size: $fontSize02;
						color: #333333;
						flex: 1;
						text-align: left;
						max-width: 580rpx;
						@include textEllipsis();
					}
				}
				.content-name{
					font-size: $fontSize03;
					color: #999;
					text-align: left;
					padding-left: 42rpx;
					max-width: 580rpx;
					@include textEllipsis();
				}
			}
		}
	}
}
</style>
