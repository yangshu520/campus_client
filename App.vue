<script>
	export default {
		onLaunch: function() {
			// #ifdef H5
				// 如果存在START_TIME  86400000 24小时
				const startTime=uni.getStorageSync("START_TIME");
				// 设置结束的时间
				const endTime=new Date().getTime();
				if(!startTime){
					const startTime=new Date().getTime();
					uni.setStorageSync("START_TIME",startTime);
				}else if(Number(endTime)-Number(startTime)>=86400000){
					uni.clearStorageSync();
					uni.setStorageSync("START_TIME",endTime);
				}
			// #endif
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/css/common.css';
	/* uview ui */
	@import "uview-ui/index.scss";
	/* 字体样式 */
	@import './common/css/iconfont.css';
</style>
