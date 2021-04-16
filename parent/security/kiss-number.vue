<template>
	<view>
		<kiss-main v-if="!whetherAddEdit"
		 moreData="4"
		 :whilteList="kissNumList"
		 :whetherEdit="whetherEdit"
		 @swiperChange="swiperChange"
		 @interchangeDate="interchangeDate"
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
				kissNumList:[],
				whetherEdit:false,
				whetherAddEdit:false,
				// 添加查看修改需要的数据
				handleDisable:false,
				handleDate:{},
				handleType:1,
				handleDitIdx:'',
				// 判重的数据
				whilteList:[],
				// 删除的数据集合
				removeList:[],
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
					range:"1"
				};
				this.kissNumList = await this.getKissNumber(data);
				data.range = '0';
				this.whilteList = await this.getKissNumber(data);
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
							range:"1",
							index: item.number,
							remove:"0",
							select: false
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
					content:"确定删除该亲情号码吗?",
					success:(res)=>{
						if(res.confirm){
							this.kissNumList[idx].remove = '1';
							this.removeList.push(this.kissNumList[idx]);
							this.kissNumList.splice(idx,1);
							this.changeNumber(this.kissNumList);
							this.whetherEdit = true;
							this.$Q.tipUrl({tip:"删除成功,保存数据才能生效"});
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
					if(isWhetherRepeat(this.kissNumList,val.name,val.phone,idx,this.whilteList,-1)) return;
					
					// 保存一下数据
					const dateList = this.kissNumList;
					// 如果是修改
					if(this.handleType == 3){
						dateList[idx] = val;
						this.changeNumber(dateList);
					}else{
						dateList.push(val);
						this.changeNumber(dateList);
					}
					this.whetherEdit = true;
					this.whetherAddEdit = false;
				}
			},
			// 添加数据
			addDate(){
				if(this.kissNumList.length >= 4){
					this.$Q.tipUrl({tip:"情亲号码只能四个"});
					return;
				}
				this.handleType = 2;
				this.handleDate = {
					imei:this.imei,
					operatorId:this.operatorId,
					faceUrl: '',
					name: '',
					phone: '',
					range:"1",
					index: 1,
					remove:"0",
					select:false
				};
				this.whetherAddEdit = true;
			},
			// 滑动改变方法
			swiperChange({val,idx}){
				if(val == 'right'){
					this.kissNumList.map((item,index)=>{
						if(index == idx){
							item.select = true;
						}else{
							item.select = false;
						}
					});
				}else if(val == 'none'){
					this.kissNumList.map((item,index)=>{
						if(index == idx){
							item.select = false;
						}
					})
				}
			},
			// 交换位置
			interchangeDate({idx}){
				const dateList = this.kissNumList;
				const length = this.kissNumList.length - 1;
				let temp;
				let ids;
				if(idx == 0){
					ids = length;
				}else{
					ids = idx -1;
				}
				temp = dateList[idx];
				dateList[idx] = dateList[ids];
				dateList[ids] = temp;
				this.changeNumber(dateList);
				this.whetherEdit = true;
			},
			// 每次改变都需要调用
			changeNumber(dateList){
				dateList.map((item,index)=>{
					item.index = index + 1
				});
				this.kissNumList = dateList;
			},
			// 保存数据更改
			async saveDate(){
				const requestBody = this.kissNumList.concat(this.removeList)
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
