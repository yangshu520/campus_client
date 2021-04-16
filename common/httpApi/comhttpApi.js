// 此文件封装的公共的方法
import $http from '../request/requestConfig.js'
import $wx from '../js/weixin.js'
import {
	BASE_URL,
	SIGN_INFO,
	COM_UPLOAD_FILD
} from "../js/apiUrl.js"

// 调用微信的jssdk
const getWxJsSdk = async ()=>{
	const res = await $http.post(
		SIGN_INFO,
		{
			url:window.location.href.split('#')[0]
		},
		{
			header:{
				'content-type':'application/x-www-form-urlencoded'
			},
			load:false
		}
	);
	$wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: res.appid, // 必填，公众号的唯一标识
		timestamp: res.timestamp, // 必填，生成签名的时间戳
		nonceStr: res.nonceStr, // 必填，生成签名的随机串
		signature: res.signature, // 必填，签名
		jsApiList: ['getLocation',"openLocation","updateTimelineShareData","startRecord"] // 必填，需要使用的JS接口列表
	});
	$wx.ready(function(){
	  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		console.log("注入jssdk成功")
	});
	$wx.error((res)=>{
		// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		console.log("注入jssdk失败"+res);
		getWxJsSdk();
	});
}

// 统一封装左滑操作的方法 和 弹窗删除确认
const deleteOperation = async ({e,tipTitle,tipContent,deleteApi,data,redirectUrl,type,confirmText})=>{
	try{
		// 滑动选择删除操作
		if(e && e.content.text=="删除"){
			return setModel(tipTitle,tipContent,deleteApi,data,confirmText);
		}else if(e && e.content.text=="修改"){
			uni.navigateTo({
				url: redirectUrl,
			})
		}else{
			return setModel(tipTitle,tipContent,deleteApi,data,type,confirmText);
		}
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
}

const setModel = async (tipTitle,tipContent,deleteApi,data,type,confirmText)=> {
	const modalDate = await uni.showModal({
		title:tipTitle ? tipTitle : "删除行为",
		content:tipContent ? tipContent : "你确定要删除该项吗?",
		confirmText:confirmText
	})
	if(modalDate[1].confirm){
		const deleteDate = await $http.post(deleteApi,data);
		if(deleteDate.code == 200 && deleteDate.status ==1){
			if(!type){
				tipError("删除成功");
			}else{
				tipError("设置成功");
			}
			return "ok";
		}else{
			tipError(deleteDate.msg);
		}
	}
}

// 统一封装一个打电话的方法
const commonTelPhone = (tel) =>{
	if(!tel){
		uni.showToast({
			title:"没有获取到号码",
			icon:"none",
			duration:3000
		});
		return
	}
	uni.makePhoneCall({
		phoneNumber:tel
	})
}

// 封装上传图片的方法
const comUploadImg = async ()=>{
	// 必须使用promise 否则外面接受不到
	const chooseImg = await uni.chooseImage({
	    count: 1,
	    sourceType: ['album','camera'], //从相册选择
	});
	if(chooseImg[1].tempFilePaths){
		uni.showLoading({
			title: '上传中...',
			mask:true
		});
		const temp = chooseImg[1].tempFilePaths[0];
		const data = await uni.uploadFile({
			url: BASE_URL+COM_UPLOAD_FILD,
			filePath: temp,
			name: 'file',
			formData:{
				userId: uni.getStorageSync("userId")
			}
		});
		if(data[1]){
			uni.hideLoading();
			const imgDate = data[1]["data"] && JSON.parse(data[1]["data"]).data;
			return imgDate
		}{
			uni.hideLoading();
			tipError("上传图片失败,重新上传");
		}
	}else{
		tipError("选择图片失败,请重新选择");
	}
}

// 封装一个全拷贝的方法
const depthClone = (target)=>{
	let result;
	if(typeof target === "object"){
		result={}
	}else if(Array.isArray(target)){
		result=[]
	}else{
		return result;
	}
	for(let i in target){
		let val = target[i]
		if( typeof val ==="object" || Array.isArray(target)){
			result[i] = clone(val)
		}else{
			result[i] = val
		}
	}
	return result;
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

export {
	getWxJsSdk,
	deleteOperation,
	commonTelPhone,
	comUploadImg,
	depthClone
}