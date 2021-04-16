<template>
	<view>
		<view class="transit">
			<!-- 关闭 管理 -->
			<view class="transit-site">
				<view class="site-shutDown" @click="shutDown" v-if="!isClear">关闭</view>
				<view class="site-shutDown" @click="isClear=false" v-if="isClear">取消</view>
				<view class="site-shutDown" @click="isClear=!isClear" v-if="!isClear">管理</view>
			</view>
			<!-- 提示标题 -->
			<view class="transit-tutle">轻触头像切换账号</view>
			<!-- 横线 -->
			<view class="transit-horizontalLine">
				<view class="horizontalLine"></view>
			</view>
			<!-- 切换的每一项 -->
			<view class="transit-item">
				<block v-for="(item,index) in userList" :key="index">
					<view v-if="item.user||item.studentParent" class="item" :class="(isClear&& item.isCurrent)?'select-item':''">
						<view class="display" @click="accountSwitch(item)">
							<view class="item-img" v-if="item.userType!=1 && item.user">{{item.user.nickName.substr(item.user.nickName.length-1,1)}}</view>
							<view class="item-img" v-if="item.userType==1 && item.studentParent">{{item.studentParent.parentName.substr(item.studentParent.parentName.length-1,1)}}</view>
							<view class="item-titles">
								<view class="titles-nema">
									<text v-if="item.userType!=1 && item.user">{{item.user.nickName}}</text>
									<text v-if="item.userType==1 && item.studentParent">{{item.studentParent.parentName}}</text>
									<text class="name-character" v-if="item.userType == 1" style="background-color: #666;">家长</text>
									<text class="name-character" v-if="item.userType == 0">学生</text>
									<text class="name-character" v-if="item.userType == 2" style="background-color: #f8ae56;">教师</text>
								</view>
								<view class="titles-time">
									<text>最近登入: {{item.loginDate | getDate}}</text>
								</view>
							</view>
						</view>
						<icon type="success" size="26" color="#0099ff" v-if="isClear && item.isCurrent && userList.length != 1"></icon>
						<icon type="clear" size="26" color="#f25542" v-if="isClear && (!item.isCurrent || userList.length == 1)" @click="clear(item,index)"></icon>
					</view>
				</block>
				<!-- 切换账号 -->
				<view class="item">
					<view class="display" @click="addAoleAccount">
						<view class="item-imgs">+</view>
						<view class="item-title">添加账号</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {GET_USER_INFO_LIST,REMOVE_BIND_USER} from "@/common/js/apiUrl.js"
	import {setStateRecords,getChilderList} from "@/common/httpApi/boundHttpApi.js"
	import {deleteOperation} from "@/common/httpApi/comhttpApi.js"
	export default {
		data() {
			return {
				isClear:false,
				wxOpenId:"",
				roleType:"",
				userList:[],
				currentLoginUserId:"",
			};
		},
		onLoad() {
			this.getInitDate();
		},
		methods:{
			// 获取初始化数据
			getInitDate(){
				const roleType = uni.getStorageSync("roleType");
				const wxOpenId = uni.getStorageSync("openId");
				if(roleType && wxOpenId){
					this.wxOpenId = wxOpenId;
					this.roleType = roleType;
					if(roleType == -1){
						//没有绑定任何用户
						console.log("获取的类型为未绑定状态");
					}else if(roleType == 1){
						this.currentLoginUserId = uni.getStorageSync("parentId");
					}else{
						this.currentLoginUserId = uni.getStorageSync("userId");
					}
					this.getUserList(wxOpenId);
				}else{
					this.getInitDate();
				}
			},
			// 获取用户列表
			async getUserList(openId){
				const userDate = await this.$http.post(GET_USER_INFO_LIST,{openId:openId});
				if(userDate.code == 200 && userDate.status ==1){
					userDate.data.map(item =>{
						if(item.userId == this.currentLoginUserId){
							item.isCurrent=true
						}else{
							item.isCurrent=false
						}
					});
					this.userList = userDate.data;
				}
			},
			// 账号切换
			async accountSwitch(item){
				try{
					// 不管切换谁 都需要将状态进行记录一下
					setStateRecords(item.id);
					
					// 如果是学生
					if(item.userType==0 && item.student){
						uni.setStorageSync('roleType',item.userType);
						uni.setStorageSync('userId',item.student.userId);
						uni.setStorageSync('student',item.student);
						uni.removeStorageSync("cardDate");
						this.$Q.tipUrl({tip:"切换成功",url:"/pages/index/index",isTab:true})
					}
					// 家长的时候
					else if(item.userType==1 && item.userId){
						uni.setStorageSync('roleType',item.userType);
						uni.setStorageSync('parentId',item.userId);
						
						const childrenList = await getChilderList(item.userId);
						const filterList = childrenList.filter(item => item.loginFlag);
						if(childrenList.length){
							if(filterList.length>0){
								if(filterList[0].student){
									uni.setStorageSync("userId",filterList[0].student.userId);
									uni.setStorageSync("student",filterList[0].student);
								}else{
									this.$Q.tipUrl({tip:"获取学生数据异常,联系客服"});
									return;
								}
							}else{
								uni.setStorageSync("userId",childrenList[0].student.userId);
								uni.setStorageSync("student",childrenList[0].student);
							}
							this.$Q.tipUrl({
								tip:"切换成功",
								url:"/pages/index/index",
								isTab:true
							})
						}else{
							this.$Q.tipUrl({
								tip:"获取学生数据异常,重新添加学生",
								url:"/parent/home/add-baby"
							})
						}
					}
					// 教师的时候
					else if(item.userType==2 && item.teacher.userId){
						thi.$Q.tipUrl({tip:"此版本暂未做教师角色"});
						return
						
						uni.setStorageSync('roleType',item.userType);
						uni.setStorageSync('userId',item.teacher.userId);
						this.$Q.tipUrl({
							tip:"切换成功",
							url:"/pages/index/index",
							isTab:true
						});
					}else{
						this.$Q.tipUrl({
							tip: "切换失败,数据不完整,联系客服",
						});
					}
				}catch(e){
					//TODO handle the exception
					console.log("切换账号遇到错误")
				}
			},
			// 添加其他角色账号
			addAoleAccount(){
				uni.navigateTo({
					url:"/parent/home/select-role"
				})
			},
			// 关闭按钮
			shutDown(){
				uni.navigateBack({
					delta:1,
				})
			},
			// 清除账号绑定
			async clear(item,index){
				const backDate = await deleteOperation({
					e:null,
					tipTitle:"删除绑定账号",
					tipContent:"确定要删除该账号吗",
					deleteApi:REMOVE_BIND_USER,
					data:{
						id:item.id
					}
				});
				if(backDate){
					if(this.userList.length == 1){
						const openId = uni.getStorageSync("openId");
						const wxUserInfo = uni.getStorageSync("wxUserInfo");
						uni.clearStorageSync();
						uni.setStorageSync("roleType",-1);
						uni.setStorageSync("openId",openId);
						uni.setStorageSync("wxUserInfo",wxUserInfo);
						uni.switchTab({
							url:"/pages/index/index"
						})
					}
					this.userList.splice(index,1);
				}
			}
		},
		filters:{
			getDate(data){
				return data.substr(5,5)
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #f8f8f8;
	}
	.transit{
		width: 100vw;
		.transit-site{
			width: 100vw;
			@include flex();
			padding: 0 40rpx;
			height: 80rpx;
			.site-shutDown{
				font-size: 34rpx;
				letter-spacing: 4rpx;
				font-family: "微软雅黑";
			}
		}
		.transit-tutle{
			margin-top: 100rpx;
			@include flex($hov:center);
			height: 84rpx;
			width: 100vw;
			font-size: 56rpx;
			text-align: left;
			font-family: 'SourceHanSansSC-regular';
			color: #333333;
		}
		.transit-horizontalLine{
			@include flex($hov:center);
			width: 100vw;
			.horizontalLine{
				margin: 100rpx 0;
				width: 300rpx;
				height: 2rpx;
				background-color: #BBBBBB;
			}
		}
		.transit-item{
			width: 100vw;
			@include flex($hov:center);
			flex-direction: column;
			.item{
				background-color: #FFFFFF;
				width: 680rpx;
				height: 130rpx;
				border-radius: 20rpx;
				margin-bottom: 30rpx;
				@include flex($hov:center);
				padding:0 30rpx;
				.display{
					display: flex;
					align-items: center;
					flex: 1;
					.item-img{
						width: 100rpx;
						height: 100rpx;
						@include flex($hov:center);
						border: 2rpx solid #CCCCCC;
						font-size: 38rpx;
						color: #CCCCCC;
						border-radius: 10rpx;
						overflow: hidden;
					}
					.item-title{
						margin-left: 30rpx;
						font-size: 34rpx;
						color: #000000;
						font-family: $fontFamily01;
						letter-spacing: 4rpx;
					}
					.item-titles{
						margin-left: 30rpx;
						.titles-nema{
							font-size: 34rpx;
							color: #000000;
							font-family: $fontFamily01;
							.name-character{
								margin-left: 60rpx;
								font-family: $fontFamily05;
								font-size: 24rpx;
								color: #FFFFFF;
								display: inline-block;
								padding: 0 15rpx;
								height: 35rpx;
								background-color: #0099ff;
								line-height: 35rpx;
								border-radius: 20rpx;
							}
						}
						.titles-time{
							font-size: 26rpx;
							margin-top: 10rpx;
							color: #0099ff;
							.name-count{
								font-size: 26rpx;
								color: #ff0000;
								margin-left: 60rpx;
							}
						}
					}
					.item-imgs{
						color: #CCCCCC;
						font-size: 54rpx;
						border: 2rpx solid #CCCCCC;
						width: 100rpx;
						height: 100rpx;
						@include flex($hov:center);
						border-radius: 10rpx;
						overflow: hidden;
					}
				}
				.clear{
					font-family: $fontFamily05;
					font-size: 30rpx;
					color: #FFFFFF;
					background-color: #f25542;
					height: 60rpx;
					padding: 0 30rpx;
					@include flex($hov:center);
					border-radius: 10rpx;
					
				}
				.current{
					font-family: $fontFamily05;
					font-size: 30rpx;
					color: #0099ff;
					background-color: rgba($color: #0099ff, $alpha: .2);
					padding: 0 30rpx;
					border-radius: 10rpx;
					height: 50rpx;
					line-height: 50rpx;
				}
			}
		}
	}
</style>