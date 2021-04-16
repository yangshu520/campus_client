// 此文件只做学生证有关的事情
import $http from '../request/requestConfig.js'
import {
	CARD_AND_LOCATION,
	CRAD_BIND_INFO,
	CARD_PARAM,
	CARD_SPEAKER,
	CARD_MOVEMENT,
	CARD_SOS,
	CARD_STANDBY,
	CARD_DISTURB,
	CARD_DISTURB_SWITCH,
	CARD_DISTURB_SET,
	CARD_WHITE_LIST,
	CARD_MONITOR,
	CARD_STEP,
	CARD_ACTUAL,
	CARD_MODE_SET,
	CARD_STATION,
	CARD_STATION_SWICTH,
	CARD_STATION_DELETE,
	CARD_FENCE_SWITCH,
	CARD_FENCE_DELETE,
	CARD_FENCE_LIST,
	CARD_QUERY_LOCUS,
	CARD_FENCE_HANDLER,
	CARD_QUERY_FOOTPRINT,
	CARD_SMS_LIST,
	CARD_SMS_DELETE,
	CARD_SMS_READ,
	CARD_ELECTR_LIST,
	CARD_STATION_SET,
	CARD_FENCE_SET
} from "../js/apiUrl.js"

// 封装一个获取操作者id
const getOperatorId = ()=>{
	try{
		const roleType = uni.getStorageSync("roleType");
		
		if(roleType == 1){
			return uni.getStorageSync("parentId");
		}else if(roleType == 0){
			return uni.getStorageSync("student").id;
		}
		return undefined;
	}catch(e){
		//TODO handle the exception
		console.log("获取操作者异常"+e)
	}
}

// 根据学生的id去获取是否绑定学生证
const whetherBindCard = async (id)=>{
	const cardDate = await $http.post(CRAD_BIND_INFO,{studentId: id});
	if(cardDate.code == 200){
		if(cardDate.status == 1 && cardDate.data){
			return cardDate.data;
		}else{
			tipError("未绑定学生证,请绑定");
		}
	}else{
		tipError(cardDate.msg);
	}
}


// 根据imei获取电子学生证的信息
const getCardParam = async (imei,load = false)=>{
	if(whetherImei(imei)) return;
	
	const cardDate = await $http.post(CARD_AND_LOCATION,{imei:imei},{load:load});
	if(cardDate.code == 200){
		if(cardDate.status == 1 && cardDate.data){
			const cardParam = cardDate.data;
			const status = cardParam.status == "在线" ? 1 : -1
			return {status,cardParam}
		}else{
			tipError("电子学生证数据为空,联系客服");
		}
	}else{
		tipError(cardParam.msg);
	}
}

// 获取基础参数
const baseCardParam = async (imei)=>{
	if(whetherImei(imei)) return;
	
	const cardDate = await $http.post(CARD_PARAM,{imei:imei});
	if(cardDate.code == 200){
		if(cardDate.status == 1 && cardDate.data){
			return cardDate.data;
		}else{
			tipError("数据获取异常,联系客服");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 设置学生证音量
const setCardSpeaker = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_SPEAKER,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			tipError("设置成功");
			return 'ok';
		}else{
			tipError("设置失败");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 运动提醒开关
const setMovementSwicth = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_MOVEMENT,data);
	if(cardDate.code == 200){
		if(cardDate.status ==1){
			tipError("设置成功");
			return "ok"
		}else{
			tipError("设置失败");
		}
	}else{
		tipError(cardDate.msg)
	}
}

// sos开关
const setSosSwicth = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_SOS,data);
	if(cardDate.code == 200){
		if(cardDate.status ==1){
			tipError("设置成功");
			return "ok"
		}else{
			tipError("设置失败");
		}
	}else{
		tipError(cardDate.msg)
	}
}

// 设置睡眠模式
const setStandby = async (status,data)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_STANDBY,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			return 'ok';
		}else{
			tipError("保存失败");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 获取勿扰模式列表
const getDisturbList = async (data,load = true)=>{
	if(whetherImei(data)) return;
	
	const cardDate = await $http.post(CARD_DISTURB,{imei:data},{load:load});
	if(cardDate.code == 200){
		if(cardDate.status == 1 && Array.isArray(cardDate.data)){
			return cardDate.data
		}else{
			tipError("暂无数据");
			return [];
		}
	}else{
		tipError(cardDate.msg)
	}
}

// 课堂模式开关
const setDisturbSwicth = async (status,data)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_DISTURB_SWITCH,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			tipError("设置成功");
			return 'ok';
		}else{
			tipError("设置失败");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 添加或者修改勿扰模式
const addAnEdiDisturb = async (status,data)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_DISTURB_SET,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			return 'ok';
		}else{
			tipError(cardDate.msg);
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 获取亲情号码或者白名单列表
const getWhiltList = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_WHITE_LIST,data);
	if(cardDate.code == 200 ){
		if(cardDate.status == 1 && Array.isArray(cardDate.data)){
			return cardDate.data;
		}else{
			return []
		}
	}else{
		tipError(cardDate.msg);
		return []
	}
}

// 监听手机号码
const setMonitorPhone = async (status,data)=>{
	const modalDate = await uni.showModal({
		title:"远程聆听",
		content:"你确定要使用该号码聆听吗?",
		confirmText:"聆听"
	})
	if(modalDate[1].confirm){
		if(offTimeStatus(status)) return;
		if(whetherImei(data.imei)) return;
		
		const cardDate = await $http.post(CARD_MONITOR,data);
		if(cardDate.code == 200){
			if(cardDate.status == 1){
				tipError("聆听成功,请注意接听");
				return 'ok'
			}else{
				tipError("聆听失败,稍后重试");
			}
		}else{
			tipError(cardDate.msg);
		}
	}
}

// 是否与情亲号码和白名单重复
const isWhetherRepeat = (arr = [],name,simId,idx,arr1 = [],idx1)=>{
	let isAdopt = false;
	// 比对情亲号码
	arr.forEach((item,index)=>{
		if(index != idx){
			if(item.name == name){
				tipError("名称已存在亲情号码中");
				isAdopt = true;
			}else if(item.simId == simId){
				tipError("号码已存在亲情号码中");
				isAdopt = true;
			}
		}
		
	});
	arr1.forEach((item,index) =>{
		if(index != idx1){
			if(item.name==name){
				tipError("名称已存在白名单中");
				isAdopt = true;
			}else if(item.simId==simId){
				tipError("号码已存在白名单中");
				isAdopt = true;
			}
		}
	});
	
	return isAdopt;
}

// 获取步数的方法
const getSportList = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_STEP,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			return cardDate.data;
		}else{
			tipError("暂无数据");
			return []
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 实时定位的方法
const getTimeLocation = async (status,data)=>{
	try{
		if(offTimeStatus(status)) return;
		if(whetherImei(data)) return;
		
		const cardDate = await $http.post(CARD_ACTUAL,{imei:data},{loadTitip:"定位中...",timeOut:90000,failTip:"定位超时,稍后重试"});
		if(cardDate.code == 200 && cardDate.status == 1){
			if(cardDate.data){
				const amapCenter = [cardDate.data.longitude,cardDate.data.latitude]
				const locationDate = getCurrentDate();
				const reslut = await uni.request({
					url:"https://restapi.amap.com/v3/geocode/regeo?parameters",
					method:"GET",
					data:{
						key:"a226cd27b5d87a14dec79b38ad88b4b1",
						location:[cardDate.data.longitude,cardDate.data.latitude],
					}
				});
				let addressDate = "暂无地址信息";
				if(reslut[1].data.status == 1){
					addressDate = reslut[1].data.regeocode.formatted_address
				}
				tipError("刷新成功")
				return {
					amapCenter,addressDate,locationDate
				}
			}else{
				tipError("刷新失败,稍后再试");
			}
		}else{
			tipError(cardDate.msg);
		}
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
}

// 获取实时定位当前的时间方法
const getCurrentDate = (val)=> {
  var now = new Date();
  if(val == 4){
	   now.setTime(now.getTime()-24*60*60*1000);
  }
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  month = month + 1;
  if(val == 5){
	   return year + "-" + month + "-" + date
  }
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  let time;
  if(val == 1){
	  // 到分
	  time = year + "-" + month + "-" + date+ " " + hour + ":" + minu
  }else if(val == 2){
	  // 月到分
	  time = month + "-" + date+ " " + hour + ":" + minu
  }else if(val == 3 || val == 4){
	  time = year + "-" + month + "-" + date
  }else{
	  // 到秒
	  time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
  }
  return time;
}
// 设置实时模式
const setModeDate = async (status,data,load = true)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data)) return;
	
	const cardDate = await $http.post(CARD_MODE_SET,data,{load:load});
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			return 'ok';
		}else{
			tipError("设置失败,稍后重试");
		}
	}else{
		tipError(cardDate.msg);
	}
}
 
// 判断是否是课堂模式或者勿扰模式时间段
const judgeMode =async (cardParam,disturbList)=>{
	// 先拿到此时的时间
	let isWhether=true;
	const time=new Date();
	const h=time.getHours();
	const m=time.getMinutes();
	
	// 先判断勿扰模式
	if(cardParam.disturbSwitch && disturbList.length){
		// 0600-1800
		disturbList.forEach(item => {
			if(Number(item.startTime) < Number(item.endTime)){
				if(Number(item.startTime.substr(0,2)) < h && h < Number(item.endTime.substr(0,2))){
					tipError("正处于上课勿扰时间段,不能开启实时定位");
					isWhether=false;
				}else if(Number(item.startTime.substr(0,2))==h){
					if(Number(item.startTime.substr(2,2))<=m){
						tipError("正处于上课勿扰时间段,不能开启实时定位");
						isWhether=false;
					}
				}else if(h==Number(item.endTime.substr(0,2))){
					if(m<=Number(item.endTime.substr(2,2))){
						tipError("正处于上课勿扰时间段,不能开启实时定位");
						isWhether=false;
					}
				}
			}else{
				// 23:00-01:00
				if(Number(item.endTime.substr(0,2))<h||h<Number(item.startTime.substr(0,2))){
					tipError("正处于上课勿扰时间段,不能开启实时定位");
					isWhether=false;
				}else if(Number(item.startTime.substr(0,2))==h){
					if(Number(item.startTime.substr(2,2))>=m){
						tipError("正处于上课勿扰时间段,不能开启实时定位");
						isWhether=false;
					}
				}else if(h==Number(item.endTime.substr(0,2))){
					if(m>=Number(item.endTime.substr(2,2))){
						tipError("正处于上课勿扰时间段,不能开启实时定位");
						isWhether=false;
					}
				}
			}
		})
	}
	
	// 后判断睡眠模式
	if(cardParam.sleepSwitch){
		// 6:00-18:00    
		if(Number(cardParam.sleepStart)<Number(cardParam.sleepEnd)){
			if(Number(cardParam.sleepStart.substr(0,2))<h&&h<Number(cardParam.sleepEnd.substr(0,2))){
				tipError("正处于睡眠时间段,不能开启实时定位");
				isWhether=false;
			}else if(Number(cardParam.sleepStart.substr(0,2))==h){
				if(Number(cardParam.sleepStart.substr(2,2))<=m){
					tipError("正处于睡眠时间段,不能开启实时定位");
					isWhether=false;
				}
			}else if(h==Number(cardParam.sleepEnd.substr(0,2))){
				if(m<=Number(cardParam.sleepEnd.substr(2,2))){
					tipError("正处于睡眠时间段,不能开启实时定位");
					isWhether=false;
				}
			}
		}else{
			// 9:00-6:00 暂不处理 21:00 06:00  17
			if(Number(cardParam.sleepEnd.substr(0,2))>h||h>Number(cardParam.sleepStart.substr(0,2))){
				tipError("正处于睡眠时间段,不能开启实时定位");
				isWhether=false;
			}else if(Number(cardParam.sleepStart.substr(0,2))==h){
				if(Number(cardParam.sleepStart.substr(2,2))>=m){
					tipError("正处于睡眠时间段,不能开启实时定位");
					isWhether=false;
				}
			}else if(h==Number(cardParam.sleepEnd.substr(0,2))){
				if(m>=Number(cardParam.sleepEnd.substr(2,2))){
					tipError("正处于睡眠时间段,不能开启实时定位");
					isWhether=false;
				}
			}
		}
	}
	
	return isWhether;
}


// 获取安全区域或危险的列表数据
const getSecurityDate = async (data,type)=>{
	if(whetherImei(data)) return;
	
	const url = type?CARD_FENCE_LIST:CARD_STATION;
	const cardDate = await $http.post(url,{imei:data});
	if(cardDate.code == 200){
		if(cardDate.status == 1 && Array.isArray(cardDate.data)){
			return cardDate.data
		}else{
			tipError("数据为空");
			return []
		}
	}else{
		tipError(cardDate.msg);
		return []
	}
}

// 每项安全区域或危险的切换开关 
const setStationSwicth = async (status,data,type)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.imei)) return;
	
	const url = type?CARD_FENCE_SWITCH:CARD_STATION_SWICTH;
	const cardDate = await $http.post(url,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			tipError("操作成功");
			return 'ok';
		}else{
			tipError("操作失败");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 删除安全区域或者危险区域
const deleteStation = async (status,data,type)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.imei)) return;
	
	const tip = type?'危险':'安全';
	const modalDate = await uni.showModal({
		title:"删除行为",
		content:`您确定要删除次${tip}区域吗`,
		confirmText: "删除"
	});
	// 确认删除
	if(modalDate[1].confirm){
		const url = type?CARD_FENCE_DELETE:CARD_STATION_DELETE;
		const cardDate = await $http.post(url,data);
		if(cardDate.code == 200){
			if(cardDate.status == 1){
				tipError("删除成功");
				return 'ok';
			}else{
				tipError("删除失败");
			}
		}else{
			tipError(cardDate.msg);
		}
	}
}

// 地图上标记出圆形和多边形的区域
const cardAreaPart = (data)=>{
	const circlesList = [];
	const polygonsList = [];
	data.forEach((item,index)=>{
		if(item.type == 1 && item.radius){
			circlesList.push({
				radius:item.radius,
				center:[item.centerLongitude,item.centerLatitude],
				fenceName:item.fenceName ? item.fenceName : item.stationName,
				switchFlag:item.switchFlag
			})
		}else{
			const list=[];
			item.locationList.split(",").forEach((item,index)=>{
				list.push(item.split("-").reverse());
			});
			polygonsList.push({
				id:index,
				path:list,
				fenceName:item.fenceName ? item.fenceName : item.stationName,
				switchFlag: item.switchFlag
			})
		}
	});
	return {circlesList,polygonsList}
}

// 获取学生轨迹的经纬度
const getQueryLocal = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_QUERY_LOCUS,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1 && Array.isArray(cardDate.data)){
			return cardDate.data;
		}else{
			tipError("暂无数据");
			return [];
		}
	}else{
		tipError(cardDate.msg);
		return [];
	}
}

// 获取足迹列表数据
const getQueryFoot = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_QUERY_FOOTPRINT,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1 && Array.isArray(cardDate.data)){
			return cardDate.data;
		}else{
			tipError("暂无数据");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 搜索地址获取经纬度
const getAdressLocati = async (val)=>{
	const reslut = await uni.request({
		url:"https://restapi.amap.com/v3/assistant/inputtips?parameters",
		method:"GET",
		data:{
			key:"a226cd27b5d87a14dec79b38ad88b4b1",
			keywords: val,
			datatype:"all"
		}
	});
	if(reslut[1].data.status == 1){
		return reslut[1].data.tips.filter(item => !Array.isArray(item.location))
	}else{
		tipError(reslut[1].data.info);
		return [];
	}
}

// 设置圆形区域  true安全区域 false危险区域
const setMapDateArea = async (status,data,type)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.imei)) return;

	const url = type ? CARD_STATION_SET:CARD_FENCE_SET;
	const cardDate = await $http.post(url,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			return 'ok';
		}else{
			tipError(cardDate.msg);
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 白名单和情亲号码保存数据
const setFanceHandle = async (status,data)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.requestBody[0].imei)) return;
	
	const cardDate = await $http.post(CARD_FENCE_HANDLER,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			return cardDate.data;
		}else{
			tipError("保存失败,重新保存");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 获取电量信息正时信息
const getBatteryInfo = async (data)=>{
	if(whetherImei(data)) return;
	
	const cardDate = await $http.post(CARD_ELECTR_LIST,{imei:data});
	if(cardDate.code == 200){
		if(cardDate.status == 1 && Array.isArray(cardDate.data)){
			return cardDate.data;
		}else{
			tipError("暂无数据");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 获取短信信息列表
const getSmsDate = async (data)=>{
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_SMS_LIST,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1 && Array.isArray(cardDate.data)){
			return cardDate.data;
		}else{
			tipError("暂无数据");
			return [];
		}
	}else{
		tipError(cardDate.msg);
		return [];
	}
}

// 删除短信信息
const deleteSmsDate = async (status,data)=>{
	if(offTimeStatus(status)) return;
	if(whetherImei(data.imei)) return;
	
	const cardDate = await $http.post(CARD_SMS_DELETE,data);
	if(cardDate.code == 200){
		if(cardDate.status == 1){
			return 'ok';
		}else{
			tipError("删除失败");
		}
	}else{
		tipError(cardDate.msg);
	}
}

// 已读短信信息
const readSmsDate = async (data)=>{
	await $http.post(CARD_SMS_READ,{id:data},{load:false});
}

// 离线状态不能进行操作
const offTimeStatus = (data)=>{
	if(data == -1){
		tipError("离线状态,不能进行操作")
		return true;
	}else{
		return false;
	}
}

// 统一封装是否存在imei
const whetherImei = (imei)=>{
	if(imei){
		return false;
	}
	tipError("学生证IMEI未获取");
	return true;
}

// 此文件统一提示方法
const tipError = (tip)=>{
	uni.showToast({
		duration:2000,
		title:tip,
		icon:"none",
		mask:true,
	})
}



export{
	getOperatorId,
	whetherBindCard,
	getCardParam,
	baseCardParam,
	setCardSpeaker,
	setMovementSwicth,
	setSosSwicth,
	offTimeStatus,
	setStandby,
	getDisturbList,
	setDisturbSwicth,
	addAnEdiDisturb,
	getWhiltList,
	setMonitorPhone,
	isWhetherRepeat,
	getSportList,
	getTimeLocation,
	setModeDate,
	judgeMode,
	getSecurityDate,
	setStationSwicth,
	deleteStation,
	cardAreaPart,
	getCurrentDate,
	getQueryLocal,
	getAdressLocati,
	setMapDateArea,
	setFanceHandle,
	getQueryFoot,
	getBatteryInfo,
	readSmsDate,
	deleteSmsDate,
	getSmsDate
}