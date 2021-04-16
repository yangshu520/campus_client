<template>
	<view>
		<view class="container">
			<view class="container-img">
				<u-image 
				width="100%" 
				height="204rpx" 
				src="/static/img/parent/classroom-bg.png">
					<u-loading slot="loading"></u-loading>
				</u-image>
			</view>
			<!-- 提示以及开关 -->
			<view class="container-tip">
				<view class="tip-title">开启后，来电、信息将被拦截，将进入免打扰状态</view>
				<view class="tip-swicth">
					<view class="swicth-title">课堂模式开关</view>
					<u-switch v-model="disturbSwitch" @change="disturbChange"></u-switch>
				</view>
			</view>
			<!-- 课堂模式列表 -->
			<view class="container-box" v-show="disturbList.length">
				<uni-swipe-action>
					<block v-for="(item,index) in disturbList" :key="index">
						<uni-swipe-action-item style="margin-bottom: 40rpx;">
							<view class="box-item">
								<view class="item">
									<view class="item-title">创建时间</view>
									<view class="item-dateil">
										{{item.createDate}}
									</view>
								</view>
								<view class="item">
									<view class="item-title">时间范围</view>
									<view class="item-dateil">
										{{item.startTime+item.endTime | getTime}}
									</view>
								</view>
								<view class="item">
									<view class="item-title">周期</view>
									<view class="item-dateil">
										{{item.monDisable==1?'周一':' '}}
										{{item.tueDisable==1?'周二':' '}}
										{{item.wedDisable==1?'周三':' '}}
										{{item.thuDisable==1?'周四':' '}}
										{{item.friDisable==1?'周五':' '}}
										{{item.satDisable==1?'周六':' '}}
										{{item.sunDisable==1?'周日':' '}}
									</view>
								</view>
							</view>
							<template v-slot:right>
								<view class="right-box">
									<view class="box-editor" @click="editorDate(item)">
										<image src="/static/img/parent/editor-bg.png" mode="aspectFill" />
									</view>
									<view class="box-editor" @click="deleteDate(index,item)">
										<image src="/static/img/parent/delete-bg.png" mode="aspectFill" />
									</view>
								</view>
							</template>
						</uni-swipe-action-item>
					</block>
				</uni-swipe-action>
			</view>
			<!-- 没有数据 -->
			<common-empty :noData="!disturbList.length" />
			<!-- 添加按钮 -->
			<view class="container-add">
				<view class="add-img" @click="addBtn">
					<image src="/static/img/parent/add-bg.png" mode="aspectFit" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	getOperatorId,
	getCardParam,
	baseCardParam,
	getDisturbList,
	setDisturbSwicth
	} from "@/common/httpApi/cardHttpApi.js"
	import {deleteOperation } from "@/common/httpApi/comhttpApi.js"
	import {CARD_DISTURB_REMOVE} from "@/common/js/apiUrl.js"
	import addButton from "@/uni-components/drag-button/drag-button.vue"
	export default {
		components:{addButton},
		data() {
			return {
				disturbSwitch:false,
				operatorId:null,
				imei:null,
				status:null,
				disturbList:[]
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		onShow() {
			// 添加或者修改过来你刷新数据
			if(this.imei){
				const options = {imei:this.imei}
				this.getInitDate(options);
			}
		},
		methods:{
			// 初始化数据
			async getInitDate(option){
				this.operatorId = getOperatorId();
				this.imei = option.imei;
				const {status} = await getCardParam(option.imei);
				this.status = status;
				// 获取该页面需要的数据
				const paramDate = await baseCardParam(option.imei);
				if(paramDate){
					this.disturbSwitch = Boolean(paramDate.disturbSwitch);
				};
				const disturbDate = await getDisturbList(option.imei);
				if(disturbDate){
					this.disturbList = disturbDate;
				}
			},
			// 滑动修改
			editorDate(val){
				if(this.statusNo()) return;
				uni.setStorageSync("temporaryDateDis",val);
				uni.navigateTo({
					url:"/parent/security/classroom-add?dataType=edi&imei="+this.imei
				});
			},
			addBtn(){
				if(this.statusNo()) return;
				
				if(this.disturbList.length >= 5){
					this.$Q.tipUrl({tip:"不能再添加了"});
					return
				}
				uni.navigateTo({
					url:"/parent/security/classroom-add?imei="+this.imei
				})
			},
			// 删除数据
			async deleteDate(index,val){
				if(this.statusNo()) return;
				
				const data = {
					imei: this.imei,
					index: String(val.number),
					operatorId: this.operatorId
				};
				const cardDate = await deleteOperation({
					tipContent:"你确定要删除该模式吗?",
					deleteApi:CARD_DISTURB_REMOVE,
					data:data,
					confirmText:"删除"
				});
				if(cardDate){
					this.disturbList.splice(index,1);
				}
			},
			statusNo(){
				if(this.status == -1){
					this.$Q.tipUrl({tip:"离线状态,不能进行操作"});
					return true;
				}
				return false;
			},
			// 课堂模式的开关
			async disturbChange(val){
				const switchCode=Number(val);
				const data = {
					imei: this.imei,
					switchCode: String(switchCode),
					operatorId: this.operatorId
				};
				const cardDate = await setDisturbSwicth(this.status,data);
				if(!cardDate){
					this.disturbSwitch = !this.disturbSwitch;
				}
			}
		},
		filters:{
			getTime(e){
				return e.substr(0,2)+':'+e.substr(2,2)+'—'+e.substr(4,2)+':'+e.substr(6,2)
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.container{
	.container-img{
		width: 100vw;
	}
	.container-tip{
		font-family: Source Han Sans CN Light, Source Han Sans CN Light-Light;
		.tip-title{
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			padding: 0 20rpx;
			font-size: $fontSize04;
			font-weight: 300;
			color: #666666;
			max-width: 100%;
			@include textEllipsis();
		}
		.tip-swicth{
			display: flex;
			justify-content: space-between;
			padding: 0 20rpx;
			height: 90rpx;
			.swicth-title{
				font-size: $fontSize02;
				color: #333333;
			}
		}
	}
	.container-box{
		.box-item{
			background-color: #FFFFFF;
			width: 100%;
			.item{
				padding: 0 20rpx;
				@include flex($hov:space-between);
				color: #333333;
				width: 100%;
				height: 100rpx;
				border-bottom: 2rpx solid #f5f5f5;
				.item-title{
					font-size: $fontSize02;
				}
				.item-dateil{
					font-size: $fontSize03;
				}
			}
		}
	}
	.right-box{
		height: 100%;
		width: 300rpx;
		@include flex($hov:space-around);
		.box-editor{
			width: 120rpx;
			height: 120rpx;
		}
	}
	.container-add{
		position: fixed;
		bottom: 0;
		@include flex($hov:center);
		width: 100vw;
		.add-img{
			width: 160rpx;
			height: 140rpx;
		}
	}
}
</style>
