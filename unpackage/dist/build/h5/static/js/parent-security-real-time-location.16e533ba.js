(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["parent-security-real-time-location"],{"1b2c":function(t,e,i){var n=i("dc0f");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=i("4f06").default;a("ecb78640",n,!0,{sourceMap:!1,shadowMode:!1})},"3b4b":function(t,e,i){"use strict";var n=i("4ea4");i("4de4"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("96cf");var a=n(i("1da1")),r=i("9ff2"),o={data:function(){return{imei:null,status:null,operatorId:null,disturbList:null,isLocationTime:!1,isOpen:!0,cardParam:null,amapCenter:[116.4,39.9],zooms:[3,19],plugins:["Scale","MapType","ToolBar","Autocomplete"],amapMarker:null,amapWindow:null,throttlingTime:null,baseParam:null,btmList:[{name:"刷 新",img:"/static/img/parent/location-refresh.png",isDis:!0},{name:"导 航",img:"/static/img/parent/location-navgati.png",isDis:!0},{name:"实时定位-关",img:"/static/img/parent/location-swicth.png",isDis:!0},{name:"实时定位-开",img:"/static/img/parent/location-swicths.png",isDis:!1}],closeTimerMode:null,staCirList:[],staPolList:[],danCirList:[],danPolList:[]}},onLoad:function(t){this.getInitDate(t)},onShow:function(){var t=this;return(0,a.default)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.setTimerMode(!0),!t.imei){e.next=5;break}return e.next=4,(0,r.baseCardParam)(t.imei);case 4:t.baseParam=e.sent;case 5:case"end":return e.stop()}}),e)})))()},onHide:function(){this.setTimerMode()},onUnload:function(){this.setTimerMode()},methods:{getInitDate:function(t){var e=this;return(0,a.default)(regeneratorRuntime.mark((function i(){var n,a,o;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.prev=0,e.operatorId=(0,r.getOperatorId)(),e.imei=t.imei,i.next=5,(0,r.getCardParam)(t.imei);case 5:return n=i.sent,a=n.status,o=n.cardParam,e.status=a,e.cardParam=o,o.longitude&&o.latitude?e.amapCenter=[o.longitude,o.latitude]:e.$wx.ready((function(){e.$wx.getLocation({type:"gcj02",success:function(t){e.amapCenter=[t.longitude,t.latitude]}})})),i.next=13,(0,r.baseCardParam)(t.imei);case 13:return e.baseParam=i.sent,i.next=16,(0,r.getDisturbList)(t.imei,!1);case 16:e.disturbList=i.sent,e.isModeOne(e.baseParam.mode),e.$nextTick((function(){e.displayWin(),e.getOpenArea(t.imei)})),i.next=24;break;case 21:i.prev=21,i.t0=i["catch"](0),console.log("实时定位异常"+i.t0);case 24:case"end":return i.stop()}}),i,null,[[0,21]])})))()},isModeOne:function(t){if(1==t)return this.btmList[2].isDis=!1,void(this.btmList[3].isDis=!0);this.btmList[2].isDis=!0,this.btmList[3].isDis=!1},btmNavgaTo:function(t){switch(t){case 0:this.getRefresh();break;case 1:this.getNavgati();break;case 2:this.isLocationTime=!0,this.isOpen=!0;break;case 3:this.isLocationTime=!0,this.isOpen=!1;break}},getRefresh:function(){if(this.throttlingTime){var t=(new Date).getTime()-this.throttlingTime;t>5e3&&(this.getTimeLocation(),this.throttlingTime=(new Date).getTime())}else this.getTimeLocation(),this.throttlingTime=(new Date).getTime()},getNavgati:function(){var t=this;this.cardParam.address?this.$wx.ready((function(){t.$wx.openLocation({latitude:t.cardParam.latitude,longitude:t.cardParam.longitude,name:t.cardParam.address,address:t.cardParam.address,fail:function(){t.$Q.tipUrl({tip:"导航失败,重新进入"})}})})):this.$Q.tipUrl({tip:"没有获取到地址信息"})},getOpenTime:function(){var t=this;return(0,a.default)(regeneratorRuntime.mark((function e(){var i,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,(0,r.judgeMode)(t.baseParam,t.disturbList);case 2:if(e.sent){e.next=4;break}return e.abrupt("return");case 4:return i={imei:t.imei,mode:"1",operatorId:t.operatorId},e.next=7,(0,r.setModeDate)(t.status,i);case 7:n=e.sent,n&&(t.isModeOne(1),t.$Q.tipUrl({tip:"打开成功"}),t.isLocationTime=!1);case 9:case"end":return e.stop()}}),e)})))()},getCloseTime:function(){var t=this;return(0,a.default)(regeneratorRuntime.mark((function e(){var i,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return i={imei:t.imei,mode:"3",operatorId:t.operatorId},e.next=3,(0,r.setModeDate)(t.status,i);case 3:n=e.sent,n&&(t.isModeOne(3),t.$Q.tipUrl({tip:"关闭成功"}),t.isLocationTime=!1,clearInterval(t.closeTimerMode),t.closeTimerMode=null);case 5:case"end":return e.stop()}}),e)})))()},getTimeLocation:function(){var t=this;return(0,a.default)(regeneratorRuntime.mark((function e(){var i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,(0,r.getTimeLocation)(t.status,t.imei);case 2:i=e.sent,i&&(t.amapCenter=i.amapCenter,t.cardParam.address=i.addressDate,t.cardParam.locationDate=i.locationDate);case 4:case"end":return e.stop()}}),e)})))()},displayWin:function(){var t=this,e={position:this.amapCenter,events:{click:function(){t.amapWindow.visible=!t.amapWindow.visible}}},i={position:this.amapCenter,offset:[5,-30],visible:!0,events:{}};this.amapWindow=i,this.amapMarker=e},setTimerMode:function(t){var e=this;this.closeTimerMode&&(this.closeTimerMode=null),this.closeTimerMode=setTimeout((function(){if(console.log("执行了5分钟自动扫描"),!t&&1==e.baseParam.mode){var i={imei:e.imei,mode:"3",operatorId:e.operatorId};(0,r.setModeDate)(e.status,i,!1)}}),3e5)},getOpenArea:function(t){var e=this;return(0,a.default)(regeneratorRuntime.mark((function i(){var n,a,o,s;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.next=2,(0,r.getSecurityDate)(t);case 2:return n=i.sent,i.next=5,(0,r.getSecurityDate)(t,1);case 5:a=i.sent,o=(0,r.cardAreaPart)(n),s=(0,r.cardAreaPart)(a),e.staCirList=o.circlesList.filter((function(t){return 1==t.switchFlag})),e.staPolList=o.polygonsList.filter((function(t){return 1==t.switchFlag})),e.danCirList=s.circlesList.filter((function(t){return 1==t.switchFlag})),e.danPolList=s.polygonsList.filter((function(t){return 1==t.switchFlag}));case 12:case"end":return i.stop()}}),i)})))()}},filters:{getDate:function(t){return t||"暂无"}}};e.default=o},"48ff":function(t,e,i){"use strict";i.r(e);var n=i("3b4b"),a=i.n(n);for(var r in n)"default"!==r&&function(t){i.d(e,t,(function(){return n[t]}))}(r);e["default"]=a.a},6175:function(t,e,i){"use strict";i.r(e);var n=i("c31d"),a=i("48ff");for(var r in a)"default"!==r&&function(t){i.d(e,t,(function(){return a[t]}))}(r);i("b251");var o,s=i("f0c5"),c=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,"03f98170",null,!1,n["a"],o);e["default"]=c.exports},b251:function(t,e,i){"use strict";var n=i("1b2c"),a=i.n(n);a.a},c31d:function(t,e,i){"use strict";i.d(e,"b",(function(){return a})),i.d(e,"c",(function(){return r})),i.d(e,"a",(function(){return n}));var n={uImage:i("c650").default,uLoading:i("79de").default},a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("v-uni-view",{staticClass:"container"},[i("v-uni-view",{staticClass:"container-amap"},[i("el-amap",{ref:"amap",attrs:{vid:"amap",center:t.amapCenter,zooms:t.zooms,zoom:"17",plugin:t.plugins}},[t.amapMarker?i("el-amap-marker",{attrs:{position:t.amapMarker.position,events:t.amapMarker.events}},[i("v-uni-image",{staticStyle:{width:"42rpx",height:"60rpx"},attrs:{src:"/static/img/parent/location-icon.png",mode:"aspectFill"}})],1):t._e(),t.amapWindow?i("el-amap-info-window",{attrs:{position:t.amapWindow.position,visible:t.amapWindow.visible,offset:t.amapWindow.offset,events:t.amapWindow.events}},[t._v("电子学生证-精准定位"),i("br"),t._v("姓名:  "+t._s(t._f("getDate")(t.cardParam.studentName))),i("br"),t._v("电量: "+t._s(t.cardParam.soc)+"%"),i("br"),t._v("状态: "+t._s(t._f("getDate")(t.cardParam.status))),i("br"),t._v("更新时间: "+t._s(t._f("getDate")(t.cardParam.locationDate))),i("br"),t._v("所在位置: "+t._s(t._f("getDate")(t.cardParam.address))),i("br")]):t._e(),t._l(t.staCirList,(function(t,e){return i("el-amap-circle",{key:e,attrs:{center:t.center,radius:t.radius,"fill-opacity":"0.2",fillColor:"#1EE143",strokeOpacity:"0.3",strokeWeight:"3",strokeColor:"#1EE143"}})})),t._l(t.staPolList,(function(t,e){return i("el-amap-polygon",{key:e,attrs:{path:t.path,fillColor:"#1EE143",fillOpacity:"0.2",strokeWeight:"3",strokeColor:"#1EE143",strokeOpacity:"0.35"}})})),t._l(t.danCirList,(function(t,e){return i("el-amap-circle",{key:e+10,attrs:{center:t.center,radius:t.radius,"fill-opacity":"0.2",fillColor:"#ff0000",strokeOpacity:"0.3",strokeWeight:"3",strokeColor:"#ff0000"}})})),t._l(t.danPolList,(function(t,e){return i("el-amap-polygon",{key:e+10,attrs:{path:t.path,fillColor:"#ff0000",fillOpacity:"0.2",strokeWeight:"3",strokeColor:"#ff0000",strokeOpacity:"0.35"}})}))],2)],1),i("v-uni-view",{staticClass:"container-btm"},[t._l(t.btmList,(function(e,n){return[i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.isDis,expression:"item.isDis"}],key:n+"_0",staticClass:"btm-item",class:2==n||3==n?"btm-items":"",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.btmNavgaTo(n)}}},[i("u-image",{attrs:{width:"80rpx",height:"80rpx",src:e.img}},[i("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1),i("v-uni-view",{staticClass:"item-name"},[t._v(t._s(e.name))])],1)]}))],2),i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.isLocationTime,expression:"isLocationTime"}],staticClass:"container-open"},[i("v-uni-view",{staticClass:"open"},[i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],staticClass:"open-box"},[i("v-uni-view",{staticClass:"box-content"},[i("u-image",{attrs:{width:"158rpx",height:"164rpx",src:"/static/img/parent/location-icon1.png"}},[i("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1),i("v-uni-view",{staticClass:"content-title"},[t._v("开启实时定位")]),i("v-uni-view",{staticClass:"content-dateil"},[t._v("开启实时定位位置更精准但耗电高")])],1),i("v-uni-view",{staticClass:"box-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.getOpenTime.apply(void 0,arguments)}}},[t._v("确 定")])],1),i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:!t.isOpen,expression:"!isOpen"}],staticClass:"open-box"},[i("v-uni-view",{staticClass:"box-content"},[i("u-image",{attrs:{width:"96rpx",height:"160rpx",src:"/static/img/parent/location-icon2.png"}},[i("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1),i("v-uni-view",{staticClass:"content-title"},[t._v("关闭实时定位")]),i("v-uni-view",{staticClass:"content-dateil"},[t._v("关闭实时定位，学生证将耗电低")])],1),i("v-uni-view",{staticClass:"box-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.getCloseTime.apply(void 0,arguments)}}},[t._v("确 定")])],1),i("v-uni-view",{staticClass:"open-colse",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.isLocationTime=!1}}},[i("u-image",{attrs:{width:"80rpx",height:"80rpx",src:"/static/img/parent/location-close.png"}},[i("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1)],1)],1)],1)],1)],1)},r=[]},dc0f:function(t,e,i){var n=i("24fb");e=n(!1),e.push([t.i,".container[data-v-03f98170]{width:100%}.container .container-amap[data-v-03f98170]{width:100vw;height:88vh}.container .container-btm[data-v-03f98170]{z-index:99;width:100%;position:fixed;bottom:0;left:0;height:13vh;background-color:#fff;-webkit-border-top-left-radius:%?24?%;border-top-left-radius:%?24?%;-webkit-border-top-right-radius:%?24?%;border-top-right-radius:%?24?%;-webkit-box-shadow:2px 2px 10px 0 rgba(0,0,0,.1);box-shadow:2px 2px 10px 0 rgba(0,0,0,.1);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;padding:0 %?40?%}.container .container-btm .btm-item[data-v-03f98170]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column}.container .container-btm .btm-item .item-name[data-v-03f98170]{font-size:%?28?%;font-family:Source Han Sans CN Regular,Source Han Sans CN Regular-Regular;font-weight:400;text-align:left;color:#333;margin-top:%?13?%}.container .container-btm .btm-item.btm-items[data-v-03f98170]{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.container .container-open[data-v-03f98170]{z-index:999;position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.6)}.container .container-open .open[data-v-03f98170]{position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column}.container .container-open .open .open-box[data-v-03f98170]{width:%?568?%;height:%?628?%;background:#fff;-webkit-border-radius:%?24?%;border-radius:%?24?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column}.container .container-open .open .open-box .box-content[data-v-03f98170]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;padding-top:%?54?%;font-family:Source Han Sans CN Regular,Source Han Sans CN Regular-Regular}.container .container-open .open .open-box .box-content .content-title[data-v-03f98170]{margin-top:%?60?%;margin-bottom:%?40?%;font-size:%?38?%;font-weight:500;color:#333}.container .container-open .open .open-box .box-content .content-dateil[data-v-03f98170]{font-size:%?32?%;font-weight:400;color:#999}.container .container-open .open .open-box .box-btn[data-v-03f98170]{font-size:%?36?%;font-family:Adobe Heiti Std R,Adobe Heiti Std R-R;text-align:center;color:#fff;background:#ff8a00;width:%?499?%;height:%?88?%;-webkit-border-radius:%?44?%;border-radius:%?44?%;margin-top:%?80?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.container .container-open .open .open-colse[data-v-03f98170]{margin-top:%?80?%}",""]),t.exports=e}}]);