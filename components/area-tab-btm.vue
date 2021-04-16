<template>
	<view>
		<view class="common-btm" >
			<block v-for="(item,index) in tabList" :key="index">
				<view class="btm-item" 
				v-if="item.id != 2" 
				@click="tabClick(index)">
					<u-image
					width="42rpx"
					height="42rpx"
					:src="tabSelectIdx == index?item.imgSelects:item.imgSelect"
					mode="aspectFill">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<view class="item-name" 
					:class="tabSelectIdx == index?'select-name':''">
						{{item.name}}
					</view>
				</view>
				<view class="btm-items" 
				@click="$emit('addMap')" 
				v-else>
					<u-image
					width="158rpx"
					height="146rpx"
					:src="item.imgSelect"
					mode="aspectFill">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name:"area-tab-btm",
		props:{
			isTraje:{
				type:Boolean,
				default: false
			}
		},
		data() {
			return {
				tabSelectIdx: 0,
				tabList:[
					{
						id:1,
						name:"首页",
						select:true,
						imgSelects:"/static/img/parent/security-area-idxs.png",
						imgSelect:"/static/img/parent/security-area-idx.png"
					},
					{
						id:2,
						imgSelect:"/static/img/parent/add-bg.png",
					},
					{
						id:3,
						name:"地图",
						select:false,
						imgSelects:"/static/img/parent/security-area-maps.png",
						imgSelect:"/static/img/parent/security-area-map.png"
					}
				]
			};
		},
		mounted() {
			if(this.isTraje){
				const data = [
					{
						id:1,
						name:"首页",
						select:true,
						imgSelects:"/static/img/parent/security-area-idxs.png",
						imgSelect:"/static/img/parent/security-area-idx.png"
					},
					{
						id:2,
						imgSelect:"/static/img/parent/traje-animation.png",
					},
					{
						id:3,
						name:"足迹",
						select:false,
						imgSelects:"/static/img/parent/trajectory-icons.png",
						imgSelect:"/static/img/parent/trajectory-icon.png"
					}
				];
				this.tabList = data; 
			}
		},
		methods:{
			tabClick(idx){
				this.tabSelectIdx = idx;
				if(idx == 0){
					this.$emit("disList");
				}else{
					this.$emit("disMap");
				}
			}
		}
	}
</script>

<style lang="scss">
.common-btm{
	width: 100vw;
	height: 102rpx;
	z-index: 999;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #FFFFFF;
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.10); 
	@include flex();
	padding: 0 100rpx;
	.btm-item{
		@include flex($hov:center);
		flex-direction: column;
		.item-name{
			font-size: $fontSize03;
			font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
			font-weight: 400;
			text-align: left;
			color: #333333;
			margin-top: 6rpx;
			&.select-name{
				color: #48bbfd;
			}
		}
	}
	.btm-items{
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
}
</style>
