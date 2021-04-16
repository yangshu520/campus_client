// 此文件做绑定功能的请求封装 以及 有关绑定的封装
import $http from '../request/requestConfig.js'
import {
	COM_FIELD_LIST,
	COM_AREA_SCHOOL_CLASSES_LIST,
	ADD_PARENT_BIND_STUDENT,
	GET_PARENT_STUDENT_LIST,
	SET_PARENT_STUDENT_LOGIN_INFO,
	REMOVE_PARENT_BIND_STUDENT,
	GET_ADDRESS_BOOK_BY_PARENT,
	SET_LOGIN_INFO,
	GET_USER_INFO_LIST,
	BOUND_VERIFY_CODE,
	BOUND_SAVE_BIND
} from "../js/apiUrl.js"

// 获取公共field的列表
const getFieldList = async (fieldType,load = false)=>{
	const fieldDate =await $http.post(COM_FIELD_LIST,{
		field:fieldType
	},{load:load});
	
	if(fieldDate.code == 0 && fieldDate.data.length){
		return fieldDate.data;
	}else{
		return [];
	}
}

// 获取学校的列表
const getClassesList = async ()=>{
	const classesDate = await $http.post(COM_AREA_SCHOOL_CLASSES_LIST);
	if(classesDate.code == 0 && classesDate.data.length){
		return classesDate.data;
	}else{
		tipError("获取学校班级列表数据为空,联系客服");
		return [];
	}
}

// 添加学生信息
const addBindStudent=async (data)=>{
	const addBindDate = await $http.post(ADD_PARENT_BIND_STUDENT,data);
	if(addBindDate.code == 200 && addBindDate.status == 1){
		if(addBindDate.data && addBindDate.data.student){
			return addBindDate.data;
		}else{
			tipError("数据返回有误,联系客服");
		}
	}else{
		tipError(addBindDate.msg);
	}
}

// 获取家长绑定的孩子列表
const getChilderList = async (data)=>{
	const childrenDate = await $http.post(GET_PARENT_STUDENT_LIST,{parentId:data});
	if(childrenDate.code == 0){
		if(childrenDate.data){
			return childrenDate.data;
		}else{
			return []
		}
	}else{
		tipError(childrenDate.msg);
	}
}

// 切换学生
const setSwicthStudent = async (data)=>{
	const studentDate = await $http.post(SET_PARENT_STUDENT_LOGIN_INFO,data);
	if(studentDate.code == 200 && studentDate.status == 1){
		return "ok";
	}else{
		tipError(childrenDate.msg);
	}
}

// 删除学生
const setDeleteStudent =async (e,date)=>{
	if(e.index == 0){
		const modalDate = await uni.showModal({
			title:"删除绑定学生",
			content:"确定删除"+date.student.studentName+"?"
		})
		if(modalDate[1].confirm){
			const deleteDate = await $http.post(REMOVE_PARENT_BIND_STUDENT,{
				parentId:date.studentParentId,
				studentId:date.studentId
			});
			if(deleteDate.code == 200 && deleteDate.status ==1){
				tipError("删除成功")
				return "ok";
			}else{
				tipError(deleteDate.msg);
			}
		}
	}
}

// 获取家长端通讯录
const getPhoneDate = async (studentId,searchName = "")=>{
	const phoneDate = await $http.post(GET_ADDRESS_BOOK_BY_PARENT,{
		studentId:studentId,
		param:searchName
	});
	if(phoneDate){
		return phoneDate;
	}
	return {}
}

// 将状态记录一下 传入的值是id
const  setStateRecords = (date)=>{
	$http.post(SET_LOGIN_INFO,{id:date},{load:false})
}

// 通过 wxOpenID 获取用户列表
const getOpenIDList = async (openID)=>{
	const backDate = await $http.post(GET_USER_INFO_LIST,{openId:openID});
	if(backDate.code == 200 && backDate.status == 1){
		if(Array.isArray(backDate.data)){
			return backDate.data;
		}else{
			return []
		}
	}else{
		tipError(backDate.msg);
		return []
	}
}

// 获取绑定时候的验证码
const getVertryCode = async (data)=>{
	const homeDate = await $http.post(BOUND_VERIFY_CODE,data);
	if(homeDate.code == 200){
		if(homeDate.status == 1){
			return homeDate.data
		}else{
			tipError("获取验证码失败,请重试");
		}
	}else{
		tipError(homeDate.msg);
	}
}

// 绑定接口
const boundSaveInfo = async (data)=>{
	if(!data.openId){
		tipError('数据openId不存在,联系客服');
		return;
	}
	
	const homeDate = await $http.post(BOUND_SAVE_BIND,data);
	if(homeDate.code == 200){
		if(homeDate.status == 1){
			return homeDate.data;
		}else{
			tipError('绑定失败,重新绑定');
		}
	}else{
		tipError(homeDate.msg);
	}
}


// 此文件统一提示方法
const tipError = (tip)=>{
	uni.showToast({
		duration:3000,
		title:tip,
		icon:"none",
		mask:true
	})
}


export{
	getFieldList,
	getClassesList,
	addBindStudent,
	getChilderList,
	setSwicthStudent,
	setDeleteStudent,
	getPhoneDate,
	setStateRecords,
	getOpenIDList,
	getVertryCode,
	boundSaveInfo
}