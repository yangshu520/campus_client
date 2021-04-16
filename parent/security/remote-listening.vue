<template>
	<view>
		<view class="container">
			<view class="container-nodata" v-if="!familyPhoneList.length">
				<view class="nodata-img">
					<image src="/static/img/parent/remote-nodata.png" mode="aspectFill">
				</view>
				<view class="nodata-tip">
					系统检测到您没有亲情号码，请添加亲情号码，才能使用远程聆听功能~
				</view>
				<view class="nodata-add" @click="addWhiltDate">去添加</view>
			</view>
			<view class="container-data" v-else>
				<view class="data-tip">
					<view class="tip-img">
						<image src="/static/img/parent/remote-tip.png" mode="aspectFill"/>
					</view>
					<view class="tip-title">
						开启后，守护人可单向聆听到孩子的一切动态。注：开启聆听功能时，学生证会立即回拨守护人的手机号码，请注意接听！
					</view>
				</view>
				<view class="data-family">
					<text>亲情号码</text>
				</view>
				<!-- 亲情号码列表 -->
				<view class="data-item">
					<view class="item" 
					v-for="(item,index) in familyPhoneList" 
					:key="index"
					@click="callPhone(item,index)">
						<view class="item-img">
							<image :src="item.faceUrl || '/static/img/home/avter.png'" mode="aspectFill"/>
						</view>
						<view class="item-main">
							<view class="main-name">{{item.name}}</view>
							<view class="main-phone">{{item.simId}}</view>
						</view>
						<view class="item-select" v-show="item.select">
							<image src="/static/img/parent/choose-babay.png" mode="aspectFill"/>
						</view>
					</view>
				</view>
				<!-- 确定监听 -->
				<view class="data-moniter" @click="anTurePhone">
					<text>确定</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	getCardParam,
	getWhiltList,
	getOperatorId,
	setMonitorPhone
	} from "@/common/httpApi/cardHttpApi.js"
	export default {
		data() {
			return {
				familyPhoneList:[],
				imei:null,
				status:null,
				operatorId:null
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		onShow() {
			if(this.imei){
				const data = {imei:this.imei};
				this.getInitDate(data);
			}
		},
		methods:{
			async getInitDate(option){
				try{
					this.operatorId = getOperatorId();
					this.imei = option.imei;
					const {status} = await getCardParam(option.imei);
					this.status = status;
					const data = {
						imei: option.imei,
						range:'1'
					};
					const cardDate = await getWhiltList(data);
					if(cardDate){
						const disposeList = [];
						cardDate.forEach((item,idx)=>{
							disposeList.push({
								name: item.name,
								simId: item.simId,
								select: idx == 0 ? true : false,
								faceUrl:item.faceUrl
							})
						})
						this.familyPhoneList = disposeList;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			callPhone(val,idx){
				this.familyPhoneList.map((item,index)=>{
					if(index == idx) {
						item.select = true
					}else{
						item.select = false
					}
				});
				const data = {
					imei: this.imei,
					phone: val.simId,
					operatorId: this.operatorId
				}
				setMonitorPhone(this.status,data)
			},
			anTurePhone(){
				const filList = this.familyPhoneList.filter(item => item.select)
				const data = {
					imei: this.imei,
					phone: filList[0].simId,
					operatorId: this.operatorId
				}
				setMonitorPhone(this.status,data)
			},
			// 添加白名单
			addWhiltDate(){
				if(this.status == -1){
					this.$Q.tipUrl({tip:"处于离线状态,不能进行操作"});
					return
				}
				this.$Q.tipUrl({
					url:"/parent/security/kiss-number?imei="+this.imei,
					time: 0
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
	.container-nodata{
		width: 100vw;
		height: 100vh;
		background-color: #FFFFFF;
		padding-top: 146rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		.nodata-img{
			width: 289rpx;
			height: 248rpx;
		}
		.nodata-tip{
			font-size: 22rpx;
			font-family: Source Han Sans CN Heavy, Source Han Sans CN Heavy-Heavy;
			font-weight: 800;
			text-align: center;
			color: #000000;
			line-height: 40rpx;
			margin-top: 78rpx;
			width: 500rpx;
			opacity: 0.7;
		}
		.nodata-add{
			font-size: $fontSize03;
			font-family: Source Han Sans CN Heavy, Source Han Sans CN Heavy-Heavy;
			font-weight: 800;
			color: #ffffff;
			width: 140rpx;
			height: 50rpx;
			background-image: url("/static/img/parent/remote-add-bg.png");
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 60rpx;
			@include flex($hov:center);
		}
	}
	.container-data{
		width: 100%;
		.data-tip{
			display: flex;
			padding: 0 40rpx;
			height: 110rpx;
			background-color: #FFFFFF;
			width: 100%;
			.tip-img{
				width: 38rpx;
				height: 30rpx;
				margin-top: 20rpx;
			}
			.tip-title{
				flex: 1;
				font-size: 22rpx;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				color: #fbb224;
				line-height: 40rpx;
				margin-left: 24rpx;
				margin-top: 14rpx;
			}
		}
		.data-family{
			width: 100%;
			height: 46rpx;
			background-color: #f5f5f5;
			line-height: 46rpx;
			padding: 0 40rpx;
			text{
				opacity: 0.65;
				font-size: 22rpx;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				color: #333333;
			}
		}
		.data-item{
			width: 100%;
			background-color: #FFFFFF;
			.item{
				@include flex($hov:space-between);
				padding: 0 20rpx;
				border-bottom: 2rpx solid #f5f5f5;
				height: 120rpx;
				.item-img{
					width: 100rpx;
					height: 100rpx;
					overflow: hidden;
					border-radius: 50%;
				}
				.item-main{
					flex: 1;
					margin-left: 20rpx;
					.main-name{
						font-size: $fontSize02;
						font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
						font-weight: 500;
						color: #222222;
					}
					.main-phone{
						font-size: $fontSize04;
						font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
						color: #1b0e0e;
						opacity: 0.7;
						line-height: 50rpx;
					}
				}
				.item-select{
					width: 44rpx;
					height: 30rpx;
				}
			}
		}
		.data-moniter{
			background-color: #44CEFF;
			width: 697rpx;
			height: 90rpx;
			border-radius: 10px;
			position: fixed;
			transform: translateX(-50%);
			left: 50%;
			bottom: 200rpx;
			@include flex($hov:center);
			text{
				font-size: $fontSize02;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				color: #ffffff;
				letter-spacing: 2rpx;
			}
		}
	}
}
</style>
