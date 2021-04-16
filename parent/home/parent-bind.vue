<template>
	<view>
		<view class="pages">
			<!-- 标题 -->
			<view class="bind-title">{{type == 1 ?"家长绑定":"学生绑定"}}</view>
			<view class="bind-content">
				<!-- 姓名 -->
				<view class="content-item">
					<view class="item-fixed">{{type == 1 ?"学生姓名":"姓名"}}</view>
					<view class="item-input">
						<input v-model="fullName" placeholder="请输入学生姓名" placeholder-class="place" maxlength="18"/>
					</view>
				</view>
				<!-- 学号 -->
				<view class="content-item">
					<view class="item-fixed">{{type == 1 ?"学生学号":"学号"}}</view>
					<view class="item-input">
						<input v-model="studentID" placeholder="请输入学生学号" type="number" placeholder-class="place" maxlength="18"/>
					</view>
				</view>
				<!-- 班级 -->
				<view class="content-item">
					<view class="item-fixed">班级</view>
					<view class="item-input">
						<view class="item-school" @click="handleTap('picker')" :class="classTrue?'classTrue':''">{{className}}</view>
						<view class="iconfont icon-qianjin" style="font-size: 35rpx;color:#bec2cd;font-weight: bold;" @click="handleTap('picker')"></view>
					</view>
				</view>
				<!-- 如果是家长的话 -->
				<view class="content-item" v-if="type==1">
					<view class="item-fixed">角色</view>
					<view class="item-input">
						<view class="item-school" @click="handleTap1('picker1')" :style="prantTrue?'color: #000000;':''">{{parentName}}</view>
						<view class="iconfont icon-qianjin" style="font-size: 35rpx;color:#bec2cd;font-weight: bold;" @click="handleTap('picker1')"></view>
					</view>
				</view>
				<!-- 家长姓名 -->
				<view class="content-item" v-if="type==1">
					<view class="item-fixed">家长姓名</view>
					<view class="item-input">
						<input v-model="parentsName" placeholder="请输入家长姓名" placeholder-class="place" maxlength="18"/>
					</view>
				</view>
				<!-- 手机号 -->
				<view class="content-item">
					<view class="item-fixed">手机号</view>
					<view class="item-input">
						<input v-model="phoneNumber" type="number" placeholder="请输入11位手机号码" placeholder-class="place" maxlength="11"/>
					</view>
				</view>
				<!-- 验证码 -->
				<view class="content-item">
					<view class="item-fixed">验证码</view>
					<view class="item-input">
						<input v-model="captchaNumber" type="number" placeholder="请输入验证码" placeholder-class="place" style="width: 400rpx;" maxlength="6"/>
						<button class="captcha" :disabled="disabled" @click="captcha" :class="((/^1[3-9]{1}[0-9]{9}$/).test(this.phoneNumber))?'captchas':''">{{send}}</button>
					</view>
				</view>
				
				<!-- 同意阅读 -->
				<view class="agree">
					<text class="iconfont icon-tongyi1" style="font-size: 28rpx;color: #3e74ef;"></text>
					<text style="margin-left: 15rpx;color: #666666;font-family: 'STHeitiTC';">继续往下操作,即同意我们的</text>
					<text style="margin-left: 6rpx;color: #4b80fb;">"服务协议"</text>
				</view>
				
				<!-- 绑定 -->
				<view class="binding" @click="binding" :class="captchaNumber.length==6?'bindings':''">绑定</view>
				
			</view>
			
			<!-- 账号密码绑定 -->
			<view class="account">暂不支持账号密码绑定</view>
			
			<!-- 班级弹出来的选择班级的控件 -->
			<lb-picker ref="picker" v-model="picker" mode="multiSelector" :list="classNameList" :level="6" @confirm="handleConfirm"></lb-picker>
			
			<!-- 班级弹出来的选择班级的控件 -->
			<lb-picker ref="picker1" v-model="picker1" mode="multiSelector" :list="parentNameList" :level="1" @confirm="handleConfirm1"></lb-picker>
		
			<!-- 提示 -->
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import {
		getClassesList,
		getFieldList,
		getVertryCode,
		boundSaveInfo
	} from "@/common/httpApi/boundHttpApi.js"
	import {wxAuthorize} from "@/common/js/app.js"
	import LbPicker from '@/uni-components/lb-picker'
	export default{
		components:{LbPicker},
		data(){
			return{
				type:'', // 身份类型
				parentsName:'',//家长姓名
				fullName:'',// 学生姓名
				studentID:'',//学生学号
				phoneNumber:'',// 手机号
				captchaNumber:'',// 输入的验证码
				classesId:'',//班级id
				openId:'',
				
				//页面需要的数据
				prantTrue:false,//家长选择角色
				parentName:'请选择家长角色',//家长默认选择
				className:'请选择学校班级',//默认显示
				picker1:[],//家长选择绑定列表
				picker: [],//班级绑定的列表
				classTrue:false,//字体颜色和大小控制
				classNameList:[],
				parentNameList:[],
				send:'获取验证码',//发送验证码
				disabled:false,//是否禁用按钮
				count:60,
				verifiCode:'',
				
				// 返回的数据
				backParams:null,
				// 验证码过期的时间
				expireDate:"",
			}
		},
		onLoad(options){
			this.getInitDate(options);
		},
		methods:{
			// 数据初始化
			async getInitDate(option){
				// 存一下基本的数据
				this.type = option.type;
				this.openId = uni.getStorageSync('openId') || null;
				if(!this.openId){
					this.$Q.tipUrl({tip:"需要重新获取数据,稍等"});
					wxAuthorize();
					return;
				}
				// 异步获取需要的数据
				this.classNameList = await getClassesList();
				const fildDate = await getFieldList('parentRole');
				if(fildDate.length){
					const parentNameList = [];
					fildDate.forEach((item,index) => {
						parentNameList.push({
							label:item.codedesc,
							value:item.code
						})
					});
					this.parentNameList = parentNameList;
				}else{
					this.$Q.tipUrl({tip:"获取家长角色信息为空,联系客服"});
				}
			},
			// 显示对应的选择器
			handleTap (picker) {
				this.$refs[picker].show()
			},
			handleConfirm (item) {
				const labelArr = item.item;
				const titleName = []
				for(var i=0;i<labelArr.length;i++){
					titleName.push(labelArr[i].label)
				}
				this.className = titleName.join('');
				this.classTrue = true;
				this.classesId = item.value[item.value.length-1];
			},
			handleConfirm1(item) {
				this.parentName = item.item[0].label;
				this.prantTrue = true;
			},
			// 获取验证码
			captcha(){
				if(this.fullName.length < 1 ){
					this.$Q.tipUrl({tip:"请填写学生姓名"});
				}
				else if(this.studentID.length < 1){
					this.$Q.tipUrl({tip:"请输入学生学号"});
				}
				else if(this.picker.length == 0){
					this.$Q.tipUrl({tip:"请选择学生所在的班级"});
				}
				else if(this.type == 1 && this.picker1.length == 0){
					this.$Q.tipUrl({tip:"请选择家长的角色"});
				}
				else if(this.type == 1 && this.parentsName.length < 2){
					this.$Q.tipUrl({tip:"请输入家长的姓名"});
				}
				else if(!((/^1[3-9]{1}[0-9]{9}$/).test(this.phoneNumber))){
					this.$Q.tipUrl({tip:"请输入正确的手机号码"});
				}else{
					// 绑定学生
					if(this.type == 0){
						const data = {
							type: this.type,
							studentName: this.fullName,
							studentCode: this.studentID.toString(),
							classesId: this.classesId,
							phoneNum: this.phoneNumber.toString()
						};
						this.getPhoneVerify(data);
					}else if(this.type == 1){
						const data = {
							type: this.type,
							studentName: this.fullName,
							studentCode: this.studentID.toString(),
							classesId: this.classesId,
							phoneNum: this.phoneNumber.toString(),
							parentName: this.parentsName,
							codedesc: this.parentName
						}
						this.getPhoneVerify(data);
					}
				}
			},
			// 获取验证码
			async getPhoneVerify(data){
				const homeDate = await getVertryCode(data);
				if(homeDate.param && homeDate.code){
					// 存一下时间
					this.expireDate = new Date().getTime();
					// 存一下数据
					this.backParams = homeDate.param;
					this.verifiCode = homeDate.code;
					// 操作页面
					this.disabled = true;
					let countdown = setInterval( () => {
						this.count--;
						this.send = this.count + 's重新获取';
						if( this.count < 0 ){
							clearInterval(countdown);
							this.send = '重新获取';
							this.disabled = false;
							this.count = 60;
						}
					},1000);
					this.$Q.tipUrl({tip:'发送成功,请查收'});
				}else{
					this.$Q.tipUrl({tip:'验证码次数上限,明天再来'});
				}
			},
			// 绑定信息
			async binding(){
				if(!this.backParams){
					this.$Q.tipUrl({tip:"请先获取验证码在绑定"});
				}
				else if(!(this.fullName == this.backParams.studentName)){
					this.$Q.tipUrl({tip:"请检查学生姓名是否正确"});
				}
				else if(!(this.studentID == this.backParams.studentCode)){
					this.$Q.tipUrl({tip:"请检查学生学号是否正确"});
				}
				else if(!(this.classesId == this.backParams.classesId)){
					this.$Q.tipUrl({tip:"请检查选择的班级是否正确"});
				}
				else if(!(this.phoneNumber == this.backParams.phoneNum)){
					this.$Q.tipUrl({tip:"请检查手机号是否正确"});
				}
				else if( this.type == 1 && !(this.parentName == this.backParams.codedesc)){
					this.$Q.tipUrl({tip:"请检查选择的角色是否正确"});
				}
				else if(this.type == 1 &&!(this.parentsName == this.backParams.parentName)){
					this.$Q.tipUrl({tip:"请输入家长的姓名"});
				}
				else if(this.captchaNumber != this.verifiCode || this.captchaNumber.trim().length != 6){
					this.$Q.tipUrl({tip:"请输入正确的验证码"});
				}
				else if((new Date().getTime()) - this.expireDate > 180000){
					this.$Q.tipUrl({tip:"验证码已过期,重新获取"});
				}
				else{
					if(this.type == 0){
						const data = {
							type: this.type,
							openId: this.openId,
							studentName: this.fullName,
							studentCode: this.studentID.toString(),
							classesId: this.classesId,
							phoneNum: this.phoneNumber.toString()
						};
						const homeDate = await boundSaveInfo(data);
						if(homeDate.success){
							uni.setStorageSync('roleType',String(homeDate.type));
							uni.setStorageSync('userId',homeDate.data.student.userId);
							uni.setStorageSync('student',homeDate.data.student);
							this.$Q.tipUrl({
								tip: "绑定成功",
								url:'/pages/index/index',
								isTab:true
							});
						}else{
							this.$Q.tipUrl({tip:homeDate.msg});
						}
					}else if(this.type == 1){
						const data = {
							type: this.type,
							openId: this.openId,
							studentName: this.fullName,
							studentCode: String(this.studentID),
							classesId: this.classesId,
							phoneNum: String(this.phoneNumber),
							parentName: this.parentsName,
							parentRole: this.parentName
						};
						const homeDate = await boundSaveInfo(data);
						if(homeDate.success){
							uni.setStorageSync('roleType',homeDate.type);
							uni.setStorageSync('userId',homeDate.data.student.userId);
							uni.setStorageSync('parentId',homeDate.data.studentParent.id);
							uni.setStorageSync('student',homeDate.data.student);
							this.$Q.tipUrl({
								tip: "绑定成功",
								url:'/pages/index/index',
								isTab:true
							});
						}else{
							this.$Q.tipUrl({tip:homeDate.msg});
						}
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.pages{
		width: 100vw;
		min-height: 100vh;
		background-image: url('http://www.zjsmjcschool.com/doc/message/image/18b8b543-9ad7-11e8-aebe-1368d4ec24eb/1603364511892.jpg');
		background-repeat: no-repeat;
		background-size: cover;
		display: flex;
		align-items: center;
		flex-direction: column;
		.bind-title{
			font-size: 37rpx;
			color: #FFFFFF;
			height: 87rpx;
			@include flex($hov:center)
		}
		.bind-content{
			width: 666rpx;
			background-color: #FFFFFF;
			border-radius: 15rpx;
			margin-top: 15rpx;
			padding: 35rpx 54rpx 0 44rpx;
			.content-item{
				display: flex;
				flex-direction: column;
				height: 150rpx;
				border-bottom: 2rpx solid #f1f2f1;
				.item-fixed{
					height: 70rpx;
					line-height: 70rpx;
					color: $color02;
					font-size: $fontSize03;
				}
				.item-input{
					height: 80rpx;
					@include flex();
					font-family: Noto Sans S Chinese;
					font-size: 30rpx;
					.item-school{
						width: 520rpx;
						height: 60rpx;
						line-height: 60rpx;
						font-size:28rpx;
						font-family: Noto Sans S Chinese;
						color: #cccccc;
					}
					.classTrue{
						color: #333333;
						font-size: 28rpx;
						max-width: 520rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					input{
						height: 60rpx;
						width: 520rpx;
						line-height: 60rpx;
						color: #333333;
					}
					.place{
						font-size:28rpx;
						font-family: Noto Sans S Chinese;
						color: #cccccc;
					}
					.captcha{
						height: 60rpx;
						width: 185rpx;
						line-height: 60rpx;
						font-size:28rpx;
						color: #999999;
						text-align: center;
						background-color: #f2f2f2;
						border-radius: 10rpx;
						margin: 0;
						padding: 0 5rpx;
						&.captchas{
							background-color: #3a91ff;
							color: #FFFFFF;
						}
					}
					.option{
						animation: all .5s;
						transform: rotate(90deg);
					}
				}
			}
			.agree{
				margin: 40rpx 0;
				font-size: 22rpx;
			}
			.binding{
				display: flex;
				justify-content: center;
				height: 84rpx;
				line-height: 84rpx;
				background-color: #999;
				font-size: 30rpx;
				font-family: 'SourceHanSansCN Regular';
				color: #FFFFFF;
				border-radius: 44rpx;
				margin-bottom: 40rpx;
				&.bindings{
					background-image: url('http://www.zjsmjcschool.com/doc/message/image/18b8b543-9ad7-11e8-aebe-1368d4ec24eb/1603365487917.png');
					background-repeat: no-repeat;
					background-size: cover;
					background-color: #FFFFFF;
				}
			}
		}
		.account{
			font-size: 22rpx;
			font-family: 'SourceHanSansCN Light';
			color: #fefefe;
			letter-spacing: 3rpx;
			@include flex($hov:center);
			height: 70rpx;
		}
	}
</style>