<template>
	<view>
		<view class="kiss-main">
			<view class="main-avter" :style="moreData == 4?'background: linear-gradient(0deg,#f56580 0%, #fd6e82 100%);':'background: linear-gradient(0deg,#3cb2ef 0%, #3cb2ef 100%);'">
				<view class="avter-img">
					<image :src="student && student.iconLink ||'/static/img/home/avter.png'" mode="aspectFill" />
				</view>
				<view class="avter-student">
					<view class="student-name">
						{{student && student.studentName || '未获取'}}
					</view>
					<view class="student-classes">
						{{student && student.classes && student.classes.schoolName || '未获取'}}
						&nbsp;&nbsp;
						{{student && student.classes && student.classes.classesName || ''}}
					</view>
				</view>
			</view>
			<!-- 有亲情号码列表 -->
			<view class="main-whilte" v-if="whilteList.length">
				<uni-swipe-action>
					<block v-for="(item,index) in whilteList" :key="index">
						<uni-swipe-action-item @change="swiperChange($event,index)">
							<view class="whilte-item" v-if="item.remove == 0">
								<view class="item-img">
									<image :src="item.faceUrl?item.faceUrl:'/static/img/home/avter.png'" mode="aspectFill" />
								</view>
								<view class="item-dateil" @click="dateilDate(item)">
									<view class="dateil-name">{{item.name}}</view>
									<view class="dateil-number">
										<text class="number-phone">{{item.phone}}</text>
										<text class="number-key" v-if="moreData == 4">{{item.index}}键</text>
									</view>
								</view>
								<view class="item-place" 
								v-show="!item.select && moreData==4" 
								@click="interchangeDate(index)">
									<image src="/static/img/parent/kiss-place.png" mode="aspectFill"/>
								</view>
							</view>
							<template v-slot:right>
								<view class="right-box">
									<view class="box" @click="editorDate(item,index)">
										<view class="box-editor">
											<image src="/static/img/parent/editor-bg.png" mode="aspectFill" />
										</view>
									</view>
									<view class="box" @click="deleteDate(index)">
										<view class="box-editor">
											<image src="/static/img/parent/delete-bg.png" mode="aspectFill" />
										</view>
									</view>
								</view>
							</template>
						</uni-swipe-action-item>
					</block>
				</uni-swipe-action>
			</view>
			<!-- 没有数据 -->
			<common-empty :noData="!whilteList.length" />
			<!-- 只要触发了修改数据 就需要显示保存数据 -->
			<view class="main-save" v-show="whetherEdit">
				<view class="save-title" @click="saveDate">保存数据</view>
			</view>
			<!-- 添加 -->
			<view class="main-add" v-show="!(whilteList.length >= moreData)">
				<view class="add-img" @click="addDate">
					<image src="/static/img/parent/add-bg.png" mode="aspectFill" />
				</view>
			</view>
			<!-- 占位符 -->
			<view style="height: 200rpx;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"kiss-main",
		props:{
			whilteList:{
				type: Array,
				default:()=>{
					return []
				}
			},
			whetherEdit:{
				type:Boolean,
				default:false
			},
			moreData:{
				type:[Number,String],
				default:''
			}
		},
		data() {
			return {
				student:null
			};
		},
		mounted() {
			this.student = uni.getStorageSync("student");
		},
		methods:{
			// 滑动切换
			swiperChange(val,idx){
				this.$emit("swiperChange",{val,idx})
			},
			// 交互位置
			interchangeDate(idx){
				this.$emit("interchangeDate",{idx})
			},
			// 滑动修改
			editorDate(val,idx){
				this.$emit("editorDate",{val,idx})
			},
			// 滑动删除
			deleteDate(idx){
				this.$emit("deleteDate",{idx});
			},
			// 保存数据
			saveDate(){
				this.$emit("saveDate");
			},
			// 添加数据
			addDate(){
				this.$emit("addDate");
			},
			// 查看数据
			dateilDate(val){
				this.$emit("dateilDate",{val});
			}
		}
	}
</script>

<style lang="scss">
.kiss-main{
	width: 100%;
	.main-avter{
		height: 180rpx;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		.avter-img{
			width: 120rpx;
			height: 120rpx;
			border-radius: 12rpx;
			overflow: hidden;
		}
		.avter-student{
			flex: 1;
			margin-left: 30rpx;
			letter-spacing: 2rpx;
			.student-name{
				font-size: $fontSize01;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: 400;
				color: #ffffff;
			}
			.student-classes{
				font-size: 26rpx;
				font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
				font-weight: 400;
				color: #ffffff;
				margin-top: 10rpx;
			}
		}
	}
	.main-whilte{
		display: flex;
		flex-direction: column;
		width: 100%;
		.whilte-item{
			background-color: #FFFFFF;
			height: 120rpx;
			width: 100%;
			padding: 0 30rpx;
			@include flex();
			border-bottom: 2rpx solid #f5f5f5;
			.item-img{
				width: 78rpx;
				height: 78rpx;
				overflow: hidden;
				border-radius: 50%;
			}
			.item-dateil{
				flex: 1;
				margin-left: 20rpx;
				.dateil-name{
					font-size: 30rpx;
					font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
					color: #222222;
				}
				.dateil-number{
					margin-top: 10rpx;
					font-size: $fontSize04;
					font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
					.number-phone{
						color: #898989;
					}
					.number-key{
						margin-left: 10rpx;
						color: #fa6b82;
					}
				}
			}
			.item-place{
				width: 46rpx;
				height: 46rpx;
			}
		}
	}
	.main-nodata{
		margin-top: 102rpx;
		@include flex($hov:center);
		flex-direction: column;
		width: 100%;
		.nodata-img{
			width: 360rpx;
			height: 310rpx;
		}
		.nodata-title{
			margin-top: 46rpx;
			font-size: $fontSize03;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
			font-weight: 400;
			color: #999999;
		}
	}
	.main-save{
		width: 100%;
		@include flex($hov:center);
		position: fixed;
		bottom: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		.save-title{
			width: 200rpx;
			height: 200rpx;
			border-radius: 50%;
			background-color: #ffffff;
			box-shadow: 13rpx 13rpx 10rpx 11rpx rgba(224,221,220,0.15); 
			@include flex($hov:center);
			$fontSize04: 24px;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
			color: #37c1f2;
		}
		
	}
	.main-add{
		width: 100%;
		height: 90rpx;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		box-shadow: 0 0 8rpx 0rpx #dddbdb; 
		.add-img{
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 158rpx;
			height: 158rpx;
		}
	}
	.right-box{
		height: 100%;
		width: 260rpx;
		@include flex($hov:space-around);
		.box{
			flex:1;
			height: 100%;
			@include flex($hov:center);
			.box-editor{
				width: 100rpx;
				height: 100rpx;
			}
		}
		
	}
}
</style>
