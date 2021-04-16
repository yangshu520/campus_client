// 云安全接口的封装 此文件
import $http from '../request/requestConfig.js'
import {
	GET_ASSGIGN_RECORD_LIST,
	NEWS_ADMIN_TYPE_LIST,
	NEWS_ADMIN_DATE_LIST,
	MATION_TYPE_LIST, 
	MATION_DATA_LIST,
	MATION_CAROUSE_LIST,
	ATTEND_STUDENT_MONTH,
	ATTEND_STUDENT_DAY,
	ATTEND_STUDENT_DATEIL
} from "../js/apiUrl.js"

const getAssginList = async (data,load)=>{
	if(!data.classesId){
		tipError("获取到班级数据为空,联系客服");
		return
	}
	
	const homeDate = await $http.post(GET_ASSGIGN_RECORD_LIST,data,{load:load});
	if(homeDate.code == 200){
		if(homeDate.status == 1){
			return homeDate.data;
		}else{
			tipError("暂无相关数据")
		}
	}else{
		tipError(homeDate.msg)
	}
}

// 获取消息通知的tab栏
const getNewsBar = async ()=>{
	const homeDate = await $http.post(NEWS_ADMIN_TYPE_LIST);
	if(homeDate.code == 200){
		if(homeDate.status == 1 && Array.isArray(homeDate.data)){
			return homeDate.data
		}else{
			tipError("数据为空");
			return []
		}
	}else{
		tipError(homeDate.msg);
	}
}

// 获取家长的消息列表
const getNewsDate = async (data,load = true)=>{
	if(!data.studentId){
		tipError("没有studentId数据,联系客服");
		return
	}
	
	const homeDate = await $http.post(NEWS_ADMIN_DATE_LIST,data,{load:load});
	if(homeDate.code == 200){
		if(homeDate.status == 1 && Array.isArray(homeDate.data)){
			return homeDate.data
		}else{
			tipError("数据为空");
			return []
		}
	}else{
		tipError(homeDate.msg);
	}
}

// 获取校园新闻tab栏
const getMationType = async ()=>{
	const homeDate = await $http.post(MATION_TYPE_LIST);
	if(homeDate.code == 200){
		if(homeDate.status == 1 && Array.isArray(homeDate.data)){
			return homeDate.data
		}else{
			return []
		}
	}else{
		tipError(homeDate.msg);
	}
}

// 获取轮播图列表
const getSwiperList = async ()=>{
	const homeDate = await $http.post(MATION_CAROUSE_LIST);
	if(homeDate.code == 200){
		if(homeDate.status == 1 && Array.isArray(homeDate.data)){
			return homeDate.data
		}else{
			return []
		}
	}else{
		tipError(homeDate.msg);
	}
}

// 根据typeId获取信息列表
const getMationList = async (data)=>{
	const homeDate = await $http.post(MATION_DATA_LIST,data);
	if(homeDate.code == 200){
		if(homeDate.status == 1 && Array.isArray(homeDate.data)){
			return homeDate.data
		}else{
			tipError("获取tab数据为空");
			return []
		}
	}else{
		tipError(homeDate.msg);
	}
}

// 根据月份获取考勤统计
const getMonthAttend = async (data)=>{
	if(!data.studentId){
		tipError("数据studentId不存在");
		return;
	}
	
	const homeDate = await $http.post(ATTEND_STUDENT_MONTH,data);
	if(homeDate.code == 200 && homeDate.status == 1){
		return homeDate.data;
	}else{
		tipError(homeDate.msg);
	}
}

// 根据时间获取考勤详情
const getDayAttend = async (data)=>{
	if(!data.studentId){
		tipError("数据studentId不存在");
		return;
	}
	
	const homeDate = await $http.post(ATTEND_STUDENT_DAY,data);
	if(homeDate.code == 200 && homeDate.status == 1){
		return homeDate.data;
	}else{
		tipError(homeDate.msg);
	}
}

// 根据月份获取考勤详情
const getDateilAttend = async (data)=>{
	if(!data.studentId){
		tipError("数据studentId不存在");
		return;
	}
	
	const homeDate = await $http.post(ATTEND_STUDENT_DATEIL,data);
	if(homeDate.code == 200 && homeDate.status == 1){
		return homeDate.data;
	}else{
		tipError(homeDate.msg);
	}
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

export {
	getAssginList,
	getNewsBar,
	getNewsDate,
	getMationList,
	getMationType,
	getSwiperList,
	getMonthAttend,
	getDayAttend,
	getDateilAttend
}