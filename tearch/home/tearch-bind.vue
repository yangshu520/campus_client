<template>
	<view>
		<!-- 标题 -->
		<view class="tearcher">教师绑定</view>
		<!-- 绑定信息 -->
		<view class="bind">
			<!-- 验证码 -->
			<view class="bind-item">
				<input v-model.trim="idCardNumber" placeholder="请输入老师的姓名" placeholder-class="place" style="width: 400rpx;" maxlength="18"/>
			</view>
			<!-- 手机号 -->
			<view class="bind-item">
				<input v-model.trim="phoneNumber" type="number" placeholder="请输入11位手机号码" placeholder-class="place" maxlength="11"/>
				<button @click="captcha" :disabled="disabled" :class="((/^1[3-8]{1}[0-9]{9}$/).test(this.phoneNumber))?'captchas':''">{{send}}</button>
			</view>
			<!-- 验证码 -->
			<view class="bind-item">
				<input v-model.trim="captchaNumber" type="number" placeholder="请输入短信验证码" placeholder-class="place" style="width: 400rpx;" maxlength="6"/>
			</view>
			
			<!-- 同意阅读 -->
			<view class="agree">
				<text class="iconfont icon-tongyi1" style="font-size: 28rpx;color: #3e74ef;"></text>
				<text style="margin-left: 15rpx;color: #666666;font-family: 'STHeitiTC';">继续往下操作,即同意我们的</text>
				<text style="margin-left: 6rpx;color: #4b80fb;">"服务协议"</text>
			</view>
			
			<!-- 绑定 -->
			<view class="binding" @click="bind" :class="captchaNumber.length !==0?'bindings':''">绑定</view>
			
			<!-- 账号密码绑定 -->
			<view class="account">暂不支持账号密码绑定</view>
			
		
			<!-- 提示 --> 
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classNameList:[],
				classTrue:false,
				tearcharName:'请选择学校',
				picker: [],//教师绑定的数组
				type:'',//身份类型
				phoneNumber:'',// 手机号码
				captchaNumber:'',// 输入的验证码
				disabled:false,// 是否禁用按钮
				count:60,// 倒计时
				verifiCode:'',// 接收到的验证码
				idCardNumber:'',//老师的身份证号
				classesId:'',//学校id
				param:'',
				send:"获取验证码",
				openId:'',
				expireDate:"",
				
				wxUserList:"",
				// 不同角色
				typeObj:{"studentType":null,"parentType":null,"teacherType":null}
			};
		},
		onLoad(option){
			this.type=option.type;
			const openId=this.$queue.getData('openId');
			if(openId){
				this.openId=openId
			}else{
				this.$queue.showTost("没有获取到openId,请重新进入");
			}
			this.getWxUser();
		},
		methods:{
			getWxUser(){
				// 获取到微信角色列表
				this.$http.post('/common/getFieldList',{
					field:'wxUserType'
				}).then(res=>{
					if(res.code==0){
						this.wxUserList=res.data;
					}else{
						this.$refs.uToast.show({
							title: '获取微信用户信息失败,请重新进入',
							type: 'error',
						});
					}
				})
			},
			// 获取验证码
			captcha(){
				if(!this.idCardNumber){
					this.$refs.uToast.show({
						title: '请填写正确的姓名',
						type: 'info',
					});
				}else if(!((/^1[3-9]{1}[0-9]{9}$/).test(this.phoneNumber))){
					this.$refs.uToast.show({
						title: '请输入正确的手机号码',
						type: 'info',
					});
				}else{
					console.log(this.type)
					this.$http.post('/getPhoneVerifyCode',{
						type:this.type,
						userName:this.idCardNumber,
						phoneNum:this.phoneNumber.toString()
					}).then((res)=>{
						console.log(res)
						if(res.code==200&&res.status==1){
							if(res.data.code&&res.data.param){
								this.expireDate=new Date().getTime();
								
								this.$refs.uToast.show({
									title: "发送成功",
									type: 'success',
								});
								
								this.param=res.data.param;
								this.verifiCode=res.data.code;
								
								this.disabled=true;
								let countdown = setInterval( () => {
									this.count--;
									this.send = this.count + 's重新获取';
									if( this.count < 0 ){
										clearInterval(countdown);
										this.send = '重新获取';
										this.disabled = false;
										this.count=60;
									}
								},1000);
							}else{
								this.$refs.uToast.show({
									title: "获取验证码次数上限,获取失败",
									type: 'error',
								});
							}
							
						}else{
							this.$refs.uToast.show({
								title: res.msg,
								type: 'error',
							});
						}
					})
				}
			},
			bind(){
				if(!this.param){
					this.$refs.uToast.show({
						title: '请先获取验证码在绑定',
						type: 'info',
					});
				}else if(!(this.idCardNumber==this.param.userName)){
					this.$refs.uToast.show({
						title: '请填写正确的姓名',
						type: 'info',
					});
				}else if(!(this.phoneNumber==this.param.phoneNum)){
					this.$refs.uToast.show({
						title: '请填写正确的手机号',
						type: 'info',
					});
				}else if(this.captchaNumber!=this.verifiCode||this.captchaNumber.trim().length !=6){
					this.$refs.uToast.show({
						title: '输入验证码错误',
						type: 'info',
					});
				}else if((new Date().getTime())-this.expireDate>180000){
					this.$refs.uToast.show({
						title: '验证码已过期,重新获取',
						type: 'info',
					});
				}
				else{
					this.$http.post('/saveCodeBindUser',{
						type:this.type,
						userName:this.idCardNumber,
						phoneNum:this.phoneNumber.toString(),
						openId:this.openId
					}).then(res=>{
						console.log(res);
						if(res.code==200&&res.status==1){
							if(res.data.success){
								this.$queue.setData('userId',res.data.data.teacher.userId);
								this.$queue.setData('type',res.data.type);
								this.wxUserList.forEach((item,index)=>{
									if(item.codedesc=="教师"){
										this.typeObj.teacherType=item.code;
									}
								});
								// 存到缓存里面去
								uni.setStorageSync("typeObj",JSON.stringify(this.typeObj));
								
								uni.removeStorageSync("student");
								
								this.$refs.uToast.show({
									title: "绑定成功",
									type: 'success',
									url:"/pages/homePage/index/index",
									isTab:true
								});
							}else{
								this.$refs.uToast.show({
									title: res.data.msg,
									type: 'error',
								});
							}
						}else{
							this.$refs.uToast.show({
								title: res.msg,
								type: 'error',
							});
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.tearcher{
		height: 120rpx;
		@include flex($hov:center);
		font-size: 36rpx;
		color: #202020;
		letter-spacing: 4rpx;
	}
	.bind{
		padding: 79rpx 56rpx 0 59rpx;
		.bind-item{
			font-size: 30rpx;
			margin-top: 20rpx;
			@include flex();
			height: 100rpx;
			border-bottom: 2rpx solid #f1f2f1;
			font-family: 'PingFang SC Light';
			input{
				color: #333333;
				flex: 1;
				height: 60rpx;
				line-height: 60rpx;
				border: 0;
			}
			.place{
				color: #bfbfbf;
			}
			button{
				height: 60rpx;
				width: 200rpx;
				line-height: 60rpx;
				font-size:30rpx;
				color: #7b7b7b ;
				background-color:#FFFFFF ;
				border-radius: 10rpx;
				margin: 0;
				padding: 0 5rpx;
				&.captchas{
					color: #FFFFFF;
					background-color: #3a91ff;
				}
			}
			.item-school{
				height: 60rpx;
				width: 520rpx;
				line-height: 60rpx;
				color: #bfbfbf;
				letter-spacing: 4rpx;
			}
			.classTrue{
				color: #333333;
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
		.account{
			font-size: 22rpx;
			font-family: 'SourceHanSansCN Light';
			color: #007AFF;
			letter-spacing: 3rpx;
			@include flex($hov:center);
			height: 70rpx;
		}
	}
</style>