import request from "./index";
import { BASE_URL } from '../js/apiUrl.js'


//可以new多个request来支持多个域名请求
let $http = new request({
	//接口请求地址
	baseUrl: BASE_URL,
	
	//服务器本地上传文件地址
	fileUrl: BASE_URL,
	
	//设置请求头（如果使用报错跨域问题，可能是content-type请求类型和后台那边设置的不一致）
	header: {
		'content-type': 'application/json;charset=UTF-8'
	},
	
	//是否提示--默认提示
	isPrompt: true,
	//是否显示请求动画
	load: true,
	//是否使用处理数据模板
	isFactory: true
});


//当前接口请求数
let requestNum = 0;
//请求开始拦截器
$http.requestStart = function(options) {
	if (options.load) {
		if (requestNum <= 0) {
			//打开加载动画
			uni.showLoading({
				title: options.loadTitip,
				mask:true
			});
		}
		requestNum += 1;
	}
	
	//请求前加入token
	// options.header['token'] = "1234568";
	return options;
}

//请求结束
$http.requestEnd = function(options, resolve) {
	//判断当前接口是否需要加载动画
	if (options.load) {
		requestNum = requestNum - 1;
		if (requestNum <= 0) {
			uni.hideLoading();
		}
	}
	
	if (resolve.errMsg && resolve.statusCode && resolve.statusCode > 300) {
		setTimeout(() => {
			uni.showToast({
				title: "请求失败,请重新发送请求",
				icon: "none"
			});
		}, 500);
	}
}

//登录弹窗次数
let loginPopupNum = 0;

//所有接口数据处理（可在接口里设置不调用此方法）
//此方法需要开发者根据各自的接口返回类型修改，以下只是模板
$http.dataFactory = function(res) {
	// 判断接口请求是否成功
	if (res.response.statusCode == 200) {
		let httpData = res.response.data;

		// 返回正确的结果(then接受数据)
		res.resolve(httpData);
		
	} else {
		// 返回错误的结果(catch接受数据)
		res.reject(res);
	}
};
export default $http;
