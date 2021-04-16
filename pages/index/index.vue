<template>
	<view class="content">
		<!-- 头部组件 -->
		<common-avter 
		:avterImg = "avterImg"
		:avterName = "avterName" 
		:avterClassesName="avterClassesName"
		:avterSchoolName="avterSchoolName"
		@seeDateil="seeDateil"
		@navToBaby="navToBaby"/>
		
		<!-- 学生功能 -->
		<student-index />
		
	</view>
</template>

<script>
	import commonAvter from "@/components/common-avter.vue"
	import studentIndex from "@/components/student-index.vue"
	import {wxAuOpenId,wxAuthorize} from "@/common/js/app.js"
	import { getWxJsSdk } from "@/common/httpApi/comhttpApi.js"
	export default {
		components:{
			commonAvter,studentIndex
		},
		data() {
			return {
				roleType:undefined,
				// 组件commonAvter的数据
				avterImg:"/static/img/home/avter.png",
				avterName:"Hello unbound",
				avterSchoolName:"暂未绑定家长账号",
				avterClassesName:null,
			}
		},
		onLoad() {
			this.getInitializationDate();
			getWxJsSdk();
		},
		onShow() {
			this.roleType = uni.getStorageSync("roleType");
			this.roleAcquisitionResponse(this.roleType,true);
		},
		methods: {
			// 初始化数据  
			async getInitializationDate(){
				// 获取两个id
				const openId=uni.getStorageSync("openId");
				const userId=uni.getStorageSync("userId");
				// 如果都不存在 就发起微信授权
				if(!openId && !userId){
					this.roleType =await wxAuthorize();
					this.roleAcquisitionResponse(this.roleType);
				}else{
					// 反之根据openid拿去最近登入的状态
					this.roleType =await wxAuOpenId(openId);
					this.roleAcquisitionResponse(this.roleType);
				}
			},
			
			// 根据角色去获取相应的数据或者跳转到绑定页面
			roleAcquisitionResponse(roleType,isOnShow){
				if(roleType == -1){  //&& !isOnShow
					// 没有获取到绑定信息或者是获取的数据失败
					this.checkBoundAccount(roleType);
					this.avterImg = "/static/img/home/avter.png";
					this.avterName = "Hello unbound";
					this.avterSchoolName = "暂未绑定家长账号";
					this.avterClassesName = null;
					return;
				}
				// 首先获取头像信息 为家长的时候
				if(roleType == 1){
					try{
						const stuStore = uni.getStorageSync("student");
						this.avterImg = stuStore["iconLink"] || '';
						this.avterName = stuStore["studentName"] || '';
						this.avterSchoolName = stuStore["classes"]["schoolName"] || '';
						this.avterClassesName = stuStore["classes"]["classesName"] || '';
					}catch(e){
						// 获取不到递归获取
						setTimeout(()=>{
							this.roleAcquisitionResponse(roleType);
						},500);
						//TODO handle the exception
						console.log("获取头像异常"+e);
					}
				}
				// 为教师的时候
				else if(this.roleType == 2){
					
				}
				
			},
			// 点击查看详情
			seeDateil(){
				if(this.checkBoundAccount()) return;
				uni.navigateTo({
					url:"/parent/home/add-baby?dateil=ok"
				})
			},
			navToBaby(val){
				if(this.checkBoundAccount()) return;
				uni.navigateTo({
					url:val.url
				})
			},
			// 检测是否绑定账号
			checkBoundAccount(roleType){
				if(this.roleType == -1 || roleType == -1){
					this.$Q.tipUrl({
						tip:"检测未绑定账号",
						url:"/parent/home/select-role"
					});
					return true;
				}
				return false
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #ebebeb;
	}
	.content{
		
	}
</style>
