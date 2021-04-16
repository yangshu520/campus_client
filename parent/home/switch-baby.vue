<template>
	<view>
		<view class="container">
			<uni-swipe-action>
				<block v-for="(item,index) in childreList" :key="index">
					<uni-swipe-action-item :right-options="item.loginFlag?[]:swicthOptions" @click="deleteStudent($event,item,index)">
						<view class="count container-item" @click="switchStudent(item)">
							<view class="item-avter">
								<image :src="item.iconLink || '/static/img/home/avter.png'" mode="aspectFill"/>
							</view>
							<view class="item-center">
								<view class="center-name">
									{{item.student.studentName}}
								</view>
								<view class="center-school">
									{{item.student.classes && item.student.classes.classesName}}
								</view>
							</view>
							<view class="item-choose" v-if="item.loginFlag">
								<image src="/static/img/parent/choose-babay.png" mode="aspectFill"/>
							</view>
						</view>
					</uni-swipe-action-item>
				</block>
			</uni-swipe-action>
			
			<!-- 添加宝贝 -->
			<view class="container-item" v-show="childreList.length < 10" @click="addBabay">
				<view class="item-avter">
					<image src="/static/img/parent/add-babay.png" mode="aspectFill"/>
				</view>
				<view class="item-center">添加宝贝</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getChilderList,setSwicthStudent,setDeleteStudent} from "@/common/httpApi/boundHttpApi.js"
	export default {
		data() {
			return {
				childreList:[],
				swicthOptions:[
					{
						text: '删除',
						style: {
							backgroundColor: '#FF3232',
							color:'#FFFFFF',
							fontSize:'32rpx'
						}
					}
				],
			};
		},
		onLoad() {
			this.getInitDate();
		},
		methods:{
			async getInitDate(){
				const parentId = uni.getStorageSync("parentId");
				if(parentId){
					const backList = await getChilderList(parentId);
					if(backList.length){
						this.childreList = backList.filter(item => item.studentId && item.studentParentId && item.student)
					}else{
						// 获取的到的数据是空数组
						this.$Q.tipUrl({
							tip:"学生数据为空,重新绑定",
							url:"/parent/home/add-baby"
						})
					}
				}else{
					this.$Q.tipUrl({tip:"获取家长数据失败,联系客服"})
				}
			},
			// 切换学生
			async switchStudent(data){
				const date = {
					parentId:data.studentParentId,
					studentId:data.studentId
				}
				const bankRes = await setSwicthStudent(date);
				if(bankRes){
					uni.setStorageSync("userId",data.student.userId);
					uni.setStorageSync("student",data.student);
					this.$Q.tipUrl({
						tip:"切换成功",
						url:"/pages/index/index",
						isTab:true
					});
					uni.removeStorageSync("cardDate");
				}
			},
			// 删除学生
			async deleteStudent(e,date,index){
				const backDate = await setDeleteStudent(e,date);
				if(backDate){
					this.childreList.splice(index,1);
				}
			},
			// 添加学生
			addBabay(){
				if(this.childreList.length >= 10){
					this.$Q.tipUrl({
						tip:"只能绑定10个学生"
					});
					return
				}
				uni.navigateTo({
					url:"/parent/home/add-baby"
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.container{
	padding-top: 20rpx;
	.container-item{
		padding: 0 20rpx;
		border-bottom: 2rpx solid #f5f5f5;
		background-color: #fff;
		display: flex;
		align-items: center;
		height: 140rpx;
		width: 100%;
		.item-avter{
			width: 115rpx;
			height: 115rpx;
			overflow: hidden;
			border-radius: 50%;
		}
		.item-center{
			font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
			flex: 1;
			padding-left: 20rpx;
			font-size: $fontSize02;
			font-weight: 500;
			color: #3cb2ef;
			.center-name{
				font-size: $fontSize02;
				font-weight: 500;
				color: #222222;
				line-height: 45rpx;
			}
			.center-school{
				font-size: $fontSize03;
				color: #999;
			}
		}
		.item-choose{
			width: 44rpx;
			height: 30rpx;
			margin-right: 14rpx;
		}
	}
}
</style>
