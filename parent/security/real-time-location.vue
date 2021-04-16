<template>
	<view>
		<view class="container">
			<!-- 高德地图 -->
			<view class="container-amap">
				<el-amap vid="amap" 
				ref="amap"
				:center="amapCenter" 
				:zooms="zooms" 
				zoom="17"
				:plugin="plugins">
					<!-- 标点 -->
					<el-amap-marker
					v-if="amapMarker"
					:position="amapMarker.position" 
					:events="amapMarker.events">
						<image  
						src="/static/img/parent/location-icon.png"
						mode="aspectFill" 
						style="width: 42rpx;height: 60rpx;" />
					</el-amap-marker>
					<el-amap-info-window
					v-if="amapWindow" 
					:position="amapWindow.position" 
					:visible="amapWindow.visible" 
					:offset="amapWindow.offset" 
					:events="amapWindow.events">
						电子学生证-精准定位<br/>
						姓名:  {{cardParam.studentName | getDate}}<br/>
						电量: {{cardParam.soc}}% <br />
						状态: {{cardParam.status | getDate}}<br/>
						更新时间: {{cardParam.locationDate | getDate}}<br/>
						所在位置: {{cardParam.address | getDate}}<br/>
					</el-amap-info-window>
					<!-- 显示安全区域start -->
					<el-amap-circle
					v-for="(circle,index) in staCirList"
					:key = "index"
					:center="circle.center" 
					:radius="circle.radius"
					fill-opacity="0.2"
					fillColor="#1EE143"
					strokeOpacity="0.3"
					strokeWeight="3"
					strokeColor="#1EE143" />
					<!-- 多边形标记 -->
					<el-amap-polygon
					v-for="(polygon,index) in staPolList"
					:key = "index"
					:path="polygon.path"
					fillColor="#1EE143"
					fillOpacity="0.2"
					strokeWeight="3"
					strokeColor="#1EE143"
					strokeOpacity="0.35" />
					<!-- end -->
					
					<!-- 显示危险区域start -->
					<!-- 圆形标记 -->
					<el-amap-circle 
					v-for="(circle,index) in danCirList"
					:key = "index+10"
					:center="circle.center" 
					:radius="circle.radius"
					fill-opacity="0.2"
					fillColor="#ff0000"
					strokeOpacity="0.3"
					strokeWeight="3"
					strokeColor="#ff0000" />
					<!-- 多边形标记 -->
					<el-amap-polygon
					v-for="(polygon,index) in danPolList"
					:key = "index+10"
					:path="polygon.path"
					fillColor="#ff0000"
					fillOpacity="0.2"
					strokeWeight="3"
					strokeColor="#ff0000"
					strokeOpacity="0.35" />
					<!-- end -->
					
				</el-amap>
			</view>
			<!-- 底部导航栏  -->
			<view class="container-btm">
				<block v-for="(item,index) in btmList" :key="index">
					<view class="btm-item" 
					:class="index == 2 || index == 3?'btm-items':''" 
					v-show="item.isDis"
					@click="btmNavgaTo(index)">
						<u-image
						width="80rpx" 
						height="80rpx" 
						:src="item.img">
							<u-loading slot="loading"></u-loading>
						</u-image>
						<view class="item-name">{{item.name}}</view>
					</view>
				</block>
			</view>
			<!-- 实时定位点击开显示 -->
			<view class="container-open" v-show="isLocationTime">
				<view class="open">
					<view class="open-box" v-show="isOpen">
						<!-- 开启的时候显示 -->
						<view class="box-content">
							<u-image
							width="158rpx" 
							height="164rpx" 
							src="/static/img/parent/location-icon1.png">
								<u-loading slot="loading"></u-loading>
							</u-image>
							<view class="content-title">
								开启实时定位
							</view>
							<view class="content-dateil">
								开启实时定位位置更精准但耗电高
							</view>
						</view>
						<view class="box-btn" @click="getOpenTime">确 定</view>
					</view>
					<view class="open-box" v-show="!isOpen">
						<!-- 关闭的时候显示 -->
						<view class="box-content">
							<u-image
							width="96rpx" 
							height="160rpx" 
							src="/static/img/parent/location-icon2.png">
								<u-loading slot="loading"></u-loading>
							</u-image>
							<view class="content-title">
								关闭实时定位
							</view>
							<view class="content-dateil">
								关闭实时定位，学生证将耗电低
							</view>
						</view>
						<view class="box-btn" @click="getCloseTime">确 定</view>
					</view>
					<view class="open-colse" @click="isLocationTime = false">
						<u-image
						width="80rpx" 
						height="80rpx" 
						src="/static/img/parent/location-close.png">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	getOperatorId,
	getCardParam,
	getTimeLocation,
	baseCardParam,
	setModeDate,
	judgeMode,
	getDisturbList,
	getSecurityDate,
	cardAreaPart
	} from "@/common/httpApi/cardHttpApi.js"
	export default {
		data() {
			return {
				imei:null,
				status:null,
				operatorId:null,
				disturbList:null,
				isLocationTime:false,
				isOpen:true,
				// 学生证基本数据
				cardParam:null,
				// 地图中心点 需要给一个默认值 要不然会报错
				amapCenter:[116.40, 39.90],
				zooms:[3,19],
				plugins:["Scale",'MapType',"ToolBar","Autocomplete"],
				amapMarker:null,
				amapWindow:null,
				// 页面逻辑需要的数据
				throttlingTime: null,
				baseParam:null,
				// 底部导航栏数据
				btmList:[
					{
						name:"刷 新",
						img:"/static/img/parent/location-refresh.png",
						isDis:true
					},
					{
						name:"导 航",
						img:"/static/img/parent/location-navgati.png",
						isDis:true
					},
					{
						name:"实时定位-关",
						img:"/static/img/parent/location-swicth.png",
						isDis:true
					},
					{
						name:"实时定位-开",
						img:"/static/img/parent/location-swicths.png",
						isDis:false
					},
				],
				// 关于实时模式的数据
				closeTimerMode:null,
				
				// 显示的区域
				staCirList:[],
				staPolList:[],
				danCirList:[],
				danPolList:[]
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		// 实时模式相关
		async onShow() {
			this.setTimerMode(true);
			if(this.imei){
				this.baseParam = await baseCardParam(this.imei);
			}
		},
		onHide() {
			this.setTimerMode();
		},
		onUnload() {
			this.setTimerMode();
		},
		methods:{
			async getInitDate(option){
				try{
					// 存一下数据
					this.operatorId = getOperatorId();
					this.imei = option.imei;
					const {status,cardParam} = await getCardParam(option.imei);
					this.status = status;
					this.cardParam = cardParam;
					if(cardParam.longitude && cardParam.latitude){
						this.amapCenter = [cardParam.longitude,cardParam.latitude];
					}else{
						this.$wx.ready(()=>{
							this.$wx.getLocation({
							  type: 'gcj02',
							  success: (res)=>{
								this.amapCenter = [res.longitude,res.latitude];
							  },
							});
						});
					}
					this.baseParam = await baseCardParam(option.imei);
					this.disturbList = await getDisturbList(option.imei,false);
					this.isModeOne(this.baseParam.mode);
					this.$nextTick(()=>{
						this.displayWin();
						this.getOpenArea(option.imei);
					})
				}catch(e){
					//TODO handle the exception
					console.log("实时定位异常"+e)
				}
			},
			// 是不是实时模式  需要多次调用
			isModeOne(mode){
				if(mode == 1){
					this.btmList[2].isDis = false;
					this.btmList[3].isDis = true;
					return;
				}
				this.btmList[2].isDis = true;
				this.btmList[3].isDis = false;
			},
			// 底部导航栏点击
			btmNavgaTo(idx){
				switch(idx){
					// 实时定位
					case 0:
					this.getRefresh();
					break;
					// 导航
					case 1:
					this.getNavgati();
					break;
					// 打开实时定位
					case 2:
					this.isLocationTime = true;
					this.isOpen = true;
					break;
					// 关闭实时定位
					case 3:
					this.isLocationTime = true;
					this.isOpen = false;
					break;
				}
				// console.log(idx);
				// console.log(this.$refs.amap.$$getInstance())
				// console.log(this.$refs.amap.$$getCenter())
			},
			// 刷新事件
			getRefresh(){
				// 计算一下时间
				if(this.throttlingTime){
					const nowTime = (new Date().getTime()) - this.throttlingTime;
					// 点击刷新再5秒之内做节流操作
					if(nowTime > 5000){
						this.getTimeLocation();
						this.throttlingTime = new Date().getTime();
					}
					return;
				}
				this.getTimeLocation();
				this.throttlingTime = new Date().getTime();
			},
			// 导航事件
			getNavgati(){
				// 导航 H5 调用的是微信的jssdk进行导航
				// #ifdef H5
				if(!this.cardParam.address){
					this.$Q.tipUrl({tip:"没有获取到地址信息"});
					return;
				}
				this.$wx.ready(()=>{
					this.$wx.openLocation({
						// 纬度，浮点数，范围为90 ~ -90
						latitude: this.cardParam.latitude, 
						// 经度，浮点数，范围为180 ~ -180。
						longitude: this.cardParam.longitude, 
						// 位置名
						name: this.cardParam.address,
						// 地址详情说明
						address:this.cardParam.address, 
						fail:()=>{
							this.$Q.tipUrl({tip:"导航失败,重新进入"})
						}
					})
				});
				// #endif
			},
			// 打开实时定位
			async getOpenTime(){
				if(! (await judgeMode(this.baseParam,this.disturbList))) return;
				
				const data = {
					imei: this.imei,
					mode: "1", // 实时模式  直接
					operatorId: this.operatorId
				};
				const cardDate = await setModeDate(this.status,data);
				if(cardDate){
					this.isModeOne(1);
					this.$Q.tipUrl({tip:"打开成功"});
					this.isLocationTime = false;
				}
			},
			// 关闭实时定位
			async getCloseTime(){
				const data = {
					imei: this.imei,
					mode: "3", // 省电模式  直接
					operatorId: this.operatorId
				};
				const cardDate = await setModeDate(this.status,data);
				if(cardDate){
					this.isModeOne(3);
					this.$Q.tipUrl({tip:"关闭成功"});
					this.isLocationTime = false;
					clearInterval(this.closeTimerMode);
					this.closeTimerMode = null;
				}
			},
			// 实时定位事件
			async getTimeLocation(){
				const cardDate = await getTimeLocation(this.status,this.imei);
				if(cardDate){
					this.amapCenter  = cardDate.amapCenter;
					this.cardParam.address = cardDate.addressDate;
					this.cardParam.locationDate = cardDate.locationDate;
				}
			},
			// 显示窗体和显示标点
			displayWin(){
				let amapMarker = {
					position: this.amapCenter,
					events:{
					  click:()=>{
					    this.amapWindow.visible = !this.amapWindow.visible;
					  }
					}
				}
				let amapWindow = {
					position: this.amapCenter,
				    offset:[5,-30],//窗体偏移
				    visible: true,//初始是否显示
					events:{ }
				  };
				this.amapWindow = amapWindow;
				this.amapMarker = amapMarker;
			},
			// 5分钟之后如果离开了就关闭实时模式
			setTimerMode(data){
				// 先清理一下之前存在的定时器
				if(this.closeTimerMode){
					this.closeTimerMode = null;
				}
				// 5分钟的定时器
				this.closeTimerMode = setTimeout(()=>{
					console.log("执行了5分钟自动扫描")
					if(!data && this.baseParam.mode == 1){
						const data = {
							imei: this.imei,
							mode: "3", // 省电模式  直接
							operatorId: this.operatorId
						};
						setModeDate(this.status,data,false)
					}
				},300000);
			},
			// 获取要显示的安全区域以及危险区域
			async getOpenArea(imei){
				// 安全区域
				const stationList = await getSecurityDate(imei);
				// 危险区域
				const dangerList = await getSecurityDate(imei,1);
				const stationArea = cardAreaPart(stationList);
				const dangerArea = cardAreaPart(dangerList);
				this.staCirList = stationArea.circlesList.filter(item => item.switchFlag == 1);
				this.staPolList = stationArea.polygonsList.filter(item => item.switchFlag == 1);
				this.danCirList = dangerArea.circlesList.filter(item => item.switchFlag == 1);
				this.danPolList = dangerArea.polygonsList.filter(item => item.switchFlag == 1);
			}
		},
		filters:{
			getDate(val){
				if(val) return val;
				return "暂无"
			}
		}
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	.container-amap{
		width: 100vw;
		height: 88vh;
	}
	.container-btm{
		z-index: 99;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 13vh;
		background-color: #FFFFFF;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.10); 
		@include flex();
		padding: 0 40rpx;
		.btm-item{
			@include flex($hov:center);
			flex-direction: column;
			.item-name{
				font-size: $fontSize03;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: 400;
				text-align: left;
				color: #333333;
				margin-top: 13rpx;
			}
			&.btm-items{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
		}
	}
	.container-open{
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(#000000,.6);
		.open{
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			@include flex($hov:center);
			flex-direction: column;
			.open-box{
				width: 568rpx;
				height: 628rpx;
				background: #ffffff;
				border-radius: 24rpx;
				@include flex($hov:center);
				flex-direction: column;
				.box-content{
					@include flex($hov:center);
					flex-direction: column;
					padding-top: 54rpx;
					font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
					.content-title{
						margin-top: 60rpx;
						margin-bottom: 40rpx;
						font-size: 38rpx;
						font-weight: 500;
						color: #333333;
					}
					.content-dateil{
						font-size: $fontSize02;
						font-weight: 400;
						color: #999999;
					}
				}
				.box-btn{
					font-size: $fontSize01;
					font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
					text-align: center;
					color: #ffffff;
					background: #ff8a00;
					width: 499rpx;
					height: 88rpx;
					border-radius: 44rpx;
					margin-top: 80rpx;
					@include flex($hov:center);
				}
			}
			.open-colse{
				margin-top: 80rpx;
			}
		}
	}
}
</style>
