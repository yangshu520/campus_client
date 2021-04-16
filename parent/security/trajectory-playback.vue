<template>
	<view>
		<view class="container">
			<!-- 地图 -->
			<view class="container-map" v-show="disMap">
				<!-- 时间选这 start -->
				<view class="map-time">
					<view class="time-day" @click="toDay" :class="tabSelectIdx == 0?'time-days':''">今天</view>
					<text>|</text>
					<view class="time-day" @click="yesDay" :class="tabSelectIdx == 1?'time-days':''">昨天</view>
					<text>|</text>
					<view class="time-day" @click="tabSelectIdx = 2" :class="tabSelectIdx == 2?'time-days':''">
						<day-time-date
						:maxSelect="maxSelectTime"
						@getData="timeContr"
						>日期</day-time-date>
					</view>
				</view>
				<!-- end -->
				
				<!-- 地图 -->
				<view id="containerMap">地图加载中...</view>
			</view>
			<!-- 足迹列表 -->
			<view class="container-list" v-show="!disMap">
				<u-time-line>
					<u-time-line-item v-for="(item,index) in footprintList" :key="index">
						<template v-slot:node>
							<view class="u-node" />
						</template>
						<template v-slot:content>
							<view class="item">
								<view class="item-time">
									{{item.createDate && item.createDate.substr(0,16)}}
								</view>
								<view class="item-title">
									{{item.address}}
								</view>
								<view class="item-name">
									<u-image shape="circle" :src="student.iconLink || '/static/img/home/avter.png'"
									height="64rpx" width="66rpx">
										<u-loading slot="loading"></u-loading>
									</u-image>
									<view class="name-student">{{student.studentName}}</view>
								</view>
								<!-- 地图 -->
								<view class="item-amap">
									<map :latitude="item.latitude" 
									:longitude="item.longitude"
									:markers="[
										{
											id:index,
											latitude:item.latitude,
											longitude:item.longitude
										}
									]"
									/>
								</view>
							</view>
						</template>
					</u-time-line-item>
				</u-time-line>
				<common-empty 
				boxWidth="100%"
				:noData="!footprintList.length" />
				<view style="height: 102rpx;" />
			</view>
		</view>
		
		<!-- 底部导航栏 -->
		<area-tab-btm
		:isTraje="true"
		@addMap="trajeAnima"
		@disList="disMap = true"
		@disMap="disMap = false"/>
	</view>
</template>

<script>
	import {
		getCurrentDate,
		getQueryLocal,
		getQueryFoot
	} from "@/common/httpApi/cardHttpApi.js"
	import areaTabBtm from "@/components/area-tab-btm.vue"
	import dayTimeDate from "@/components/day-time-date.vue"
	export default {
		components:{areaTabBtm,dayTimeDate},
		data() {
			return {
				imei:"",
				disMap:true,
				tabSelectIdx:0,
				maxSelectTime:'',
				student:{},
				startTime:"",
				endTime:"",
				footprintList:[],
				// 地图需要的数据
				footprintMap:[],
				oneLoca:[],
				lastLoca:[],
				lineList:[],
				marker:null,
				map:null,
				polyline:null,
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		methods:{
			// 初始化数据
			getInitDate(option){
				try{
					this.imei = option.imei;
					const nowDay = getCurrentDate(3);
					this.maxSelectTime = nowDay.replace(/-/g,'/');
					this.student = uni.getStorageSync("student");
					if(option.time){
						this.setTime(option.time);
						this.tabSelectIdx = 2;
					}else{
						this.setTime(nowDay);
					}
					this.getLocalList(option.imei);
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
				
			},
			// 轨迹播放
			trajeAnima(){
				if(!this.lineList.length){
					this.$Q.tipUrl({tip:"暂无数据,无法模拟"});
					return;
				}
				this.marker.moveAlong(this.lineList,300);
			},
			// 今天
			toDay(){
				this.tabSelectIdx = 0;
				const nowDay = getCurrentDate(3);
				this.setTime(nowDay);
			},
			// 昨天
			yesDay(){
				this.tabSelectIdx = 1;
				const yesDay = getCurrentDate(4);
				this.setTime(yesDay);
			},
			// 选择时间
			timeContr(val){
				this.setTime(val);
			},
			// 获取足迹数据
			async getLocalList(imei){
				try{
					const data = {
						imei:imei,
						start: this.startTime,
						end: this.endTime,
					}
					this.footprintList = await getQueryFoot(data);
					const cardDate = await getQueryLocal(data);
					if(cardDate.length){
						// 存一下需要的数据
						this.oneLoca = cardDate[0].location.split(',');
						this.lastLoca = cardDate[cardDate.length?cardDate.length-1:0].location.split(',')
						const LocaList = [];
						cardDate.forEach(item => {
							LocaList.push(item.location.split(','))
						});
						this.lineList = LocaList;
						this.marker = LocaList;
						this.initMap();
						this.initRoad();
						return
					}
					this.$Q.tipUrl({tip:"暂无足迹数据"});
					this.$wx.ready(()=>{
						this.$wx.getLocation({
						  type: 'gcj02',
						  success: (res)=>{
							this.oneLoca = [res.longitude,res.latitude];
							this.lastLoca = [];
							this.marker = [];
							this.lineList = [];
							this.initMap();
						  },
						});
					});
					setTimeout(()=>{
						if(!this.map){
							this.$Q.tipUrl({
								tip:"地图加载超时,请重进",
								delta:1
							})
						}
					},5000);
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			// 统一需要设置时间
			setTime(val){
				// this.startTime = val+' 00:00:00';
				// this.endTime = val+' 23:59:59';
				this.startTime = val;
				
				const temp = new Date(val).getTime()+24*60*60*1000;
				const date = new Date(temp);
				const y = date.getFullYear();
				const m = date.getMonth()+1;
				const d = date.getDate();
				
				
				this.endTime = y + '-' + (m >=10?m:'0'+m) + '-' + (d>=10?d:'0'+d);
				this.getLocalList(this.imei);
			},
			//初始化地图
			initMap() {
			    try{
			    	this.map = new AMap.Map("containerMap", {
			    	    resizeEnable: true, //窗口大小调整
			    	    center: this.oneLoca, //中心,
			    	    zoom: 20,
			    		viewMode:'3D'
			    	 });
			    	this.marker = new AMap.Marker({
			    	    map: this.map,
			    	    position: this.oneLoca,
			    	    icon:'/static/img/parent/traje-icon.png',
			    	    offset: new AMap.Pixel(-26, -26), //调整图片偏移
			    	    autoRotation: true, //自动旋转
			    	    // angle: -90 //图片旋转角度
			    	});
			    }catch(e){
			    	//TODO handle the exception
					console.log(e)
			    }
			},
			//初始化轨迹
			initRoad() {
			  //绘制还未经过的路线
			  this.polyline = new AMap.Polyline({
				map: this.map,
				path: this.lineList,
				showDir: true,
				strokeColor: "#009e24", 
				strokeOpacity: 0.8, 
				strokeWeight: 4 ,
				strokeStyle: "solid"
			  });
			  //绘制路过了的轨迹
			  var passedPolyline = new AMap.Polyline({
				map: this.map,
				strokeColor: "#0099ff",
				strokeWeight: 4
			  });
			  this.marker.on("moving", e => {
				passedPolyline.setPath(e.passedPath);
			  });
			  this.map.setFitView(); //合适的视口
			},
		}
	}
</script>

<style lang="scss">
.container{
	.container-map{
		width: 100vw;
		height: 100vh;
		.map-time{
			position: fixed;
			top: 30rpx;
			left: 50%;
			z-index: 99;
			transform: translateX(-50%);
			width: 340rpx;
			height: 80rpx;
			opacity: 1;
			background: #ffffff;
			border: 2rpx solid #dcdcdc;
			border-radius: 5rpx;
			box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.10);
			@include flex($hov:center);
			.time-day{
				font-size: $fontSize02;
				font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
				color: #999999;
				height: 100%;
				flex: 1;
				@include flex($hov:center);
				&.time-days{
					color: #028dfb;
				}
			}
			text{
				color: #A0A0A0;
			}
		}
		#containerMap{
			width: 100vw;
			height: 100vh;
			@include flex($hov:center);
			color: #ccc;
		}
	}
	.container-list{
		padding: 0 40rpx;
		.u-node{
			background-color: #FA4169;
			width: 16rpx;
			height: 16rpx;
			border-radius: 50%;
		}
		.item{
			.item-time{
				font-size: $fontSize03;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: 400;
				text-align: left;
				color: #69707f;
				line-height: 56rpx;
			}
			.item-title{
				font-size: $fontSize02;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: bold;
				text-align: left;
				color: #1d1e2c;
				line-height: 42rpx;
				letter-spacing: 2rpx;
			}
			.item-name{
				display: flex;
				align-items: center;
				height: 100rpx;
				.name-student{
					font-size: $fontSize03;
					font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
					font-weight: 400;
					text-align: left;
					color: #1d1e2c;
					margin-left: 30rpx;
				}
			}
			.item-amap{
				height: 300rpx;
				width: 600rpx;
				overflow: hidden;
				border-radius: 20rpx;
				map{
					height: 360rpx;
					width: 100%;
				}
			}
		}
	}
}
</style>
