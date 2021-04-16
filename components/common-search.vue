<template>
	<view>
		<view class="container-search" 
		:style="'padding-bottom:'+boxStylePad+'rpx;background-color:'+boxBgc+';'">
			<view class="search-box" 
			:style="'background-color:'+searchBgc+';'">
				<view class="box-title" @click="searchClick">
					<view class="title-img" @confirm="inpBlur(true)">
						<image src="/static/img/parent/search-img.png" mode="aspectFill" />
					</view>
					<input :type="inpType" @confirm="inpBlur(true)" :class="inpShow?'inp':''" :placeholder="placeTitle" v-model.trim="searchText" @blur="inpBlur"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"common-search",
		props:{
			boxStylePad:{
				type:[Number,String],
				default:0
			},
			placeName:{
				type:String,
				default: "请输入关键字查找"
			},
			searchBgc:{
				type:String,
				default:'#efeeee'
			},
			boxBgc:{
				type:String,
				default:'#fff'
			},
			inpType:{
				type:String,
				default: 'text'
			}
		},
		data() {
			return {
				inpShow: false,
				searchText:"",
				placeTitle:"搜索"
			};
		},
		methods:{
			// 失去焦点或者确认
			inpBlur(idx){
				if(!this.searchText){
					this.inpShow = false;
					this.placeTitle = "搜索"
				}
				if(idx){
					uni.hideKeyboard();
				}
				const val = this.searchText;
				this.$emit("comfirm",{val});
			},
			searchClick(){
				this.inpShow = true;
				this.placeTitle = this.placeName;
			}
		}
	}
</script>

<style lang="scss">
.container-search{
	width: 100vw;
	padding-top: 20rpx;
	@include flex($hov:center);
	.search-box{
		@include flex($hov:center);
		width: 680rpx;
		height: 70rpx;
		border-radius: 8rpx;
		.box-title{
			// width: 100%;
			padding: 0 10rpx;
			@include flex($hov:center);
			.title-img{
				width: 30rpx;
				height: 30rpx;
			}
			input{
				width: 80rpx;
				margin-left: 10rpx;
				&.inp{
					flex: 1;
					width: 600rpx;
					height: 100%;
					padding-left: 10rpx;
				}
			}
		}
	}
}
</style>
