(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-index"],{"0c14":function(e,t,n){"use strict";n.r(t);var a=n("fe2b"),r=n.n(a);for(var i in a)"default"!==i&&function(e){n.d(t,e,(function(){return a[e]}))}(i);t["default"]=r.a},"145d":function(e,t,n){"use strict";var a=n("4ea4");n("ac1f"),n("1276"),Object.defineProperty(t,"__esModule",{value:!0}),t.depthClone=t.comUploadImg=t.commonTelPhone=t.deleteOperation=t.getWxJsSdk=void 0,n("96cf");var r=a(n("1da1")),i=a(n("368e")),o=a(n("aba9")),c=n("033a"),u=function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,i.default.post(c.SIGN_INFO,{url:window.location.href.split("#")[0]},{header:{"content-type":"application/x-www-form-urlencoded"},load:!1});case 2:t=e.sent,o.default.config({debug:!1,appId:t.appid,timestamp:t.timestamp,nonceStr:t.nonceStr,signature:t.signature,jsApiList:["getLocation","openLocation","updateTimelineShareData","startRecord"]}),o.default.ready((function(){console.log("注入jssdk成功")})),o.default.error((function(e){console.log("注入jssdk失败"+e),u()}));case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();t.getWxJsSdk=u;var s=function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(t){var n,a,r,i,o,c,u,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.e,a=t.tipTitle,r=t.tipContent,i=t.deleteApi,o=t.data,c=t.redirectUrl,u=t.type,s=t.confirmText,e.prev=1,!n||"删除"!=n.content.text){e.next=6;break}return e.abrupt("return",l(a,r,i,o,s));case 6:if(!n||"修改"!=n.content.text){e.next=10;break}uni.navigateTo({url:c}),e.next=11;break;case 10:return e.abrupt("return",l(a,r,i,o,u,s));case 11:e.next=16;break;case 13:e.prev=13,e.t0=e["catch"](1),console.log(e.t0);case 16:case"end":return e.stop()}}),e,null,[[1,13]])})));return function(t){return e.apply(this,arguments)}}();t.deleteOperation=s;var l=function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(t,n,a,r,o,c){var u,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,uni.showModal({title:t||"删除行为",content:n||"你确定要删除该项吗?",confirmText:c});case 2:if(u=e.sent,!u[1].confirm){e.next=13;break}return e.next=6,i.default.post(a,r);case 6:if(s=e.sent,200!=s.code||1!=s.status){e.next=12;break}return m(o?"设置成功":"删除成功"),e.abrupt("return","ok");case 12:m(s.msg);case 13:case"end":return e.stop()}}),e)})));return function(t,n,a,r,i,o){return e.apply(this,arguments)}}(),d=function(e){e?uni.makePhoneCall({phoneNumber:e}):uni.showToast({title:"没有获取到号码",icon:"none",duration:3e3})};t.commonTelPhone=d;var p=function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(){var t,n,a,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,uni.chooseImage({count:1,sourceType:["album","camera"]});case 2:if(t=e.sent,!t[1].tempFilePaths){e.next=17;break}return uni.showLoading({title:"上传中...",mask:!0}),n=t[1].tempFilePaths[0],e.next=8,uni.uploadFile({url:c.BASE_URL+c.COM_UPLOAD_FILD,filePath:n,name:"file",formData:{userId:uni.getStorageSync("userId")}});case 8:if(a=e.sent,!a[1]){e.next=13;break}return uni.hideLoading(),r=a[1]["data"]&&JSON.parse(a[1]["data"]).data,e.abrupt("return",r);case 13:uni.hideLoading(),m("上传图片失败,重新上传"),e.next=18;break;case 17:m("选择图片失败,请重新选择");case 18:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();t.comUploadImg=p;var f=function(e){var t;if("object"===typeof e)t={};else{if(!Array.isArray(e))return t;t=[]}for(var n in e){var a=e[n];"object"===typeof a||Array.isArray(e)?t[n]=clone(a):t[n]=a}return t};t.depthClone=f;var m=function(e){uni.showToast({duration:3e3,title:e,icon:"none",mask:!0})}},1892:function(e,t,n){"use strict";var a=n("4ea4");n("99af"),n("4de4"),n("4d63"),n("ac1f"),n("25f0"),n("466d"),n("1276"),Object.defineProperty(t,"__esModule",{value:!0}),t.wxAuthorize=t.wxAuOpenId=void 0,n("96cf");var r=a(n("1da1")),i=a(n("368e")),o=n("033a"),c=function(e,t){try{uni.setStorageSync(e,t)}catch(n){console.log(e+"存值失败")}},u=function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(t,n){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.data||!n&&!t.data.snsUserInfo){e.next=45;break}if(t.data.snsUserInfo&&(c("openId",t.data.snsUserInfo.openId||n),c("wxUserInfo",t.data.snsUserInfo)),e.prev=2,1!=t.data.code){e.next=8;break}return c("roleType",-1),e.abrupt("return",-1);case 8:if(0!=t.data.code){e.next=34;break}if(!t.data.data||0!=t.data.data.userType||!t.data.data.user){e.next=16;break}return c("userId",t.data.data.user.id||null),c("roleType",String(t.data.data.userType)),i.default.post(o.GET_STUDEN_INFO,{userId:t.data.data.user.id}).then((function(e){0==e.code&&e.data?c("student",e.data.student):c("student",null)})),e.abrupt("return",t.data.data.userType);case 16:if(!t.data.data||1!=t.data.data.userType||!t.data.data.userId){e.next=23;break}return c("roleType",t.data.data.userType),c("parentId",t.data.data.userId),i.default.post(o.GET_PARENT_STUDENT_LIST,{parentId:t.data.data.userId}).then((function(e){if(0!=e.code||!e.data)return uni.removeStorageSync("student"),uni.removeStorageSync("userId"),c("roleType",-1),-1;var t,n=e.data.filter((function(e){return e&&e.loginFlag}));t=n.length?n[0]:e.data[0],c("userId",t.student&&t.student.userId),c("student",t.student)})),e.abrupt("return",t.data.data.userType);case 23:if(!t.data.data||2!=t.data.data.userType||!t.data.data.user){e.next=30;break}return c("userId",t.data.data.user.id),c("roleType",t.data.data.userType),i.default.post(GET_TEACHER_INFO,{userId:t.data.data.user.id}).then((function(e){e.code})),e.abrupt("return",t.data.data.userType);case 30:return c("roleType",-1),e.abrupt("return",-1);case 32:e.next=36;break;case 34:return c("roleType",-1),e.abrupt("return",-1);case 36:e.next=43;break;case 38:return e.prev=38,e.t0=e["catch"](2),console.log("commonLogin"+e.t0),c("roleType",-1),e.abrupt("return",-1);case 43:e.next=47;break;case 45:l(),console.log("获取openid异常");case 47:case"end":return e.stop()}}),e,null,[[2,38]])})));return function(t,n){return e.apply(this,arguments)}}(),s=function(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),n=window.location.href.split("#")[0],a=n.split("?")[1];if(a){var r=a.substr(0).match(t);return null!==r?unescape(r[2]):null}return null},l=function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(){var t,n,a,r,l,d,p;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=window.location.href,n=s("code"),!n){e.next=20;break}return e.prev=3,e.next=6,i.default.post(o.GET_USER_INFO,{code:n});case 6:return a=e.sent,a&&200==a.code&&1==a.status?r=u(a):(c("roleType",-1),r=-1),l=window.location.protocol+"//"+window.location.host+"/#/",window.history.pushState({},0,l),e.abrupt("return",r);case 13:return e.prev=13,e.t0=e["catch"](3),c("roleType",-1),console.log(e.t0),e.abrupt("return",-1);case 18:e.next=23;break;case 20:d=encodeURIComponent(t),p="https://open.weixin.qq.com/connect/oauth2/authorize?appid=".concat(o.APP_ID,"&redirect_uri=").concat(d,"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"),window.location.href=p;case 23:case"end":return e.stop()}}),e,null,[[3,13]])})));return function(){return e.apply(this,arguments)}}();t.wxAuthorize=l;var d=function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.default.post(o.GET_USER_INFO,{openId:t});case 3:if(n=e.sent,200!=n.code||1!=n.status){e.next=8;break}return e.abrupt("return",u(n,t));case 8:return c("roleType",-1),e.abrupt("return",-1);case 10:e.next=17;break;case 12:return e.prev=12,e.t0=e["catch"](0),console.log("wxAuOpenId"+e.t0),c("roleType",-1),e.abrupt("return",-1);case 17:case"end":return e.stop()}}),e,null,[[0,12]])})));return function(t){return e.apply(this,arguments)}}();t.wxAuOpenId=d},1911:function(e,t,n){"use strict";n.r(t);var a=n("6243"),r=n("1ef0");for(var i in r)"default"!==i&&function(e){n.d(t,e,(function(){return r[e]}))}(i);n("9025");var o,c=n("f0c5"),u=Object(c["a"])(r["default"],a["b"],a["c"],!1,null,"beb331ea",null,!1,a["a"],o);t["default"]=u.exports},"1ef0":function(e,t,n){"use strict";n.r(t);var a=n("d6b9"),r=n.n(a);for(var i in a)"default"!==i&&function(e){n.d(t,e,(function(){return a[e]}))}(i);t["default"]=r.a},3338:function(e,t,n){"use strict";var a=n("5706"),r=n.n(a);r.a},3699:function(e,t,n){var a=n("5506");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("4f06").default;r("51d493e0",a,!0,{sourceMap:!1,shadowMode:!1})},"492f":function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,".content-container[data-v-a7272212]{width:100%}.content-container .container[data-v-a7272212]{width:100%;padding:0 %?30?%;background-color:#fff}.content-container .container .container-title[data-v-a7272212]{height:%?80?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.content-container .container .container-title .title-img[data-v-a7272212]{width:%?10?%;height:%?42?%}.content-container .container .container-title .title-name[data-v-a7272212]{padding-left:%?22?%;line-height:%?42?%;font-size:%?32?%;font-family:Source Han Sans CN Regular,Source Han Sans CN Regular-Regular;font-weight:500;color:#666}.content-container .container .container-box[data-v-a7272212]{margin-top:%?40?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap}.content-container .container .container-box .box-item[data-v-a7272212]{width:25%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;margin-bottom:%?56?%}.content-container .container .container-box .box-item .item-img[data-v-a7272212]{width:%?102?%;height:%?102?%}.content-container .container .container-box .box-item .item-title[data-v-a7272212]{margin-top:%?20?%;font-size:%?24?%;font-family:Source Han Sans CN Normal,Source Han Sans CN Normal-Normal;color:#333}",""]),e.exports=t},5506:function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,"uni-page-body[data-v-beb331ea]{background-color:#ebebeb}body.?%PAGE?%[data-v-beb331ea]{background-color:#ebebeb}",""]),e.exports=t},5706:function(e,t,n){var a=n("492f");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("4f06").default;r("ba11717e",a,!0,{sourceMap:!1,shadowMode:!1})},6243:function(e,t,n){"use strict";var a;n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return a}));var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",{staticClass:"content"},[n("common-avter",{attrs:{avterImg:e.avterImg,avterName:e.avterName,avterClassesName:e.avterClassesName,avterSchoolName:e.avterSchoolName},on:{seeDateil:function(t){arguments[0]=t=e.$handleEvent(t),e.seeDateil.apply(void 0,arguments)},navToBaby:function(t){arguments[0]=t=e.$handleEvent(t),e.navToBaby.apply(void 0,arguments)}}}),n("student-index")],1)},i=[]},9025:function(e,t,n){"use strict";var a=n("3699"),r=n.n(a);r.a},a871:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return a}));var a={uImage:n("c650").default,uLoading:n("79de").default},r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",[n("v-uni-view",{staticClass:"content-container"},e._l(e.stuFunList,(function(t,a){return n("v-uni-view",{key:a,staticClass:"container",style:1==a?"margin-top: 26rpx;":""},[n("v-uni-view",{staticClass:"container-title"},[n("v-uni-view",{staticClass:"title-img"},[n("u-image",{attrs:{mode:"scaleToFill",src:"/static/img/home/indexLeft.png",height:"42rpx",width:"10rpx"}},[n("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1)],1),n("v-uni-view",{staticClass:"title-name"},[e._v(e._s(t.title))])],1),n("v-uni-view",{staticClass:"container-box"},e._l(t.stuPageList,(function(t,a){return n("v-uni-view",{key:a,staticClass:"box-item",on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.funEntrance(t)}}},[n("v-uni-view",{staticClass:"item-img"},[n("v-uni-image",{attrs:{src:t.iconImg}})],1),n("v-uni-view",{staticClass:"item-title"},[e._v(e._s(t.iconTitle))])],1)})),1)],1)})),1)],1)},i=[]},bdff:function(e,t,n){"use strict";n.r(t);var a=n("a871"),r=n("0c14");for(var i in r)"default"!==i&&function(e){n.d(t,e,(function(){return r[e]}))}(i);n("3338");var o,c=n("f0c5"),u=Object(c["a"])(r["default"],a["b"],a["c"],!1,null,"a7272212",null,!1,a["a"],o);t["default"]=u.exports},d6b9:function(e,t,n){"use strict";var a=n("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("96cf");var r=a(n("1da1")),i=a(n("c96f")),o=a(n("bdff")),c=n("1892"),u=n("145d"),s={components:{commonAvter:i.default,studentIndex:o.default},data:function(){return{roleType:void 0,avterImg:"/static/img/home/avter.png",avterName:"Hello unbound",avterSchoolName:"暂未绑定家长账号",avterClassesName:null}},onLoad:function(){this.getInitializationDate(),(0,u.getWxJsSdk)()},onShow:function(){this.roleType=uni.getStorageSync("roleType"),this.roleAcquisitionResponse(this.roleType,!0)},methods:{getInitializationDate:function(){var e=this;return(0,r.default)(regeneratorRuntime.mark((function t(){var n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=uni.getStorageSync("openId"),a=uni.getStorageSync("userId"),n||a){t.next=9;break}return t.next=5,(0,c.wxAuthorize)();case 5:e.roleType=t.sent,e.roleAcquisitionResponse(e.roleType),t.next=13;break;case 9:return t.next=11,(0,c.wxAuOpenId)(n);case 11:e.roleType=t.sent,e.roleAcquisitionResponse(e.roleType);case 13:case"end":return t.stop()}}),t)})))()},roleAcquisitionResponse:function(e,t){var n=this;if(-1==e)return this.checkBoundAccount(e),this.avterImg="/static/img/home/avter.png",this.avterName="Hello unbound",this.avterSchoolName="暂未绑定家长账号",void(this.avterClassesName=null);if(1==e)try{var a=uni.getStorageSync("student");this.avterImg=a["iconLink"]||"",this.avterName=a["studentName"]||"",this.avterSchoolName=a["classes"]["schoolName"]||"",this.avterClassesName=a["classes"]["classesName"]||""}catch(r){setTimeout((function(){n.roleAcquisitionResponse(e)}),500),console.log("获取头像异常"+r)}else this.roleType},seeDateil:function(){this.checkBoundAccount()||uni.navigateTo({url:"/parent/home/add-baby?dateil=ok"})},navToBaby:function(e){this.checkBoundAccount()||uni.navigateTo({url:e.url})},checkBoundAccount:function(e){return(-1==this.roleType||-1==e)&&(this.$Q.tipUrl({tip:"检测未绑定账号",url:"/parent/home/select-role"}),!0)}}};t.default=s},fe2b:function(e,t,n){"use strict";var a=n("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("96cf");var r=a(n("1da1")),i=n("9ff2"),o={name:"student-index",data:function(){return{stuFunList:[{title:"云家校",stuPageList:[{id:1,funType:1,iconImg:"/static/img/home/attendance-record.png",pageUrl:"/parent/home/attendance-count",iconTitle:"考勤记录"},{id:2,funType:1,iconImg:"/static/img/home/class-inform.png",pageUrl:"/parent/home/notice-inform?newsType=1",iconTitle:"班级通知"},{id:3,funType:1,iconImg:"/static/img/home/school-notice.png",pageUrl:"/parent/home/notice-inform?newsType=2",iconTitle:"学校通知"},{id:4,funType:1,iconImg:"/static/img/home/homework.png",pageUrl:"/parent/home/home-work",iconTitle:"家庭作业"},{id:5,funType:1,iconImg:"/static/img/home/campus-news.png",pageUrl:"/parent/home/campus-news",iconTitle:"校园新闻"},{id:6,funType:1,iconImg:"/static/img/home/address-list.png",pageUrl:"/parent/home/address-record",iconTitle:"通 讯 录"},{id:7,funType:1,iconImg:"/static/img/home/timetable.png",pageUrl:"/parent/home/class-schedule",iconTitle:"课 程 表"}]},{title:"云安全",stuPageList:[{id:1,funType:2,iconImg:"/static/img/home/real-time-location.png",pageUrl:"/parent/security/real-time-location",iconTitle:"实时定位"},{id:2,funType:2,iconImg:"/static/img/home/call-baby.png",pageUrl:"/parent/security/call-baby",iconTitle:"呼叫宝贝"},{id:3,funType:2,iconImg:"/static/img/home/kiss-number.png",pageUrl:"/parent/security/kiss-number",iconTitle:"亲情号码"},{id:4,funType:2,iconImg:"/static/img/home/white-list.png",pageUrl:"/parent/security/whilte-list",iconTitle:"白 名 单"},{id:5,funType:2,iconImg:"/static/img/home/electronic-fence.png",pageUrl:"/parent/security/danger-area",iconTitle:"危险区域"},{id:6,funType:2,iconImg:"/static/img/home/remote-listening.png",pageUrl:"/parent/security/remote-listening",iconTitle:"远程聆听"},{id:7,funType:2,iconImg:"/static/img/home/trajectory-playback.png",pageUrl:"/parent/security/trajectory-playback",iconTitle:"轨迹播放"},{id:8,funType:2,iconImg:"/static/img/home/common-position.png",pageUrl:"/parent/security/security-area",iconTitle:"安全区域"},{id:9,funType:2,iconImg:"/static/img/home/sport-record.png",pageUrl:"/parent/security/sport-record",iconTitle:"运动记录"},{id:10,funType:2,iconImg:"/static/img/home/sleep-mode.png",pageUrl:"/parent/security/sleep-mode",iconTitle:"睡眠模式"},{id:11,funType:2,iconImg:"/static/img/home/classroom-pattern.png",pageUrl:"/parent/security/classroom-pattern",iconTitle:"课堂模式"},{id:12,funType:2,iconImg:"/static/img/home/text-information.png",pageUrl:"/parent/security/text-information",iconTitle:"短信信息"},{id:13,funType:2,iconImg:"/static/img/home/battery-information.png",pageUrl:"/parent/security/battery-information",iconTitle:"电量信息"},{id:14,funType:2,iconImg:"/static/img/home/setting.png",pageUrl:"/parent/security/card-setting",iconTitle:"设 置"}]}],cardDate:void 0}},mounted:function(){this.getInitializeDate()},methods:{getInitializeDate:function(){try{this.cardDate=uni.getStorageSync("cardDate")}catch(e){console.log(e)}},funEntrance:function(e){var t=this;return(0,r.default)(regeneratorRuntime.mark((function n(){var a,r,o,c;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(a=uni.getStorageSync("roleType"),-1!=a){n.next=4;break}return t.$Q.tipUrl({tip:"检测未绑定账号",url:"/parent/home/select-role"}),n.abrupt("return");case 4:if(e.pageUrl){n.next=7;break}return t.$Q.tipUrl({tip:"该功能暂未开放"}),n.abrupt("return");case 7:if(1!=e.funType){n.next=10;break}return uni.navigateTo({url:e.pageUrl}),n.abrupt("return");case 10:if(2!=e.funType){n.next=28;break}if(n.prev=11,!(t.cardDate&&t.cardDate.imei&&t.status)){n.next=15;break}return uni.navigateTo({url:e.pageUrl+"?imei="+t.cardDate.imei}),n.abrupt("return");case 15:if(r=uni.getStorageSync("student")["id"],r){n.next=19;break}return t.$Q.tipUrl({tip:"获取学生异常,重新进入或刷新"}),n.abrupt("return");case 19:return n.next=21,(0,i.whetherBindCard)(r);case 21:o=n.sent,o&&("string"==typeof o?(c=JSON.parse(o),uni.setStorageSync("cardDate",c),uni.navigateTo({url:e.pageUrl+"?imei="+c.imei})):t.$Q.tipUrl({tip:"获取学生证数据异常,请联系客服"})),n.next=28;break;case 25:n.prev=25,n.t0=n["catch"](11),console.log("获取电子学生证基本信息异常"+n.t0);case 28:case"end":return n.stop()}}),n,null,[[11,25]])})))()}}};t.default=o}}]);