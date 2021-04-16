<template>
	<view>
		<view class="container">
			<!-- 危险区域列表 -->
			<view class="container-list" v-show="!disMap">
				<u-image
				width="100%"
				height="334rpx"
				src="/static/img/parent/danger-area-bg.png"
				mode="aspectFill">
					<u-loading slot="loading"></u-loading>
				</u-image>
				<view class="list-tip">
					<text>
						开启后，当孩子进入危险区域时，会触发预警信息，并推送消息提醒
					</text>
				</view>
				<!-- 安全区域列表 -->
				<view class="list-area" v-if="dangerList.length">
					<uni-swipe-action>
						<block v-for="(item,index) in dangerList" :key="index+1">
							<uni-swipe-action-item style="margin-bottom: 40rpx;">
								<view class="area-item">
									<view class="item-mode">
										<view class="mode-title">{{item.fenceName}}</view>
										<u-switch v-model="item.switchFlag" @change="dangerAreaChange($event,item,index)" />
									</view>
									<view class="item-mode">
										<view class="mode-title">启用时段</view>
										<view class="mode-time">
											{{item.startTime?item.startTime.substr(0,2)+":"+item.startTime.substr(2,2):""}}-{{item.startTime?item.endTime.substr(0,2)+":"+item.endTime.substr(2,2):""}}
										</view>
									</view>
									<view class="item-mode">
										<view class="mode-title">启用周期</view>
										<view class="mode-time">
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
										<view class="box-editor" @click="editorDate(item,index)">
											<image src="/static/img/parent/editor-bg.png" mode="aspectFill" />
										</view>
										<view class="box-editor" @click="deleteDate(item,index)">
											<image src="/static/img/parent/delete-bg.png" mode="aspectFill" />
										</view>
									</view>
								</template>
							</uni-swipe-action-item>
						</block>
					</uni-swipe-action>
					<view style="height: 102rpx;" />
				</view>
				<!-- 没有数据 -->
				<common-empty :noData="!dangerList.length" />
			</view>
			
			<!-- 常用地址地图显示 -->
			<view class="container-map" v-show="disMap">
				<!-- 提示栏 -->
				<view class="map-tip">{{getTipTitle}}</view>
				<!-- 地图 -->
				<el-amap 
				vid="amap"
				zoom="15" 
				:center="amapCenter" >
					<!-- 多边形标记 -->
					<block v-for="(polygon,index) in polygonsList" :key="index">
						<!-- start -->
						<el-amap-marker :position="polygon.path[0]">	
							<view class="marker-amap">
								<image
								src="/static/img/parent/location-icon.png"
								mode="aspectFill" 
								style="width: 42rpx;height: 60rpx;" />
								<view class="amap-title">
									{{polygon.fenceName}}
								</view>
							</view>
						 </el-amap-marker>
						<!-- end -->
						
						<el-amap-polygon
						v-if="polygon.switchFlag"
						:path="polygon.path"
						fillColor="#ff0000"
						fillOpacity="0.2"
						strokeWeight="3"
						strokeColor="#ff0000"
						strokeOpacity="0.35" />
						
						<el-amap-polygon
						v-else
						:path="polygon.path"
						fillColor="#3A3737"
						fillOpacity="0.2"
						strokeWeight="3"
						strokeColor="#3A3737"
						strokeOpacity="0.35" />
					</block>
					
					<block v-for="(circle,index) in circlesList" :key="index+30">
						<!-- start -->
						<el-amap-marker :position="circle.center">	
							<view class="marker-amap">
								<image
								src="/static/img/parent/location-icon.png"
								mode="aspectFill" 
								style="width: 42rpx;height: 60rpx;" />
								<view class="amap-title">
									{{circle.fenceName}}
								</view>
							</view>
						 </el-amap-marker>
						<!-- end -->
						
						<!-- 开启的圆形标记 -->
						<el-amap-circle 
						v-if="circle.switchFlag"
						:center="circle.center" 
						:radius="circle.radius"
						fill-opacity="0.2"
						fillColor="#ff0000"
						strokeOpacity="0.3"
						strokeWeight="3"
						strokeColor="#ff0000" />
						<!-- 关闭的圆形标记 -->
						<el-amap-circle
						v-else
						:center="circle.center" 
						:radius="circle.radius"
						fill-opacity="0.2"
						fillColor="#3A3737"
						strokeOpacity="0.3"
						strokeWeight="3"
						strokeColor="#3A3737" />
					</block>
				</el-amap>
			</view>
		</view>
		
		<!-- 底部导航栏 -->
		<area-tab-btm
		@addMap="addMap"
		@disList="disMap = false"
		@disMap="disMap = true"/>
	</view>
</template>

<script>
	import {
	getOperatorId,
	getCardParam,
	getSecurityDate,
	setStationSwicth,
	deleteStation,
	cardAreaPart
	} from "@/common/httpApi/cardHttpApi.js"
	import areaTabBtm from "@/components/area-tab-btm.vue"
	export default {
		components:{areaTabBtm},
		data() {
			return {
				operatorId:null,
				imei:null,
				status:null,
				disMap:false,
				dangerList:[],
				// 地图显示相关的数据
				amapCenter:[116.40, 39.90],
				circlesList:[],
				polygonsList:[],
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		onShow() {
			if(this.imei){
				const data = {
					imei:this.imei
				};
				this.getInitDate(data);
			}
		},
		methods:{
			async getInitDate(option){
				this.operatorId = getOperatorId();
				this.imei = option.imei;
				const {status} = await getCardParam(option.imei);
				this.status = status;
				const dangerList = await getSecurityDate(option.imei,1);
				dangerList.map(item => {item.switchFlag = Boolean(item.switchFlag)});
				this.dangerList = dangerList;
				this.refashAreaDate(dangerList);
				if(dangerList.length){
					if(dangerList[0].type == 1){
						this.amapCenter = [dangerList[0].centerLongitude,dangerList[0].centerLatitude];
						return;
					}
					this.amapCenter = this.polygonsList[0].path[0];
					return;
				}
				this.getWxLocation();
			},
			// 添加常用地址
			addMap(){
				if(this.status == -1){
					this.$Q.tipUrl({tip:"离线状态,不能进行操作"});
					return;
				}
				if(this.dangerList.length > 29){
					this.$Q.tipUrl({tip:"最多添加30安全区域"});
					return;
				}
				uni.navigateTo({
					url:"/parent/security/danger-handle?imei="+this.imei
				})
			},
			//每个常用地址的开关操作
			async dangerAreaChange(e,val,idx){
				const switchFlag = Number(e);
				const data = {
					id: val.id,
					imei: this.imei,
					switchFlag: String(switchFlag),
					operatorId: this.operatorId
				};
				const backDate = await setStationSwicth(this.status,data,1);
				if(!backDate){
					this.dangerList[idx].switchFlag = !this.dangerList[idx].switchFlag;
				}
				this.refashAreaDate(this.dangerList);
			},
			// 安全区域修改
			editorDate(val,idx){
				if(this.status == -1){
					this.$Q.tipUrl({tip:"离线状态,不能进行操作"});
					return;
				}
				uni.setStorageSync("dangerEdit",val);
				uni.navigateTo({
					url:"/parent/security/danger-handle?typeDate=1&imei="+this.imei
				})
			},
			// 删除安全区域
			async deleteDate(val,idx){
				const data = {
					imei: this.imei,
					id: val.id,
					operatorId: this.operatorId
				};
				const backDate = await deleteStation(this.status,data,1);
				if(backDate){
					// 不能实现自动计算
					// this.dangerList.splice(idx,1);
					const data = {imei:this.imei};
					this.getInitDate(data);
				}
			},
			// 没有数据  则调用wx进行定位
			getWxLocation(date){
				this.$wx.ready(()=>{
					this.$wx.getLocation({
					  type: 'gcj02',
					  success: (res)=>{
						 this.amapCenter = [res.longitude,res.latitude];
					  }
					});
				});
			},
			// 刷新一下标记的数据
			refashAreaDate(data){
				const {circlesList,polygonsList} = cardAreaPart(data);
				this.circlesList = circlesList;
				this.polygonsList = polygonsList;
			}
		},
		computed:{
			getTipTitle(){
				if(!this.dangerList.length){
					return "您好，暂未添加危险区域"
				}
				const num1 = this.circlesList.filter(item => item.switchFlag).length;
				const num2 = this.polygonsList.filter(item => item.switchFlag).length;
				const num = num1 + num2;
				return `您好，您已开启了${num}个危险区域`
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.container{
	width: 100%;
	.container-list{
		width: 100%;
		.list-tip{
			padding: 20rpx 30rpx;
			font-size: $fontSize04;
			font-family: Source Han Sans CN Light, Source Han Sans CN Light-Light;
			font-weight: 300;
			color: #666666;
			text{
				line-height: 30rpx;
			}
		}
		.list-area{
			.area-item{
				background-color: #FFFFFF;
				height: 324rpx;
				width: 100%;
				.item-mode{
					@include flex();
					height: 108rpx;
					width: 100%;
					color: #333333;
					font-family: $fontFamily05;
					border-bottom: 2rpx solid #f5f5f5;
					padding: 0 30rpx;
					.mode-title{
						font-size: 30rpx;
					}
					.mode-time{
						font-size: 26rpx;
					}
				}
			}
			.right-box{
				height: 100%;
				width: 260rpx;
				@include flex($hov:space-around);
				.box-editor{
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
	}
	.container-map{
		width: 100vw;
		height: 100vh;
		.map-tip{
			@include flex($hov:center);
			position: fixed;
			top: 20rpx;
			left: 50%;
			transform: translateX(-50%);
			height: 68rpx;
			width: 680rpx;
			z-index: 9999;
			opacity: 0.8;
			background-color: rgba( #ffffff, .8);
			border-radius: 8rpx;
			font-size: $fontSize02;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
			font-weight: 400;
			color: #043b88;
			letter-spacing: 2rpx;
		}
	}
}
.marker-amap{
	position: relative;
	width: 42rpx;
	height: 42rpx;
	.amap-title{
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(0,-95%);
		@include flex($hov:center);
		line-height: 50rpx;
		background-color:#ffc8c2;
		color: #333;
		width: 300rpx;
		min-height: 60rpx;
		border-radius: 10rpx;
	}
}
</style>