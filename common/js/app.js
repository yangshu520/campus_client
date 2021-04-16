// 此文件只做进入程序存数据判断是否绑定的事情

import $http from '../request/requestConfig.js'
import {
	APP_ID,
	GET_USER_INFO,
	GET_STUDEN_INFO,
	COM_FIELD_LIST,
	GET_PARENT_STUDENT_LIST
} from "./apiUrl.js"


const setStorage = (key ,value)=>{
	try{
		uni.setStorageSync(key , value);
	}catch(e){
		//TODO handle the exception
		console.log(key+'存值失败')
	}
}

const commonLogin = async ( userInfo,openId )=>{
	if(userInfo.data && (openId || userInfo.data.snsUserInfo)){
		// 如果获取的snsUserInfo 有值
		if(userInfo.data.snsUserInfo){
			setStorage("openId", userInfo.data.snsUserInfo.openId ||openId);
			setStorage("wxUserInfo", userInfo.data.snsUserInfo);
		}
		// 获取微信用户
		try{
			//code 为1代表未绑定用户
			if(userInfo.data.code == 1){ 
				setStorage("roleType",-1);
				return -1;
			}
			else if(userInfo.data.code == 0){
				// 为学生的时候  0
				if(userInfo.data.data && userInfo.data.data.userType == 0 && userInfo.data.data.user){
					// 如果是学生 存的userId为学生的id
					setStorage("userId",userInfo.data.data.user.id || null);
					// 存一下角色类型
					setStorage("roleType",String(userInfo.data.data.userType));
					
					// 获取学生的基本信息并且存到缓存里面
					$http.post(GET_STUDEN_INFO,{userId: userInfo.data.data.user.id}).then(res=>{
						if(res.code==0 && res.data){
							setStorage("student",res.data.student)
						}else{
							setStorage("student",null)
						}
					});
					
					return userInfo.data.data.userType;
				}
				// 为家长的时候
				else if(userInfo.data.data && userInfo.data.data.userType == 1 && userInfo.data.data.userId){
					setStorage("roleType",userInfo.data.data.userType);
					setStorage("parentId",userInfo.data.data.userId);
					
					// 获取家长的基本信息
					$http.post(GET_PARENT_STUDENT_LIST,{parentId: userInfo.data.data.userId }).then(res=>{
						if(res.code == 0 && res.data){
							const filFlag = res.data.filter(item => item && item.loginFlag);
							let resultDate;
							if(filFlag.length){
								resultDate = filFlag[0];
							}else{
								resultDate = res.data[0];
							}
							setStorage("userId", resultDate.student && resultDate.student.userId);
							setStorage("student", resultDate.student);
						}
						else{
							uni.removeStorageSync("student");
							uni.removeStorageSync("userId");
							setStorage("roleType",-1);
							
							return -1;
						}
					});
					
					return userInfo.data.data.userType;
				}
				// 为老师的时候
				else if(userInfo.data.data && userInfo.data.data.userType == 2 && userInfo.data.data.user){
					// 如果角色未老师的话，存的userId是老的对象的id
					setStorage("userId",userInfo.data.data.user.id);
					setStorage("roleType",userInfo.data.data.userType);
					
					// 获取老师的数据
					$http.post(GET_TEACHER_INFO,{userId: userInfo.data.data.user.id}).then(res=>{
						if(res.code==0){
							// 需要教师数据  存到缓存里面即可 暂时没有用到  所以不错缓存
						}
					});
					
					return userInfo.data.data.userType;
				}
				// 都不是的话 或者获取信息异常
				else{
					setStorage("roleType",-1);
					return -1;
				}
			}
			// 获取异常
			else{
				setStorage("roleType",-1);
				return -1;
			}
		}catch(e){
			//TODO handle the exception
			console.log('commonLogin'+e);
			setStorage("roleType",-1);
			return -1;
		}
	}
	else{
		wxAuthorize();
		console.log("获取openid异常")
	}
};

// 地址解析
const getUrlParam =(name)=>{
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let url = window.location.href.split('#')[0]
  let search = url.split('?')[1]
  if (search) {
	var r = search.substr(0).match(reg)
	if (r !== null) return unescape(r[2])
	return null
  } else {
	return null
  }
};

// 没有绑定授权
const wxAuthorize = async() =>{  
	let link = window.location.href;
	let params = getUrlParam('code');  // 地址解析  
	// 如果拿到code，调用授权接口，
	if (params) { 
		try{
			const userInfo = await $http.post(GET_USER_INFO,{code: params});
			let roleType;
			if(userInfo && userInfo.code == 200 && userInfo.status == 1){
				roleType = commonLogin(userInfo);
			}else{
				setStorage("roleType",-1);
				roleType = -1;
			}
			
			// 干掉#后面的参数包括state啥的
			var _url = window.location.protocol + '//' + window.location.host + '/#/'
			window.history.pushState({},0, _url);
			
			return roleType;
		}catch(e){
			setStorage("roleType",-1);
			console.log(e);
			return -1;
		}
	}else{
		// 没有拿到就跳转微信授权链接获取
		let uri = encodeURIComponent(link);  
		let authURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APP_ID}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;  
		window.location.href = authURL;
	}
};

const wxAuOpenId = async (openId)=>{
	try{
		const userInfo = await $http.post(GET_USER_INFO,{openId: openId });
		if(userInfo.code == 200 && userInfo.status==1){
			return commonLogin(userInfo,openId);
		}else{
			setStorage("roleType",-1);
			return -1;
		}
	}catch(e){
		//TODO handle the exception
		console.log('wxAuOpenId'+e);
		setStorage("roleType",-1);
		return -1;
	}
};

export {
	wxAuOpenId,
	wxAuthorize
}