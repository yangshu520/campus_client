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
				<input placeholder="输入安全区域名称" maxlength="12" v-model.trim="securityTitle" />
				<view class="btm-confirm" @click="conAddOrEdit">确定</view>
			</view>
			<!-- end -->
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
	export default {
		components:{
			areaHandle
		},
		data() {
			return {
				imei:null,
				status:null,
				securityTitle:"",
				toolbarIdx: -1,
				locateId:'',
				
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
				const secuEdit = uni.getStorageSync("secuEdit");
				if(secuEdit){
					this.toolbarIdx = secuEdit.type;
					this.locateId = secuEdit.id;
					this.securityTitle = secuEdit.stationName;
					if(secuEdit.type == 1){
						this.circleLng = secuEdit.centerLongitude;
						this.circleLat = secuEdit.centerLatitude;
						this.circleRadius = secuEdit.radius;
						
						this.$nextTick(() => {
							const latlon = [secuEdit.centerLongitude,secuEdit.centerLatitude];
							this.setEditMap(latlon);
							// 需要展示圆形
							this.circle = new AMap.Circle({
								center:[secuEdit.centerLongitude,secuEdit.centerLatitude],
								radius: secuEdit.radius, //半径
								borderWeight: 3,
								strokeColor: "#04ed07", 
								strokeOpacity: 1,
								strokeWeight: 6,
								strokeOpacity: 0.2,
								fillOpacity: 0.4,
								strokeDasharray: [10, 10],
								fillColor: '#04ed07',
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
					}else if(secuEdit.type==2){
						// 需要还原数据
						const list=[];
						secuEdit.locationList.split(",").forEach((item,index)=>{
							list.push(item.split("-").reverse());
						});
						this.$nextTick(() => {
							const latlon = list[0]
							this.setEditMap(latlon);
							var polygon = new AMap.Polygon({
							    map: this.map,
							    path: list,
							    strokeColor: "#04ed07",
							    strokeOpacity: 1,
							    strokeWeight: 3,
							    fillColor: "#04ed07",
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
			},
			selectAdress({title,latlon}){
				this.disComMap(latlon);
				this.securityTitle = title;
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
				if(this.toolbarIdx == 2 && this.polygonEditor){
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
					strokeColor: "#1EE143", 
					strokeOpacity: 1,
					strokeWeight: 6,
					strokeOpacity: 0.2,
					fillOpacity: 0.4,
					strokeDasharray: [10, 10], 
					// 线样式还支持 'dashed'
					fillColor: '#1EE143',
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
					    strokeColor: "#1EE143",
					    strokeOpacity: 1,
					    strokeWeight: 3,
					    fillColor: "#1EE143",
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
				if(this.polygonEditor){
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
				
				if(!this.securityTitle){
					this.$Q.tipUrl({tip:"请填写安全区域名称"});
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
				try{
					// 圆形保存数据
					if(this.toolbarIdx == 1){
						const data = {
							id: this.locateId,
							imei: this.imei,
							stationName: this.securityTitle,
							stationType: String(this.toolbarIdx),
							centerLatitude: String(this.circleLat),
							centerLongitude: String(this.circleLng),
							radius: String(this.circleRadius),
							operatorId: this.operatorId
						};
						this.setReqMap(data);
						return;
					}
					
					if(this.polygonEditor){
						this.polygonEditor.close();
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
						id: this.locateId,
						imei: this.imei,
						stationName: this.securityTitle,
						stationType: String(this.toolbarIdx),
						locationList: locationListStr,
						operatorId: this.operatorId
					};
					this.setReqMap(data);
				}catch(e){
					//TODO handle the exception
					alert(e)
				}
			},
			// 发送请求添加数据
			async setReqMap(data){
				const backDate = await setMapDateArea(this.status,data,true);
				if(backDate){
					this.$Q.tipUrl({
						tip:"操作成功",
						delta:1
					})
				}
			}
		},
		onHide() {
			uni.removeStorageSync("secuEdit");
		},
		onUnload() {
			uni.removeStorageSync("secuEdit");
		},
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	.container-map{
		width: 100vw;
		height: 92vh;
		@include flex($hov:center);
		font-size: $fontSize03;
		color: #ccc;
	}
	.container-btm{
		z-index: 999;
		width: 100%;
		height: 8vh;
		position: fixed;
		bottom: 0;
		left: 0;
		@include flex();
		background-color: #FFFFFF;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.10); 
		padding: 0 30rpx;
		input{
			flex: 1;
			padding-right: 20rpx;
		}
		.btm-confirm{
			width: 128rpx;
			height: 60rpx;
			background: #44ceff;
			border-radius: 8rpx;
			color: #FFFFFF;
			font-size: $fontSize02;
			letter-spacing: 2rpx;
			@include flex($hov:center);
		}
	}
}
</style>
