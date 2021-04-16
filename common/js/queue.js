// 封装一些常用的队列

module.exports={
	tipUrl({tip,url,delta,mask=true,time = 2000,isTab = false,icon = "none"}){
		if(tip){
			uni.showToast({
				title:tip,
				icon:"none",
				mask:mask,
				duration:time
			})
		}
		
		if(url){
			setTimeout(()=>{
				if(isTab){
					uni.switchTab({
						url:url
					})
				}else{
					uni.navigateTo({
						url:url
					})
				}
			},time)
		}
		
		if(delta){
			setTimeout(()=>{
				uni.navigateBack({
					delta: delta
				})
			},time)
		}
	},
	// this.$Q.tipUrl({tip:"获取数据异常",url:"/pages/index/login"});
}


