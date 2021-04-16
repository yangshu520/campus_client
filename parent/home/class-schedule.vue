<template>
	<view>
		<view class="container" @click="priviewImg(scheduleImg)" v-show="scheduleImg">
			<u-image :src="scheduleImg" mode="widthFix" width= "100vw">
				<u-loading slot="loading"></u-loading>
			</u-image>
		</view>
		<!-- 没有数据 -->
		<common-empty :noData="!scheduleImg" />
	</view>
</template>

<script>
	import {GET_SYSLLABUS_BY_PARENT} from "@/common/js/apiUrl.js"
	export default {
		data() {
			return {
				scheduleImg:null,
			};
		},
		onLoad() {
			this.getInitDate();
		},
		methods:{
			async getInitDate(){
				try{
					const student=uni.getStorageSync("student");
					if(student && student.id){
						const resDate=await this.$http.post(GET_SYSLLABUS_BY_PARENT,{
							studentId:student.id
						}); 
						if(resDate.syllabusMapperImgUrl){
							this.scheduleImg = resDate.syllabusMapperImgUrl;
							// this.priviewImg(this.scheduleImg )
						}
					}else{
						this.$Q.tipUrl({
							tip:"获取学生数据异常,联系客服"
						})
					}
				}catch(e){
					//TODO handle the exception
					console.log("课程表异常"+e)
				}
			},
			priviewImg(data){
				uni.previewImage({
					current:1,
					urls:[data]
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
	width: 100vw;
}
</style>
