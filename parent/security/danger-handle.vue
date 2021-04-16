<template>
	<view>
		<view class="container">
			<!-- 地图 start -->
			<view class="container-map" id="containerMap">地图加载中...</view>
			<!-- end -->
			
			<!-- 搜索以及按钮 -->
			<area-handle 
			:toolbarIdx="toolbarIdx"
			@selectAdress="selectAdress"
			@handleCircle="handleCircle"
			@handleRectangle="handleRectangle"
			@handleClear="handleClear"/>
				
			<!-- 底部 start -->
			<view class="container-btm">
				<view class="btm-item">
					<input placeholder="输入危险区域名称" maxlength="12" v-model.trim="dangerTitle" />
					<view class="item-confirm" @click="conAddOrEdit">确定</view>
				</view>
				<view class="btm-item">
					<view :class="item.isWeek?'select-name':''"
					class="item-name" 
					v-for="(item,index) in weeks" :key="index"
					@click="weekSelect(index)">
						{{item.name}}
					</view>
				</view>
				<view class="btm-item">
					<view class="item-title">时间范围</view>
					<view class="item-time">
						<text @click="disTime('start-time')">{{startTime}}</text>
						<text>-</text>
						<text @click="disTime('end-time')">{{endTime}}</text>
					</view>
				</view>
			</view>
			<!-- end -->
			
			<!-- 时间选择 -->
			<date-time-picker 
			ref='start-time' 
			type='hour-minute' 
			:datestring='startTime' 
			@change='startTimeChange' />
			<date-time-picker 
			ref='end-time' 
			type='hour-minute' 
			:datestring='endTime' 
			@change='endTimeChange' />
		</view>
	</view>
</template>

<script>
	import {
	getOperatorId,
	getCardParam,
	setMapDateArea
	} from "@/common/httpApi/cardHttpApi.js"
	import areaHandle from "@/components/area-handle.vue"
	import dateTimePicker from '@/uni-components/bory-dateTimePicker/bory-dateTimePicker.vue'
	export default {
		components:{
			areaHandle,dateTimePicker
		},
		data() {
			return {
				imei:null,
				status:null,
				dangerTitle:"",
				toolbarIdx: -1,
				dangerId:'',
				startTime:"09:00",
				endTime:"18:00",
				weeks:[{
						id:7,
						name:'日',
						isWeek:true
					},{
						id:1,
						name:'一',
						isWeek:true
					},{
						id:2,
						name:'二',
						isWeek:true
					},{
						id:3,
						name:'三',
						isWeek:true
					},{
						id:4,
						name:'四',
						isWeek:true
					},{
						id:5,
						name:'五',
						isWeek:true
					},{
						id:6,
						name:'六',
						isWeek:true
					}],
				
				// 地图相关的数据
				map:null,
				icon:null,
				
				// 构建圆形相关数据
				circleEditor:null,
				circleLng:"",
				circleLat:"",
				circleRadius:"",
				circle:null,
				circleListener:null,
				
				// 构建矩形相关数据
				polygonEditor:null,
				polygonPath:[],
				resPolygon:[],
				beginPoints:[],
				beginMarks:[],
				beginNum: 0,
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		methods:{
			// 初始化数据
			async getInitDate(option){
				this.imei = option.iemi;
				this.operatorId = getOperatorId();
				this.imei = option.imei;
				const {status} = await getCardParam(option.imei);
				this.status = status;
				// 修改操作
				if(option.typeDate){
					this.getMapEdit();
					return;
				}
				this.setMapInit();
			},
			getMapEdit(){
				try{
					const dangerEdit = uni.getStorageSync("dangerEdit");
					if(dangerEdit){
						this.toolbarIdx = dangerEdit.type;
						this.dangerId = dangerEdit.id;
						this.dangerTitle = dangerEdit.fenceName;
						
						// 处理周期与时间数据
						this.startTime = dangerEdit.startTime ? dangerEdit.startTime.substr(0,2)+":"+dangerEdit.startTime.substr(2,2) : "";
						this.endTime = dangerEdit.startTime ? dangerEdit.endTime.substr(0,2)+":"+dangerEdit.endTime.substr(2,2) : "";
						const weekList = [dangerEdit.monDisable,dangerEdit.tueDisable,dangerEdit.wedDisable,dangerEdit.thuDisable,dangerEdit.friDisable,dangerEdit.satDisable,dangerEdit.sunDisable]
						const listArr = [];
						weekList.forEach((item,index) => {
							listArr.push(String(index+1)+item);
						});
						const str = listArr.join('');
						const week = ['一','二','三','四','五','六','日'];
						const fliterArr = str.split('').filter((item,index) => index%2 !== 0);
						const weeks = [];
						fliterArr.forEach((item,index)=>{
							weeks.push({
								id: index+1,
								name: week[index],
								isWeek: Boolean(Number(item))
							})
						});
						this.weeks = weeks;
						// 显示地图
						if(dangerEdit.type == 1){
							this.circleLng = dangerEdit.centerLongitude;
							this.circleLat = dangerEdit.centerLatitude;
							this.circleRadius = dangerEdit.radius;
							
							this.$nextTick(() => {
								const latlon = [dangerEdit.centerLongitude,dangerEdit.centerLatitude];
								this.setEditMap(latlon);
								// 需要展示圆形
								this.circle = new AMap.Circle({
									center:[dangerEdit.centerLongitude,dangerEdit.centerLatitude],
									radius: dangerEdit.radius, //半径
									borderWeight: 3,
									strokeColor: "#ff0000", 
									strokeOpacity: 1,
									strokeWeight: 6,
									strokeOpacity: 0.2,
									fillOpacity: 0.4,
									strokeDasharray: [10, 10],
									fillColor: '#ff0000',
									zIndex: 50,
								});
								
								//构建圆图对象
								this.map.add(this.circle);
								this.circleEditor = this.createEditorCircle(this.circle);
								// 初始化多边形
								const polygon = new AMap.Polygon({});
								//构造折线编辑对象，并开启折线的编辑状态
								this.polygonEditor = new AMap.PolyEditor(this.map,polygon);
							});
						}else if(dangerEdit.type==2){
							// 需要还原数据
							const list = [];
							dangerEdit.locationList.split(",").forEach((item,index)=>{
								list.push(item.split("-").reverse());
							});
							this.$nextTick(() => {
								const latlon = list[0]
								this.setEditMap(latlon);
								var polygon = new AMap.Polygon({
								    map: this.map,
								    path: list,
								    strokeColor: "#ff0000",
								    strokeOpacity: 1,
								    strokeWeight: 3,
								    fillColor: "#ff0000",
								    fillOpacity: 0.35
								});
								this.polygonEditor = this.createEditor(polygon);
								// 初始化圆形
								const circle = new AMap.Circle({});
								//构建圆图对象
								this.circleEditor = new AMap.CircleEditor(this.map,circle);
								
							});
						}
						return
					}
					this.$Q.tipUrl({
						tip:"获取数据失败,请重进",
						delta:1
					});
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			// 开始选择时间
			startTimeChange(e){
				this.startTime = e;
			},
			// 选择结束时间
			endTimeChange(e){
				this.endTime = e;
			},
			// 选择周期时间
			weekSelect(idx){
				this.weeks[idx].isWeek = !this.weeks[idx].isWeek;
			},
			// 显示时间的选择
			disTime(picker){
				this.$refs[picker].show();
			},
			selectAdress({title,latlon}){
				this.disComMap(latlon);
				this.dangerTitle = title;
			},
			setMapInit(){
				this.$wx.ready( ()=>{
					this.$wx.getLocation({
						type: 'gcj02',
						success:(res)=>{
							const latlon = [res.longitude,res.latitude];
							this.disComMap(latlon);
						}
					})
				});
				setTimeout(()=>{
					if(!this.map){
						this.$Q.tipUrl({
							tip:"地图加载超时,请重进",
							delta:2
						})
					}
				},5000)
			},
			// 公共的地图显示
			disComMap(latlon){
				this.$nextTick(() => {
					this.map = new AMap.Map("containerMap", {
						resizeEnable: true,
						center:latlon,
						zoom: 25
					});
					this.icon = new AMap.Icon({
					    size: new AMap.Size(38, 48),
					    image: "/static/img/parent/location-icon.png",
						imageSize: new AMap.Size(38, 48)
					});
					var marker = new AMap.Marker({
					    icon: this.icon,
					    position: latlon,
					});
					this.map.add(marker);
					this.map.addControl(new AMap.ToolBar());
					this.setInitBuild();
				});
			},
			// 构建圆形 或者 矩形
			setInitBuild(){
				// 初始化圆形
				const circle = new AMap.Circle({});
				//构建圆图对象
				this.circleEditor = new AMap.CircleEditor(this.map,circle);
				
				// 初始化多边形
				const polygon = new AMap.Polygon({});
				//构造折线编辑对象，并开启折线的编辑状态
				this.polygonEditor = new AMap.PolyEditor(this.map,polygon);
			},
			// 修改初始化地图
			setEditMap(latlon){
				this.map = new AMap.Map("containerMap", {
					resizeEnable: true,
					center:latlon,
					zoom: 25
				});
				this.icon = new AMap.Icon({
				    size: new AMap.Size(38, 48),
				    image: "/static/img/parent/location-icon.png",
					imageSize: new AMap.Size(38, 48)
				});
				var marker = new AMap.Marker({
				    icon: this.icon,
				    position: latlon,
				});
				this.map.add(marker);
				this.map.addControl(new AMap.ToolBar());
			},
			// 点击圆形工具
			handleCircle(){
				if(this.polygonEditor){
					this.polygonEditor.close();
				}
				// 1 圆形 2 矩形 3 清除
				if(!this.polygonPath.length && this.toolbarIdx == 2){
					this.$Q.tipUrl({tip:"先完成矩形绘制,再操作圆形"});
					return
				}
				
				this.toolbarIdx = 1;
				
				if(this.polygonPath.length){
					this.map.remove(this.resPolygon);
					this.polygonPath = [];
				}
				
				if(this.circle){
					this.map.remove(this.circle);
					this.circleEditor.close(true);
					this.circle = null;
				}
				
				this.circleListener = new AMap.event.addListener(this.map, "click", this.mapOnCircle);
			},
			mapOnCircle(e){
				new AMap.event.removeListener(this.circleListener);
				
				if(this.circle){
					this.map.remove(this.circle);
					this.circleEditor.close(true);
				}
				this.circleLng = e.lnglat.getLng();
				this.circleLat = e.lnglat.getLat();
				
				this.circleRadius = 300;
				
				this.circleEditor.close();
				
				this.circle = new AMap.Circle({
					center: [e.lnglat.getLng(),e.lnglat.getLat()],
					radius: this.circleRadius, //半径
					borderWeight: 3,
					strokeColor: "#ff0000", 
					strokeOpacity: 1,
					strokeWeight: 6,
					strokeOpacity: 0.2,
					fillOpacity: 0.4,
					strokeDasharray: [10, 10], 
					// 线样式还支持 'dashed'
					fillColor: '#ff0000',
					zIndex: 50,
				});
				//构建圆图对象
				this.map.add(this.circle);
				this.circleEditor = this.createEditorCircle(this.circle);
			},
			createEditorCircle(circle){
				var circleEditor = new AMap.CircleEditor(this.map,circle);
				circleEditor.open();
				new AMap.event.addListener(circleEditor,'move',(event)=>{
					this.circleLat = event.lnglat.lat;
					this.circleLng = event.lnglat.lng;
				});
				new AMap.event.addListener(circleEditor,'adjust',(event)=>{
					this.circleRadius = event.radius;
					if(this.circleRadius >= 600){
						this.$Q.tipUrl({tip:"半径最大为600,超过按600添加"})
						this.circleRadius = 600;
					}
				});
				return circleEditor;
			},
			// 点击矩形工具
			handleRectangle(){
				if(!this.circleLat && this.toolbarIdx == 1){
					this.$Q.tipUrl({tip:"先完成圆形绘制,再操作矩形"});
					return
				}
				
				this.toolbarIdx = 2;
				
				if(this.circle){
					this.map.remove(this.circle);
					this.circleEditor.close(true);
					this.circle = null;
				}
				
				if(this.polygonEditor){
					this.polygonEditor.close();
				}
				
				if(this.polygonPath.length){
					this.map.remove(this.resPolygon);
					this.polygonPath = [];
				}
				
				this.beginNum = 0;
				this.beginPoints = [];
				this.beginMarks = [];
				this.polygonEditor = null;
				this.clickListener = new AMap.event.addListener(this.map, "click", this.mapOnClick);
			},
			mapOnClick(e) {
			    this.beginMarks.push(this.addMarker(e.lnglat));
			    this.beginPoints.push(e.lnglat);
			    this.beginNum ++ ;
			    if(this.beginNum == 3){
			        new AMap.event.removeListener(this.clickListener);
					var polygon = new AMap.Polygon({
					    map: this.map,
					    path: this.beginPoints,
					    strokeColor: "#ff0000",
					    strokeOpacity: 1,
					    strokeWeight: 3,
					    fillColor: "#ff0000",
					    fillOpacity: 0.35
					});
			        this.polygonEditor = this.createEditor(polygon);
					this.map.remove(this.beginMarks);
			    }
			},
			createEditor(polygon){
			    var polygonEditor = new AMap.PolyEditor(this.map, polygon);
			    polygonEditor.open();
			    new AMap.event.addListener(polygonEditor,'end',this.polygonEnd);
			    return polygonEditor;
			},
			polygonEnd(res){
			    this.resPolygon.push(res.target);
				const pathList = [];
				res.target.getPath().forEach(item=>{
					pathList.push({
						lng:item.lng,
						lat:item.lat
					})
				});
				this.polygonPath = pathList;
			},
			addMarker(lnglat) {
			    var marker = new AMap.Marker({
			        icon: this.icon,
			        position: lnglat
			    });
				this.map.add(marker);
			    return marker;
			},
			// 点击清除工具
			handleClear(){
				if(this.toolbarIdx == 2 && this.polygonEditor){
					this.polygonEditor.close();
				}
				
				if((!this.circle && this.toolbarIdx == 1) 
				|| 
				(!this.polygonPath.length && this.toolbarIdx == 2) 
				|| this.toolbarIdx == -1){
					this.$Q.tipUrl({tip:"没有常用地址可以清除"});
					return 
				}
				
				this.toolbarIdx = -1;
				
				if(this.circle){
					this.map.remove(this.circle);
					// 清除圆形以及相关的数据
					this.circleEditor.close(true);
					this.circle = null;
					this.circleLng = "";
					this.circleLat = "";
					this.circleRadius = "";
				}
				if(this.polygonPath.length){
					this.map.remove(this.resPolygon);
					// 矩形的数据
					this.polygonPath = [];
				}
			},
			// 添加或者是修改安全区域
			conAddOrEdit(){
				
				if(!this.dangerTitle){
					this.$Q.tipUrl({tip:"请填写危险区域名称"});
					return;
				}
				const weekFil = this.weeks.filter(item => item.isWeek == true);
				if(!weekFil.length){
					this.$Q.tipUrl({tip:"请选择启用周期"});
					return;
				}
				if(!this.endTime || !this.startTime){
					this.$Q.tipUrl({tip:"请选择启用时间"});
					return;
				}
				if(this.endTime == this.startTime){
					this.$Q.tipUrl({tip:"启用时间不能相同"});
					return;
				}
				if(this.polygonEditor){
					this.polygonEditor.close();
				}
				
				if(this.toolbarIdx == -1){
					this.$Q.tipUrl({tip:"请绘制安全区域"});
					return;
				}
				
				if((this.toolbarIdx == 2 && !this.polygonPath.length) ||
				(this.toolbarIdx == 1 && (!this.circleRadius || !this.circleLat))){
					this.$Q.tipUrl({tip:"请绘制安全区域"});
					return;
				}
				// 通过了保存数据
				this.saveDateMap();
			},
			async saveDateMap(){
				// 处理周期数据
				const weekArr = [];
				this.weeks.forEach(item=>{
					weekArr.push(String(item.id) + Number(item.isWeek))
				});
				const cycleStr = weekArr.join('');
				// 圆形保存数据
				if(this.toolbarIdx == 1){
					const data = {
						id: this.dangerId,
						imei: this.imei,
						startTime: this.startTime,
						endTime: this.endTime,
						cycle: cycleStr,
						fenceName: this.dangerTitle,
						fenceType: String(this.toolbarIdx),
						centerLatitude: String(this.circleLat),
						centerLongitude: String(this.circleLng),
						radius: String(this.circleRadius),
						operatorId: this.operatorId
					};
					this.setReqMap(data);
					return;
				}
				
				// 开始构建需要的数据格式
				const optionPath = [];
				this.polygonPath.forEach(item=>{
					const list=[];
					list.push(item.lat);
					list.push(item.lng);
					optionPath.push(list);
				});
				let locationListStr;
				optionPath.forEach((item,index) => {
					if(optionPath.length-1 == index){
						locationListStr += item.join("-")
					}else if(index == 0){
						locationListStr = item.join("-")+","
					}else{
						locationListStr += item.join("-")+","
					}
				});
				const data = {
					id: this.dangerId,
					imei: this.imei,
					startTime: this.startTime,
					endTime: this.endTime,
					cycle: cycleStr,
					fenceName: this.dangerTitle,
					fenceType: String(this.toolbarIdx),
					locationList: locationListStr,
					operatorId: this.operatorId
				};
				this.setReqMap(data);
			},
			// 发送请求添加数据
			async setReqMap(data){
				const backDate = await setMapDateArea(this.status,data);
				if(backDate){
					this.$Q.tipUrl({
						tip:"操作成功",
						delta:1
					})
				}
			}
		},
		onHide() {
			uni.removeStorageSync("dangerEdit");
		},
		onUnload() {
			uni.removeStorageSync("dangerEdit");
		},
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	.container-map{
		width: 100vw;
		height: 79vh;
		@include flex($hov:center);
		font-size: $fontSize03;
		color: #ccc;
	}
	.container-btm{
		z-index: 999;
		width: 100%;
		height: 21vh;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #FFFFFF;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.10); 
		.btm-item{
			padding: 0 30rpx;
			height: 7vh;
			width: 100%;
			border-bottom: 2rpx solid #f5f5f5;
			@include flex();
			input{
				flex: 1;
				padding-right: 20rpx;
			}
			.item-confirm{
				width: 128rpx;
				height: 60rpx;
				background: #44ceff;
				border-radius: 8rpx;
				color: #FFFFFF;
				font-size: $fontSize02;
				letter-spacing: 2rpx;
				@include flex($hov:center);
			}
			.item-name{
				font-size: $fontSize03;
				color: #333333;
				@include flex($hov:center);
				width: 50rpx;
				height: 50rpx;
				&.select-name{
					color: #3cb2ef;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}
			.item-title{
				font-size: $fontSize02;
				color: #333333;
			}
			.item-time{
				font-size: $fontSize03;
				color: #9c9c9c;
			}
		}
		
	}
}
</style>