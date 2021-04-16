<template>
	<view>
		<view class="container">
			<view class="container-title">{{tipTitle}}</view>
			<view class="container-item" style="height: 160rpx;">
				<view class="item-name">头像</view>
				<view class="item-img" @click="choosIemage">
					<image :src="avterImg" mode="aspectFill" />
				</view>
			</view>
			<view class="container-item">
				<view class="item-name">姓名</view>
				<view class="item-inp" v-if="!studentDate">
					<input placeholder="请填写学生姓名" v-model.trim="studentName" maxlength="18" placeholder-style="font-size:30rpx;"/>
				</view>
				<view class="item-inp" v-else>{{studentDate.studentName}}</view>
			</view>
			<view class="container-item">
				<view class="item-name">学号</view>
				<view class="item-inp" v-if="!studentDate">
					<input placeholder="请填写学生学号" v-model.trim="studentCode" maxlength="18" placeholder-style="font-size:30rpx;"/>
				</view>
				<view class="item-inp" v-else>{{studentDate.studentCode}}</view>
			</view>
			<view class="container-item">
				<view class="item-name">班级</view>
				<view class="item-inp">
					<view v-if="!studentDate" class="inp-title" :class="classesName?'':'select-title'"  @click="handleTap('classes')">
						{{classesName?classesName:"请选择所在班级"}}
					</view>
					<view v-else class="inp-title">
						{{studentDate.classes&&studentDate.classes.schoolName +'  '+studentDate.classes.classesName}}
					</view>
				</view>
				<lb-picker ref="classes" v-model="picker" mode="multiSelector" :list="classesList" :level="6" @confirm="handleConfirm"></lb-picker>
			</view>
			<view class="container-item" v-if="!studentDate">
				<view class="item-name">关系</view>
				<view class="item-inp">
					<view  class="inp-title" @click="parentRolesShow = true" :class="parentRole?'':'select-title'">
						{{parentRole?parentRole:"请选择所属关系"}}
					</view>
					<!-- <view v-else class="inp-title select-title">1111</view> -->
				</view>
				<u-select v-model="parentRolesShow" mode="mutil-column-auto" :list="parentRoleList" @confirm="parentRolesConfirm"></u-select>
			</view>
			
			<!-- 添加绑定 -->
			<view v-if="!studentDate" class="container-add" @click="addBabay">确定</view>
		</view>
	</view>
</template>

<script>
	import LbPicker from '@/uni-components/lb-picker'
	import { BASE_URL,COM_UPLOAD_AVTER} from "@/common/js/apiUrl.js"
	import {
		getFieldList,
		getClassesList,
		addBindStudent
		} from "@/common/httpApi/boundHttpApi.js"
	export default {
		components:{
			LbPicker
		},
		data() {
			return {
				classesList:[],
				parentRoleList:[],
				// 需要的数据
				studentName:null,
				studentCode:null,
				parentId:null,
				classesId:null,
				parentRole:null,
				avterImg:"/static/img/parent/add-avter.png",
				
				// 控制数据或者显示的数据
				parentRolesShow:false,
				picker: [],
				classesName:null,
				
				//详情的时候需要显示的数据
				studentDate:null,
				tipTitle:"添加宝贝信息"
			};
		},
		onLoad(options) {
			try{
				if(options.dateil){
					this.tipTitle = "宝贝详细信息"
					const studentDate = uni.getStorageSync("student");
					if(studentDate){
						this.studentDate = studentDate;
						this.avterImg = studentDate.iconLink || "/static/img/parent/add-avter.png";
					}else{
						this.$Q.tipUrl({
							tip:"获取的数据异常,请重新绑定"
						})
					}
					return;
				}
				this.getInitDate()
			}catch(e){
				//TODO handle the exception
				console.log(e)
			}
		},
		methods:{
			async getInitDate(){
				try{
					this.classesList = await getClassesList();
					const resList = await getFieldList("parentRole");
					// 数据先清空
					this.parentRoleList=[];
					resList.forEach((item,index)=>{
						this.parentRoleList.push({
							label:item.codedesc,
							value:item.code
						})
					});
					this.parentId = uni.getStorageSync("parentId");
				}catch(e){
					//TODO handle the exception
					console.log("添加学生异常"+e)
				}
			},
			// 选择头像
			choosIemage(){
				uni.chooseImage({
					count:1,
					success: (res) => {
						this.avterImg = res.tempFilePaths[0];
						if(this.studentDate){
							this.uploadAvterImg(this.avterImg,this.studentDate.id);
						}
					}
				})
			},
			// 选择完角色完成触发
			parentRolesConfirm(e){
				this.parentRole=e[0].label;
			},
			// 选择学校班级
			handleTap (picker) {
				this.$refs[picker].show()
			},
			handleConfirm (item) {
				const labelArr=item.item;
				const titleName=[]
				for(var i=0;i<labelArr.length;i++){
					titleName.push(labelArr[i].label)
				}
				this.classesName=titleName.join('');
				this.classesId=item.value[item.value.length-1];
			},
			// 上传头像
			uploadAvterImg(temp,id,student){
				uni.showLoading({title:"上传中..."});
				uni.uploadFile({
					url: BASE_URL+COM_UPLOAD_AVTER,
					filePath: temp,
					name: 'file',
					formData:{
						studentId:id
					},
					success:(res)=>{
						uni.hideLoading();
						const result = res.data && JSON.parse(res.data);
						if(result.code == 200 && result.status == 1){
							this.$Q.tipUrl({tip:"头像上传成功",timeOut:1000});
							this.avterImg = result.data;
							if(student){
								student.iconLink = result.data;
								uni.setStorageSync("student",student);
								return;
							}
							this.studentDate.iconLink = result.data;
							uni.setStorageSync("student",this.studentDate);
						}else{
							this.$Q.tipUrl({tip:"头像上传失败"});
						}
					},
					complete:()=>{
						uni.hideLoading();
					}
				})
			},
			// 添加babay
			async addBabay(){
				if(!this.parentId){
					this.$Q.tipUrl({tip:"获取家长数据失败"});
					this.parentId = uni.getStorageSync("parentId");
					return;
				}
				if(!this.studentName){
					this.$Q.tipUrl({tip:"请填写学生姓名"});
					return;
				}
				if(!this.studentCode){
					this.$Q.tipUrl({tip:"请填写学生学号"});
					return;
				}
				if(!this.classesId){
					this.$Q.tipUrl({tip:"请选择所在班级"});
					return;
				}
				if(!this.parentRole){
					this.$Q.tipUrl({tip:"请选择所属关系"});
					return;
				}
				
				try{
					const addStudentDate = {
						parentId:this.parentId,
						parentRole:this.parentRole,
						studentName:this.studentName,
						studentCode:this.studentCode,
						classesId:this.classesId,
					};
					const addBackDate = await addBindStudent(addStudentDate);
					
					uni.setStorageSync("userId",addBackDate.student.userId);
					if(this.avterImg != '/static/img/parent/add-avter.png'){
						await this.uploadAvterImg(this.avterImg,addBackDate.student.id,addBackDate.student);
					}else{
						uni.setStorageSync('student',addBackDate.student);
					}
					this.$Q.tipUrl({
						tip: '绑定成功',
						url: '/pages/index/index',
						isTab:true
					});
					// 清除一下电子学生证的信息数据
					uni.removeStorageSync("cardDate");
				}catch(e){
					//TODO handle the exception
					console.log("添加绑定学生失败"+e)
				}
			}
		}
	}
</script>

<style lang="scss">
.container{
	width: 100%;
	padding: 0 32rpx;
	.container-title{
		font-size: 52rpx;
		font-weight: bold;
		text-align: left;
		color: #333333;
		line-height: 80rpx;
		letter-spacing: -2rpx;
	}
	.container-item{
		height: 124rpx;
		padding: 10rpx;
		@include flex($hov:space-between);
		border-bottom: 2rpx solid #f1f1ff;
		.item-name{
			font-size: 32rpx;
			font-family: inpinheiti Regular, inpinheiti Regular-Regular;
			color: #333333;
		}
		.item-img{
			width: 124rpx;
			height: 124rpx;
			overflow: hidden;
			border-radius: 50%;
		}
		.item-inp{
			flex: 1;
			text-align: right;
			input{
				flex: 1;
				text-align: right;
				font-size: 32rpx;
			}
			.inp-title{
				flex: 1;
				text-align: right;
				font-size: 32rpx;
				color: #333333;
				max-width: 600rpx;
				@include textEllipsis();
				&.select-title{
					font-size: 30rpx;
					color: #777;
				}
			}
		}
	}
	.container-add{
		margin-top: 200rpx;
		width: 100%;
		height: 134rpx;
		background-image: url('/static/img/parent/add-babay-bg.png');
		background-size: cover;
		background-repeat: no-repeat;
		font-size: 32rpx;
		color: #fff;
		font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
		@include flex($hov:center);
	}
}
</style>
