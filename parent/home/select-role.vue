<template>
	<view>
		<view class="select">
			<!-- 头部 -->
			<view class="select-top">
				<view class="top-identity">请选择你的身份</view>
				<view class="top-show">我们会对每种设定的身份来给功能权限</view>
			</view>
			<!-- 中间 -->
			<view class="select-content">
				<block v-for="(item,index) in identityList" :key="index">
					<view :style="selectIndex==item.code?'border: 4rpx solid #0095fa;':''" @click="slectContent(item.code)" class="content-item">
						<view class="item-identity">
							<view class="identity-name">{{item.codedesc}}</view>
							<view class="identity-content">{{item.remark}}</view>
						</view>
						<view class="item-option">
							<text v-if="selectIndex==item.code" class="iconfont icon-xuanzhong" style="font-size: 50rpx;color: #0095fa;"></text>
							<text v-else class="iconfont icon-weixuanzhong" style="font-size: 56rpx;color: #e5e6e8;"></text>
						</view>
					</view>
				</block>
			</view>
			<!-- 下一步 -->
			<view class="select-bottom" @click="nextstep">下一步</view>
			
			<!-- 提示 -->
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import {getFieldList,getOpenIDList,setStateRecords,getChilderList} from "@/common/httpApi/boundHttpApi.js"
	export default{
		data(){
			return{
				identityList:[],
				selectIndex:null,
				wxOpenId:null,
			}
		},
		onLoad() {
			this.getInitDate();
		},
		methods:{
			getInitDate(){
				try{
					const wxOpenId = uni.getStorageSync("openId");
					if(wxOpenId){
						this.wxOpenId = wxOpenId;
					}else{
						this.getInitDate();
					}
					this.getIdentityDate();
				}catch(e){
					//TODO handle the exception
					console.log("获取数据失败")
				}
			},
			// 获取身份的数据
			async getIdentityDate(){
				const identityDate = await getFieldList('wxUserType');
				if(identityDate.length){
					this.identityList = identityDate;
					this.selectIndex = identityDate[0].code;
				}
			},
			// 选这一项
			slectContent(type){
				this.selectIndex = type;
			},
			// 下一步
			async nextstep(){
				try{
					const selectIndex = this.selectIndex;
					if(!this.wxOpenId){
						this.$Q.tipUrl({
							tip:"获取到OPENID失败,重新进入"
						});
						return;
					}
					
					// 根据openId获取所有的用户
					const userList = await getOpenIDList(this.wxOpenId);
					
					// 选择学生
					if(selectIndex == 0){
						const userStudent = userList.filter(item => item.userType == 0);
						if(userStudent.length > 0){
							const studentInfo = userStudent[0];
							if(studentInfo.student){
								// 先进行缓存
								uni.setStorageSync('roleType',String(studentInfo.userType));
								uni.setStorageSync('userId',studentInfo.student.userId);
								uni.setStorageSync('student',studentInfo.student);
								
								this.navToIndex("已经绑定学生账号",studentInfo.id);
							}else{
								this.$Q.tipUrl({
									tip: "数据异常,重新绑定",
									url: "/parent/home/parent-bind?type="+selectIndex
								})
							}
							return;
						}
						// 如果没有获取数据
						uni.navigateTo({
							url:"/parent/home/parent-bind?type="+selectIndex
						})
					}
					// 选择家长
					else if(selectIndex == 1){
						const userParent = userList.filter(item => item.userType == 1 && item.studentParent);
						
						if(userParent.length > 0){
							const parentInfo = userParent[0];
							if(parentInfo.userId){
								uni.setStorageSync('roleType',parentInfo.userType);
								uni.setStorageSync('parentId',parentInfo.userId);
								const childreList = await getChilderList(parentInfo.userId);
								if(childreList.length > 0){
									const filterChildren = childreList.filter(item => item.loginFlag);
									let loginInfo;
									if(filterChildren.length > 0){
										loginInfo = filterChildren[0];
									}else{
										loginInfo = childreList[0];
									}
									uni.setStorageSync("userId",loginInfo.userId);
									uni.setStorageSync("student",loginInfo.student);
									
									this.navToIndex("已经绑定家长账号",parentInfo.id);
									
								}else{
									this.$Q.tipUrl({
										tip: "没有获取到绑定的孩子",
										url: "/parent/home/add-baby"
									})
								}
								
							}else{
								this.$Q.tipUrl({
									tip: "数据异常,重新绑定",
									url: "/parent/home/parent-bind?type="+selectIndex
								})
							}
							return;
						}
						
						// 如果没有获取数据
						uni.navigateTo({
							url:"/parent/home/parent-bind?type="+selectIndex
						});
					}
					// 老师选择
					else if(selectIndex==2){
						this.$Q.tipUrl({tip:"此版本还没有做老师版本"});
						return
						
						const userTearch = userList.filter(item => item.userType == 2 && tearchInfo.teacher);
						if(userTearch.length){
							const tearchInfo = userTearch[0];
							if(tearchInfo.teacher.userId){
								uni.setStorageSync('roleType',tearchInfo.userType);
								uni.setStorageSync('userId',tearchInfo.teacher.userId);
								
								this.navToIndex("已经绑定教师账号",tearchInfo.id);
							}else{
								this.$Q.tipUrl({
									tip:"获取的数据异常,重新绑定",
									url:"/tearch/home/tearch-bind?type="+selectIndex
								})
							}
							
							return;
						}
						// 如果没有获取数据
						uni.navigateTo({
							url:"/tearch/home/tearch-bind?type="+selectIndex
						});
						
					}
				}catch(e){
					//TODO handle the exception
					console.log("切换角色遇到异常"+e)
				}
			},
			navToIndex(tip,id){
				// 记录一下状态
				setStateRecords(id);
				
				this.$Q.tipUrl({
					tip:tip,
					url:"/pages/index/index",
					isTab:true
				})
			}
		}
	}
</script>

<style lang="scss">
	.select{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: 'Noto Sans S Chinese Regular';
		.select-top{
			background-color: #f6f6f6;
			height: 19vh;
			width: 100vw;
			padding: 40rpx;
			.top-identity{
				font-size: 36rpx;
				color: #000000;
				line-height: 72rpx;
			}
			.top-show{
				font-size: 30rpx;
				color:#828080;
				line-height: 64rpx;
			}
		}
		.select-content{
			background-color: #FFFFFF;
			padding:53rpx 40rpx;
			width: 100vw;
			height: 71vh;
			.content-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 670rpx;
				height: 145rpx;
				background-color: #F8F8F8;
				border-radius: 20rpx;
				padding: 0 50rpx;
				margin-bottom: 25rpx;
				.item-identity{
					display: flex;
					flex-direction: column;
					.identity-name{
						color: #000000;
						font-size: 30rpx;
						line-height: 60rpx;
					}
					.identity-content{
						font-size: 24rpx;
						color: #484747;
						line-height: 32rpx;
					}
				}
			}
		}
		.select-bottom{
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #0095fa;
			width: 100vw;
			height: 10vh;
			font-size: 38rpx;
			color: #FFFFFF;
			font-weight: 600;
			line-height: 10vh;
			text-align: center;
		}
	}
</style>