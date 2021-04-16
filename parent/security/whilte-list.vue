<template>
	<view>
		<kiss-main v-if="!whetherAddEdit"
		 moreData="16"
		 :whilteList="whilteList"
		 :whetherEdit="whetherEdit"
		 @editorDate="editorDate"
		 @deleteDate="deleteDate"
		 @saveDate="saveDate"
		 @addDate="addDate"
		 @dateilDate="dateilDate"/>
		 
		<!-- 添加编辑 -->
		<kiss-handle v-else 
		:disabled="handleDisable"
		:datas="handleDate"
		:types="handleType"
		:editIdx="handleDitIdx"
		@handleSave="handleSave"
		@handleCancel="handleCancel"/>
	</view>
</template>

<script>
	import {
	getOperatorId,
	getCardParam,
	getWhiltList,
	isWhetherRepeat,
	setFanceHandle
	} from "@/common/httpApi/cardHttpApi.js"
	import kissHandle from "@/components/kiss-handle.vue"
	import kissMain from "@/components/kiss-main.vue"
	export default {
		components:{kissHandle,kissMain},
		data() {
			return {
				// 需要存的数据
				operatorId:null,
				imei:null,
				status:null,
				simId:null,
				// 页面需要的数据
				whilteList:[],
				whetherEdit:false,
				whetherAddEdit:false,
				// 添加查看修改需要的数据
				handleDisable:false,
				handleDate:{},
				handleType:1,
				handleDitIdx:'',
				// 后端需要的数据
				changeEdiList:[],
				// 判重需要的数据
				kissNumList:[],
				// 删除的数据
				removeList:[]
			};
		},
		onLoad(options) {
			this.getInitDate(options);
		},
		methods:{
			// 获取初始化数据
			async getInitDate(option){
				// 存一下数据
				this.operatorId = getOperatorId();
				this.imei = option.imei;
				const {status} = await getCardParam(option.imei);
				this.status = status;
				this.simId = uni.getStorageSync("cardDate") && uni.getStorageSync("cardDate").simNumber || null;
				let data = {
					imei: option.imei,
					range:"0"
				};
				this.whilteList = await this.getKissNumber(data);
				data.range = '1';
				this.kissNumList = await this.getKissNumber(data);
			},
			// 获取判重的数据
			async getKissNumber(data){
				const cardDate = await getWhiltList(data);
				if(cardDate){
					const dateList = [];
					cardDate.forEach(item => {
						dateList.push({
							imei:this.imei,
							operatorId:this.operatorId,
							id: item.id,
							faceUrl: item.faceUrl?item.faceUrl:'',
							name: item.name,
							phone: item.simId,
							range:"0",
							index: item.number,
							remove:"0"
						})
					})
					return dateList;
				};
			},
			// 滑动修改数据操作
			editorDate({val,idx}){
				this.handleDate = val;
				this.handleDitIdx = idx;
				this.handleDisable = false;
				this.whetherAddEdit = true;
				this.handleType = 3;
			},
			deleteDate({idx}){
				uni.showModal({
					title:"删除操作",
					content:"确定删除该白名单吗?",
					success:(res)=>{
						if(res.confirm){
							// 保存一下数据
							this.whilteList[idx].remove = '1';
							this.removeList.push(this.whilteList[idx]);
							this.whilteList.splice(idx,1);
							this.whetherEdit = true;
						}
					}
				})
			},
			// 查看数据
			dateilDate({val}){
				this.handleType = 1;
				this.handleDate = val;
				this.handleDisable = true;
				this.whetherAddEdit = true;
			},
			// 子组件取消操作
			handleCancel(){
				this.whetherAddEdit = false;
			},
			// 子组件保存数据
			handleSave({val,idx}){
				if(!val.name){
					this.$Q.tipUrl({tip:"请输入姓名"});
				}else if(val.name.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g)){
					this.$Q.tipUrl({tip:"不能输入表情"});
				}else if(!((/^1[3-9]{1}[0-9]{9}$/).test(val.phone))){
					this.$Q.tipUrl({tip:"请输入正确的手机号"});
				}else if(val.phone == this.simId){
					this.$Q.tipUrl({tip:"不能与学生证号码重复"});
				}else{
					// 还需要去比对是否与现有的白名单情亲号码是否重复问题
					if(isWhetherRepeat(this.kissNumList,val.name,val.phone,-1,this.whilteList,idx)) return;
					
					// 保存一下数据
					const dateList = this.whilteList;
					// 如果是修改
					if(this.handleType == 3){
						dateList[idx] = val;
					}else{
						dateList.push(val);
					}
					this.changeEdiList.push(val)
					this.whetherEdit = true;
					this.whetherAddEdit = false;
				}
			},
			// 添加数据
			addDate(){
				if(this.whilteList.length >= 16){
					this.$Q.tipUrl({tip:"白名单只能十六个"});
					return;
				}
				this.handleType = 2;
				this.handleDate = {
					imei:this.imei,
					operatorId:this.operatorId,
					faceUrl: '',
					name: '',
					phone: '',
					range:"0",
					index: 1,
					remove:"0"
				};
				this.whetherAddEdit = true;
			},
			// 保存数据更改
			async saveDate(){
				const requestBody = this.whilteList.concat(this.removeList)
				// 把数据给后端保存
				console.log(requestBody);
				const data = {
					requestBody:requestBody
				};
				const cardDate = await setFanceHandle(this.status,data);
				if(cardDate){
					this.$Q.tipUrl({tip:cardDate});
					this.whetherEdit = false;
				}
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
</style>