<template>
	<view>
		<view class="kiss-handle">
			<view class="handle-img" @click="uploadImg">
				<image :src="date.faceUrl?date.faceUrl:'/static/img/parent/add-avter.png'" mode="aspectFill" />
			</view>
			<view class="handle-item">
				<view class="item-title">姓名</view>
				<view class="item-inp">
					<input type="text" maxlength="16" :disabled="disabled" placeholder="请输入姓名" v-model.trim="date.name"/>
				</view>
			</view>
			<view class="handle-item">
				<view class="item-title">号码</view>
				<view class="item-inp">
					<input type="number" maxlength="11" :disabled="disabled" placeholder="请输入号码" v-model.trim="date.phone"/>
				</view>
			</view>
			<view class="handle-save">
				<view class="save" @click="save" 
				v-if="types != 1 
				&& (types == 2 && date.faceUrl || date.name || date.phone) 
				&& (types == 3 && date.faceUrl != datas.faceUrl || date.name != datas.name || date.phone != datas.phone)" >
					保存
				</view>
				<view class="cancel" @click="cancel"> {{types == 1 ?'关闭':'取消'}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {comUploadImg,depthClone} from "@/common/httpApi/comhttpApi.js"
	export default {
		name:"kiss-handle",
		props:{
			disabled:{
				type:Boolean,
				default: false
			},
			datas:{
				type:Object,
				default:()=>{
					return {
						faceUrl: '',
						name: '',
						phone: '',
						range:"1",
						index: 1,
						remove:"0",
						select: false
					}
				}
			},
			// 为1查看详情 为2添加  为3修改
			types:{
				type:Number,
				default:1
			},
			// 修改需要的位置数据
			editIdx:{
				type:[Number,String],
				default:''
			}
		},
		data() {
			return {
				// 操作状态
				operationStatus:false,
				date:{
					faceUrl: '',
					name: '',
					phone: '',
					range:"1",
					index: 1,
					remove:"0",
					select: false
				}
			};
		},
		mounted() {
			// 需要深度克隆一下,否则会存在问题
			this.date = depthClone(this.datas)
		},
		methods:{
			async uploadImg(){
				const backDate = await comUploadImg();
				if(backDate){
					this.date.faceUrl = backDate;
					this.operationStatus = true;
				}
			},
			save(){
				const val = this.date;
				if(this.types == 3){
					const idx = this.editIdx;
					this.$emit("handleSave",{val,idx});
				}else if(this.types == 2){
					this.$emit("handleSave",{val});
				}
			},
			cancel(){
				this.$emit("handleCancel");
			},
		}
	}
</script>

<style lang="scss">
.kiss-handle{
	width: 100vw;
	height: 100vh;
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 0 30rpx;
	.handle-img{
		margin-top: 90rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-bottom: 80rpx;
	}
	.handle-item{
		@include flex();
		width: 100%;
		height: 124rpx;
		border-bottom: 2rpx solid #f5f5f5;
		padding: 0 20rpx;
		.item-title{
			font-size: $fontSize02;
			font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
			color: #333333;
			letter-spacing: 2rpx;
			font-weight: 600;
		}
		.item-inp{
			flex: 1;
			display: flex;
			input{
				flex: 1;
				text-align: right;
			}
		}
	}
	.handle-save{
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 60rpx;
		width: 690rpx;
		font-size: $fontSize02;
		font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
		color: #ffffff;
		letter-spacing: 2rpx;
		.save{
			background: #44ceff;
			border-radius: 10px;
			width: 100%;
			height: 80rpx;
			@include flex($hov:center);
		}
		.cancel{
			margin-top: 30rpx;
			background: #999;
			border-radius: 10px;
			width: 100%;
			height: 80rpx;
			@include flex($hov:center);
		}
	}
}
</style>
