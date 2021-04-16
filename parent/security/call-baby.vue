<template>
	<view>
		<view class="container">
			<view class="container-avter">
				<image :src="studentDate.iconLink || '/static/img/parent/call-bg.png'" mode="aspectFill"/>
			</view>
			<view class="container-name">
				<text>{{studentDate.studentName}}</text>
			</view>
			<view class="container-phone">
				<view class="phone-title">拨打电话</view>
				<view class="phone-number">
					<text>{{cardDate.simNumber?cardDate.simNumber:"暂未获取,请联系客服"}}</text>
				</view>
			</view>
			<view class="container-call" v-if="cardDate.simNumber">
				<button class="call" @click="callPhone">呼叫</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {commonTelPhone} from "@/common/httpApi/comhttpApi.js"
	export default {
		data() {
			return {
				cardDate:"",
				studentDate:"",
			};
		},
		onLoad() {
			this.getInitDate();
		},
		methods:{
			getInitDate(){
				this.cardDate = uni.getStorageSync("cardDate");
				this.studentDate = uni.getStorageSync("student");
			},
			callPhone(){
				commonTelPhone(this.cardDate.simNumber)
			}
		}
	}
</script>

<style lang="scss">
page{
	font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
}
.container{
	padding-top: 140rpx;
	@include flex($hov:center);
	flex-direction: column;
	.container-avter{
		width: 350rpx;
		height: 350rpx;
		border-radius: 50%;
		overflow: hidden;
	}
	.container-name{
		padding-top: 40rpx;
		padding-bottom: 160rpx;
		font-size: 42rpx;
		font-weight: 400;
		color: #6e6f78;
		line-height: 36rpx;
		letter-spacing: 2px;
	}
	.container-phone{
		@include flex($hov:center);
		flex-direction: column;
		.phone-title{
			font-size: $fontSize02;
			font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
			color: #95989e;
		}
		.phone-number{
			margin-top: 36rpx;
			font-size: 38rpx;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
			font-weight: 400;
			color: #95989e;
		}
	}
	.container-call{
		width: 100vw;
		padding: 0 60rpx;
		.call{
			letter-spacing: 2px;
			margin-top: 200rpx;
			width: 100%;
			height: 90rpx;
			background-color: #00d2ff;
			font-size: 32rpx;
			color: #fff;
			@include flex($hov:center);
		}
	}
}
</style>
