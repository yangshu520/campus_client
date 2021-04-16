<template>
	<view>
		<view class="img">
			<image src="/static/img/home/about-mine-logo.png" mode="widthFix" />
		</view>
		<view class="company">东龙校园</view>
		<view class="content" style="margin: 0;">
			东龙智慧平安校园是我司积极响应教育部印发《教育信息化2.0行动计划》中提到“三通”提效增质、两平台融合发展的校园智能一体化解决方案。目标是教学应用覆盖全体师生，实现数字化校园建设，提供信息化应用与教育深度融合、构建互联网+教育的平台。			
		</view>
		<view class="content">
			贵州东龙黔升科技开发有限公司是一家致力于智能识别产品的研发、制造、集成、服务等综合性的高新技术公司。是国内领先的信息智能化产品研发制造与解决方案商。东龙校园为教育行业提供专业的智慧校园技术服务,以良好的服务品质、专业的技术能力，为教学生态下不同群体的客户群体做出更适合的解决方案。
		</view>
		<view class="content">
			<view style="color: #000000;">服务范围包括:</view>
			<view>一、云安全 (电子学生证/考勤管理子系统/访客管理子系统/宿舍管理子系统/门禁管理子系统/停车管理子系统)</view>
			<view>二、云教学(作业管理子系统/教学辅助子系统/题库管理子系统/互动课堂子系统/课外资源子系统/电子班牌子系统/)</view>
			<view>三、云消费（云消费系统、云消费设备、云消费应用</view>
		</view>
		<view class="content" style="margin-bottom: 30rpx;">
			<view style="color: #000000;">公司理念：</view>
			<view>“行则必至，做则必成"，我们公司秉承客户至上、服务至上的经营理念。希望在前进的道路上与您携手共赢！</view>
		</view>
		<view class="phone" @click="click">
			<view>客服电话</view><view style="color: #407cf3;">{{phone}}</view>
		</view>
		<view class="phone">
			<view>工作日</view><view style="letter-spacing: 4rpx;">8:30-18:00</view>
		</view>
		<!-- <view class="phone">
			<view>客户邮箱</view><view>donglong@163.com</view>
		</view> -->
		<view class="phone" style="border: 0;"></view>
		<view class="bottom">最终解释权归贵州东龙黔升科技开发有限公司</view>
	</view>
</template>

<script>
	import {getFieldList} from "@/common/httpApi/boundHttpApi.js"
	import {commonTelPhone} from "@/common/httpApi/comhttpApi.js"
	export default {
		data() {
			return {
				phone:""
			};
		},
		onLoad() {
			this.getMakePhone();
		},
		methods:{
			// 获取客户号码 
			async getMakePhone(){
				const backDate = await getFieldList('staffService',false);
				if(backDate){
					this.phone = backDate[0].code
				}
			},
			click(){
				commonTelPhone(this.phone)
			}
		}
	}
</script>

<style lang="scss">
	.title{
		height: 60rpx;
		display: flex;
		align-items: center;
		padding: 0 6rpx;
	}
	.img{
		height: 188rpx;
		width: 100vw;
		margin-top: 20rpx;
		margin-bottom: 25rpx;
		position: relative;
		image{
			position: absolute;
			height: 188rpx;
			width: 180rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
	}
	.company{
		font-weight: bold;
		font-size: 36rpx;
		font-family: 'PingFangSC Regular';
		height: 72rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #4c4c4c;
	}
	.content{
		text-indent: 2em;
		padding-left: 58rpx;
		padding-right: 60rpx;
		color: #666666;
		// font-family: 'HiraginoSansGB W3';
		font-size: 32rpx;
		letter-spacing: 6rpx;
		line-height: 50rpx;
	}
	.phone{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left:58rpx ;
		margin-right: 60rpx;
		font-size: 30rpx;
		color: #4c4c4c;
		height: 94rpx;
		border-bottom: 2rpx solid #dadada;
	}
	.bottom{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		background-color:#f7f7f7 ;
		font-size: 26rpx;
		font-family: '黑体';
		color: #999999;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
	}
</style>