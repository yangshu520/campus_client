<template>
	<view>
		<view class="avter-top">
			<view class="top-title" v-if="!disRecord">{{avterSchoolName | getSchoolName}}</view>
			<view class="top-title" v-else>我的考勤</view>
			<view class="top-avater">
				<view class="avater-box">
					<view class="box-top" @click="dateil">
						<view class="top-right">
							<u-image :src="avterImg || '/static/img/home/avter.png'" height="115rpx" width="115rpx">
								<u-loading slot="loading"></u-loading>
							</u-image>
						</view>
						<view class="top-left">
							<view class="left-title left-common">
								{{avterName || 'Hello unbound'}}
							</view>
							<view class="left-phone left-common">
								{{avterSchoolName || '暂未绑定家长账号'}}
								&nbsp;&nbsp;
								{{avterClassesName}}
							</view>
						</view>
					</view>
					<view class="box-btm" v-if="!disRecord">
						<view class="btm-cowry" @click="navToBaby(1)">
							<view class="cowry-img">
								<image src="/static/img/home/cowry.png"/>
							</view>
							<view class="cowry-title">添加宝贝</view>
						</view>
						<view class="btm-cowry" @click="navToBaby(2)">
							<view class="cowry-img">
								<image src="/static/img/home/switchover.png"/>
							</view>
							<view class="cowry-title">切换账号</view>
						</view>
					</view>
					<view class="box-record" v-else>
						<view class="record-item" 
						v-for="(item,index) in recordAllList" 
						:key="index"
						@click="$emit('countNavTo',{val:index})">
							<view class="item-day">{{item.number}}</view>
							<view class="item-title">{{item.title}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getChilderList} from "@/common/httpApi/boundHttpApi.js"
	export default {
		name:"common-avter",
		props:{
			avterImg:{
				type:String,
				default:"/static/img/home/avter.png",
			},
			avterName:{
				type:String,
				default: "Hello unbound"
			},
			avterSchoolName:{
				type:String,
				default: "暂未绑定家长账号"
			},
			avterClassesName:{
				type:String,
				default: ""
			},
			disRecord:{
				type:Boolean,
				default:false
			},
			recordAllList:{
				type:Array,
				default:()=>{
					return []
				}
			}
		},
		methods:{
			dateil(){
				this.$emit("seeDateil");
			},
			async navToBaby(idx){
				if(idx == 1){
					const parentId = uni.getStorageSync("parentId");
					const backList = await getChilderList(parentId);
					if(backList.length >= 10){
						this.$Q.tipUrl({
							tip:"只能绑定10个学生"
						});
						return
					}
					this.$emit("navToBaby",{url:'/parent/home/add-baby'})
				}else{
					this.$emit("navToBaby",{url:'/parent/home/switch-baby'})
				}
			}
		},
		filters:{
			getSchoolName(val){
				if(val && val != "暂未绑定家长账号"){
					return val;
				}
				return "智慧校园";
			}
		}
	}
</script>

<style lang="scss">
	.avter-top{
		width: 100%;
		height: 498rpx;
		background-image: url('/static/img/home/indexBg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.top-title{
			height: 130rpx;
			width: 100%;
			font-size: $fontSize01;
			letter-spacing: 2rpx;
			display: flex;
			justify-content: center;
			line-height: 160rpx;
			color: #fff;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
		}
		.top-avater{
			width: 100%;
			padding: 20rpx 60rpx;
			height: 380rpx;
			.avater-box{
				.box-top{
					display: flex;
					height: 120rpx;
					align-items: center;
					.top-right{
						height: 115rpx;
						width: 115rpx;
						overflow: hidden;
						border-radius: 57rpx;
					}
					.top-left{
						flex: 1;
						padding-left: 40rpx;
						font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
						.left-common{
							max-width:450rpx;
							@include textEllipsis();
						}
						.left-title{
							font-size: $fontSize02;
							font-weight: 500;
							color: #000000;
							line-height: 64rpx;
						}
						.left-phone{
							font-size: $fontSize04;
							color: #999999;
						}
					}
				}
				.box-btm{
					margin-top: 20rpx;
					width: 100%;
					height: 180rpx;
					@include flex($hov:space-around);
					border-top: 4rpx dashed #e7f4fe;
					.btm-cowry{
						width: 120rpx;
						display: flex;
						align-items: center;
						flex-direction: column;
						.cowry-img{
							height: 88rpx;
							width: 88rpx;
						}
						.cowry-title{
							font-size: $fontSize04;
							font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
							font-weight: 400;
							text-align: left;
							color: #4d4d4d;
							line-height: 40rpx;
						}
					}
				}
				.box-record{
					@include flex();
					margin-top: 20rpx;
					width: 100%;
					height: 160rpx;
					.record-item{
						display: flex;
						align-items: center;
						flex-direction: column;
						.item-day{
							font-size: $fontSize01;
							font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
							font-weight: R;
							color: #1481ff;
							line-height: 50rpx;
							opacity: .8;
						}
						.item-title{
							font-size: $fontSize04;
							font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
							font-weight: 400;
							color: #333333;
							line-height: 50rpx;
							opacity: .8;
						}
					}
				}
			}
		}
	}
</style>
