(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["parent-security-trajectory-playback"],{"07d6":function(t,e,i){"use strict";i.r(e);var a=i("70ea"),n=i.n(a);for(var r in a)"default"!==r&&function(t){i.d(e,t,(function(){return a[t]}))}(r);e["default"]=n.a},"081a":function(t,e,i){"use strict";i.r(e);var a=i("c336"),n=i("07d6");for(var r in n)"default"!==r&&function(t){i.d(e,t,(function(){return n[t]}))}(r);i("251c");var o,s=i("f0c5"),c=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"4984a21a",null,!1,a["a"],o);e["default"]=c.exports},1267:function(t,e,i){"use strict";var a;i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return r})),i.d(e,"a",(function(){return a}));var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("v-uni-picker",{class:{disabled:t.disabled},attrs:{title:t.index,mode:"multiSelector",disabled:t.disabled,value:t.index,range:t.array},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.bindTimeChange.apply(void 0,arguments)},columnchange:function(e){arguments[0]=e=t.$handleEvent(e),t.columnchange.apply(void 0,arguments)}}},[t._t("default")],2)],1)},r=[]},"19c9":function(t,e,i){"use strict";i("99af"),i("c740"),i("caad"),i("e25e"),i("ac1f"),i("1276"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"day-time-date",props:{timeType:{type:String,default:function(){return"day"}},disabled:{type:Boolean,default:function(){return!1}},iconshow:{type:Boolean,default:function(){return!0}},childValue:{default:function(){return""}},minSelect:{type:String,default:function(){return"1900/01/01"}},maxSelect:{type:String,default:function(){return"2050/12/31"}},plaStyle:{type:String,default:"color:#b5b8c2;font-size: 30rpx;"}},data:function(){return{index:[0],array:[],yearArr:[],monthArr:[],yearIndex:0,showTime:this.moment(this.childValue)}},methods:{moment:function(t){var e=this.timeType;if(t){var i=new Date(t),a=i.getFullYear(),n=i.getMonth()+1;n=n<10?"0".concat(n):n;var r=i.getDate();r=r<10?"0".concat(r):r;var o=i.getHours();o=o<10?"0".concat(o):o;var s=i.getMinutes();s=s<10?"0".concat(s):s;var c=i.getSeconds();c=c<10?"0".concat(c):c;var l="".concat(a,"/").concat(n,"/").concat(r," ").concat(o,":").concat(s,":").concat(c);return"year"===e&&(l="".concat(a)),"month"===e&&(l="".concat(a,"-").concat(n)),"day"===e&&(l="".concat(a,"-").concat(n,"-").concat(r)),l}},setDefaultValue:function(){var t=this.moment((new Date).getTime());this.valueEchoed(t)},bindDateChange:function(t){this.childValue=t.target.value},dateInit:function(){this.array=[],this.yearArr=[],this.monthArr=[];var t=this.moment(this.minSelect)||[],e=this.moment(this.maxSelect)||[];t=t?t.split(" "):"",e=e?e.split(" "):"",t=t[0]?t[0].split("-"):1900,e=e[0]?e[0].split("-"):2050;var i=this.timeType,a="",n=a.monthStar,r=a.monthEnd,o=t[0]?parseInt(t[0]):1900,s=e[0]?parseInt(e[0]):2050;if("day"===i)t[2]&&parseInt(t[2]),e[2]&&parseInt(e[2]);"month"!==i&&"day"!==i||(n=t[1]?parseInt(t[1]):1,r=e[1]?parseInt(e[1]):12);for(var c=o;c<=s;c++){var l=c<10?"0".concat(c):c;if(this.yearArr.push("".concat(l,"年")),"month"===i||"day"===i){var u=this.getMonthArr(c,o,s,n,r,i);u.length&&this.monthArr.push(u)}}this.array[0]=this.yearArr,"month"!==i&&"day"!==i||(this.array[1]=this.monthArr.length&&this.monthArr[0]),"day"===i&&(this.array[2]=this.getDateArr(parseInt(this.yearArr[0]),parseInt(this.monthArr[0])))},getMonthArr:function(t,e,i,a,n,r){var o=[];if(t===e&&t!==i)for(var s=a;s<=12;s++){var c=s<10?"0".concat(s):s;o.push("".concat(c,"月"))}if(t===i&&t!==e)for(var l=1;l<=n;l++){var u=l<10?"0".concat(l):l;o.push("".concat(u,"月"))}if(t!==e&&t!==i)for(var d=1;d<=12;d++){var f=d<10?"0".concat(d):d;o.push("".concat(f,"月"))}if(t===e&&t===i)for(var m=a;m<=n;m++){var p=m<10?"0".concat(m):m;o.push("".concat(p,"月"))}return o},getDateArr:function(t,e){var i=this.moment(this.minSelect)||[],a=this.moment(this.maxSelect)||[];i=i.length&&i.split("-"),a=a.length&&a.split("-");var n=i[0]?parseInt(i[0]):1900,r=a[0]?parseInt(a[0]):2050,o=i[1]?parseInt(i[1]):1,s=a[1]?parseInt(a[1]):12,c=[],l=30,u=[1,3,5,7,8,10,12];u.includes(e)&&(l=31),2===e&&(l=t%400==0||t%4==0&&t%100!=0?29:28);var d=i[2]?parseInt(i[2]):1,f=a[2]?parseInt(a[2]):l;if(t!==r&&t!==n||t===n&&e!==o&&e!==s||t===r&&e!==s&&e!==o||n===r&&e!==o&&e!==s||n!==r&&t===r&&e!==s||t===n&&e!==o&&t<r)for(var m=1;m<=l;m++){var p=m<10?"0".concat(m):m;c.push("".concat(p,"日"))}if(n===r&&t===n&&e===o&&e!==s||n!==r&&t===n&&e===o)for(var h=d;h<=l;h++){var v=h<10?"0".concat(h):h;c.push("".concat(v,"日"))}if(t===r&&e===s&&e!==o&&n===r||t===r&&n!==r&&e===s)for(var b=1;b<=f;b++){var g=b<10?"0".concat(b):b;c.push("".concat(g,"日"))}if(t===n&&n===r&&e===o&&o===s)for(var x=d;x<=f;x++){var y=x<10?"0".concat(x):x;c.push("".concat(y,"日"))}return c},bindTimeChange:function(t){var e="",i=t.detail.value,a=this.timeType,n=parseInt(this.array[0][parseInt(i[0])||0]),r="";if(e=n+"","month"===a||"day"===a){var o=parseInt(i[1])||0;o=o<0?0:o,r=parseInt(this.array[1][o]),r=r<10?"0".concat(r):r,e="".concat(e,"-").concat(r)}if("day"===a){var s=parseInt(i[2])||0;s=s<0?0:s;var c=parseInt(this.array[2][s]);c=c<10?"0".concat(c):c,e="".concat(e,"-").concat(c)}this.showTime=e,this.$emit("getData",e)},columnchange:function(t){var e=t.detail.value,i=t.detail.column,a=this.timeType;if(this.$set(this.index,i,e),0===i&&(this.yearIndex=e,"month"!==a&&"day"!==a||this.$set(this.array,1,this.monthArr[e]),"day"===a)){var n=this.index[1]||0,r=this.getDateArr(parseInt(this.yearArr[e]),parseInt(this.monthArr[this.yearIndex][n]));this.$set(this.array,2,r)}if(1===i&&"day"===a){var o=this.getDateArr(parseInt(this.yearArr[this.yearIndex]),parseInt(this.monthArr[this.yearIndex][e]));this.$set(this.array,2,o)}},valueEchoed:function(t){if(this.index=[0],this.childValue||t){var e=this.childValue||t;e=this.moment(e),e=e.split("-");var i=this.array[0].findIndex((function(t){return parseInt(t)===parseInt(e[0])}))||0;i=-1===i?0:i,this.index[0]=i,this.yearIndex=i;var a=this.timeType;if("month"===a||"day"===a){this.array[1]=this.monthArr.length&&this.monthArr[i];var n=this.array[1]&&this.array[1].length&&this.array[1].findIndex((function(t){return parseInt(t)===parseInt(e[1])}))||0;this.index[1]=n}if("day"===a){var r=this.index[0]||0,o=this.index[1]||0;r=-1===r?0:r,o=-1===o?0:o;var s=this.getDateArr(parseInt(this.yearArr[r]),parseInt(this.monthArr[r][o]));this.getDateIndex(s)}}},getDateIndex:function(t){var e=this.moment((new Date).getTime()),i=this.childValue||e;i=this.moment(i),i=i.split("-"),this.array[2]=t;var a=this.array[2].findIndex((function(t){return parseInt(t)===parseInt(i[2])}))||0;this.index[2]=a}},watch:{minSelect:function(){this.dateInit(),this.setDefaultValue()},maxSelect:function(){this.dateInit(),this.setDefaultValue()},childValue:function(){this.showTime="",this.showTime=this.moment(this.childValue),this.dateInit(),this.setDefaultValue()}},created:function(){this.dateInit(),this.valueEchoed(),this.childValue||this.setDefaultValue()}};e.default=a},"1dda":function(t,e,i){"use strict";i.r(e);var a=i("a2cb"),n=i("7275");for(var r in n)"default"!==r&&function(t){i.d(e,t,(function(){return n[t]}))}(r);i("2b1e");var o,s=i("f0c5"),c=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"31f5aa05",null,!1,a["a"],o);e["default"]=c.exports},2447:function(t,e,i){"use strict";i.r(e);var a=i("7fa4"),n=i("cd85");for(var r in n)"default"!==r&&function(t){i.d(e,t,(function(){return n[t]}))}(r);i("dff0");var o,s=i("f0c5"),c=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"5eb9c329",null,!1,a["a"],o);e["default"]=c.exports},"251c":function(t,e,i){"use strict";var a=i("48d9"),n=i.n(a);n.a},"2b1e":function(t,e,i){"use strict";var a=i("b3a7"),n=i.n(a);n.a},"324d":function(t,e,i){"use strict";var a=i("dae0"),n=i.n(a);n.a},4301:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".u-time-axis-item[data-v-4984a21a]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;\nflex-direction:column;width:100%;position:relative;margin-bottom:%?32?%}.u-time-axis-node[data-v-4984a21a]{position:absolute;top:%?12?%;left:%?-40?%;-webkit-transform-origin:0;transform-origin:0;-webkit-transform:translateX(-50%);transform:translateX(-50%);\ndisplay:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;\n-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;z-index:1;font-size:%?24?%}.u-dot[data-v-4984a21a]{height:%?16?%;width:%?16?%;-webkit-border-radius:%?100?%;border-radius:%?100?%;background:#ddd}",""]),t.exports=e},"48d9":function(t,e,i){var a=i("4301");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("d5121626",a,!0,{sourceMap:!1,shadowMode:!1})},"5b70":function(t,e,i){"use strict";i.r(e);var a=i("6377"),n=i.n(a);for(var r in a)"default"!==r&&function(t){i.d(e,t,(function(){return a[t]}))}(r);e["default"]=n.a},6377:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"u-time-line",data:function(){return{}}};e.default=a},6920:function(t,e,i){"use strict";i.r(e);var a=i("1267"),n=i("e67d");for(var r in n)"default"!==r&&function(t){i.d(e,t,(function(){return n[t]}))}(r);i("324d");var o,s=i("f0c5"),c=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"c8e1b9e2",null,!1,a["a"],o);e["default"]=c.exports},"70ea":function(t,e,i){"use strict";i("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"u-time-line-item",props:{bgColor:{type:String,default:"#ffffff"},nodeTop:{type:[String,Number],default:""}},data:function(){return{}},computed:{nodeStyle:function(){var t={backgroundColor:this.bgColor};return""!=this.nodeTop&&(t.top=this.nodeTop+"rpx"),t}}};e.default=a},7275:function(t,e,i){"use strict";i.r(e);var a=i("f749"),n=i.n(a);for(var r in a)"default"!==r&&function(t){i.d(e,t,(function(){return a[t]}))}(r);e["default"]=n.a},"7fa4":function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return r})),i.d(e,"a",(function(){return a}));var a={uTimeLine:i("a4cf").default,uTimeLineItem:i("081a").default,uImage:i("c650").default,uLoading:i("79de").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("v-uni-view",{staticClass:"container"},[i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.disMap,expression:"disMap"}],staticClass:"container-map"},[i("v-uni-view",{staticClass:"map-time"},[i("v-uni-view",{staticClass:"time-day",class:0==t.tabSelectIdx?"time-days":"",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.toDay.apply(void 0,arguments)}}},[t._v("今天")]),i("v-uni-text",[t._v("|")]),i("v-uni-view",{staticClass:"time-day",class:1==t.tabSelectIdx?"time-days":"",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.yesDay.apply(void 0,arguments)}}},[t._v("昨天")]),i("v-uni-text",[t._v("|")]),i("v-uni-view",{staticClass:"time-day",class:2==t.tabSelectIdx?"time-days":"",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.tabSelectIdx=2}}},[i("day-time-date",{attrs:{maxSelect:t.maxSelectTime},on:{getData:function(e){arguments[0]=e=t.$handleEvent(e),t.timeContr.apply(void 0,arguments)}}},[t._v("日期")])],1)],1),i("v-uni-view",{attrs:{id:"containerMap"}},[t._v("地图加载中...")])],1),i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:!t.disMap,expression:"!disMap"}],staticClass:"container-list"},[i("u-time-line",t._l(t.footprintList,(function(e,a){return i("u-time-line-item",{key:a,scopedSlots:t._u([{key:"node",fn:function(){return[i("v-uni-view",{staticClass:"u-node"})]},proxy:!0},{key:"content",fn:function(){return[i("v-uni-view",{staticClass:"item"},[i("v-uni-view",{staticClass:"item-time"},[t._v(t._s(e.createDate&&e.createDate.substr(0,16)))]),i("v-uni-view",{staticClass:"item-title"},[t._v(t._s(e.address))]),i("v-uni-view",{staticClass:"item-name"},[i("u-image",{attrs:{shape:"circle",src:t.student.iconLink||"/static/img/home/avter.png",height:"64rpx",width:"66rpx"}},[i("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1),i("v-uni-view",{staticClass:"name-student"},[t._v(t._s(t.student.studentName))])],1),i("v-uni-view",{staticClass:"item-amap"},[i("v-uni-map",{attrs:{latitude:e.latitude,longitude:e.longitude,markers:[{id:a,latitude:e.latitude,longitude:e.longitude}]}})],1)],1)]},proxy:!0}],null,!0)})})),1),i("common-empty",{attrs:{boxWidth:"100%",noData:!t.footprintList.length}}),i("v-uni-view",{staticStyle:{height:"102rpx"}})],1)],1),i("area-tab-btm",{attrs:{isTraje:!0},on:{addMap:function(e){arguments[0]=e=t.$handleEvent(e),t.trajeAnima.apply(void 0,arguments)},disList:function(e){arguments[0]=e=t.$handleEvent(e),t.disMap=!0},disMap:function(e){arguments[0]=e=t.$handleEvent(e),t.disMap=!1}}})],1)},r=[]},"8dc6":function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,'.u-time-axis[data-v-4c33fd1d]{padding-left:%?40?%;position:relative}.u-time-axis[data-v-4c33fd1d]::before{content:" ";position:absolute;left:0;top:%?12?%;width:1px;bottom:0;border-left:1px solid #ddd;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleX(.5);transform:scaleX(.5)}',""]),t.exports=e},a154:function(t,e,i){"use strict";var a=i("e7e5"),n=i.n(a);n.a},a2cb:function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return r})),i.d(e,"a",(function(){return a}));var a={uImage:i("c650").default,uLoading:i("79de").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("v-uni-view",{staticClass:"common-btm"},[t._l(t.tabList,(function(e,a){return[2!=e.id?i("v-uni-view",{key:a+"_0",staticClass:"btm-item",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.tabClick(a)}}},[i("u-image",{attrs:{width:"42rpx",height:"42rpx",src:t.tabSelectIdx==a?e.imgSelects:e.imgSelect,mode:"aspectFill"}},[i("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1),i("v-uni-view",{staticClass:"item-name",class:t.tabSelectIdx==a?"select-name":""},[t._v(t._s(e.name))])],1):i("v-uni-view",{staticClass:"btm-items",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.$emit("addMap")}}},[i("u-image",{attrs:{width:"158rpx",height:"146rpx",src:e.imgSelect,mode:"aspectFill"}},[i("u-loading",{attrs:{slot:"loading"},slot:"loading"})],1)],1)]}))],2)],1)},r=[]},a4cf:function(t,e,i){"use strict";i.r(e);var a=i("cac9"),n=i("5b70");for(var r in n)"default"!==r&&function(t){i.d(e,t,(function(){return n[t]}))}(r);i("a154");var o,s=i("f0c5"),c=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"4c33fd1d",null,!1,a["a"],o);e["default"]=c.exports},a884:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".container .container-map[data-v-5eb9c329]{width:100vw;height:100vh}.container .container-map .map-time[data-v-5eb9c329]{position:fixed;top:%?30?%;left:50%;z-index:99;-webkit-transform:translateX(-50%);transform:translateX(-50%);width:%?340?%;height:%?80?%;opacity:1;background:#fff;border:%?2?% solid #dcdcdc;-webkit-border-radius:%?5?%;border-radius:%?5?%;-webkit-box-shadow:2px 2px 10px 0 rgba(0,0,0,.1);box-shadow:2px 2px 10px 0 rgba(0,0,0,.1);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.container .container-map .map-time .time-day[data-v-5eb9c329]{font-size:%?32?%;font-family:Adobe Heiti Std R,Adobe Heiti Std R-R;color:#999;height:100%;-webkit-box-flex:1;-webkit-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.container .container-map .map-time .time-day.time-days[data-v-5eb9c329]{color:#028dfb}.container .container-map .map-time uni-text[data-v-5eb9c329]{color:#a0a0a0}.container .container-map #containerMap[data-v-5eb9c329]{width:100vw;height:100vh;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;color:#ccc}.container .container-list[data-v-5eb9c329]{padding:0 %?40?%}.container .container-list .u-node[data-v-5eb9c329]{background-color:#fa4169;width:%?16?%;height:%?16?%;-webkit-border-radius:50%;border-radius:50%}.container .container-list .item .item-time[data-v-5eb9c329]{font-size:%?28?%;font-family:Source Han Sans CN Regular,Source Han Sans CN Regular-Regular;font-weight:400;text-align:left;color:#69707f;line-height:%?56?%}.container .container-list .item .item-title[data-v-5eb9c329]{font-size:%?32?%;font-family:Source Han Sans CN Regular,Source Han Sans CN Regular-Regular;font-weight:700;text-align:left;color:#1d1e2c;line-height:%?42?%;letter-spacing:%?2?%}.container .container-list .item .item-name[data-v-5eb9c329]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:%?100?%}.container .container-list .item .item-name .name-student[data-v-5eb9c329]{font-size:%?28?%;font-family:Source Han Sans CN Regular,Source Han Sans CN Regular-Regular;font-weight:400;text-align:left;color:#1d1e2c;margin-left:%?30?%}.container .container-list .item .item-amap[data-v-5eb9c329]{height:%?300?%;width:%?600?%;overflow:hidden;-webkit-border-radius:%?20?%;border-radius:%?20?%}.container .container-list .item .item-amap uni-map[data-v-5eb9c329]{height:%?360?%;width:100%}",""]),t.exports=e},ab95:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".tx_r[data-v-c8e1b9e2]{line-height:48px;font-size:15px;font-weight:400;color:#848b9a}.fa-angle-right[data-v-c8e1b9e2]{font-size:%?36?%;padding-left:%?12?%}",""]),t.exports=e},b3a7:function(t,e,i){var a=i("f9c5");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("67d53c89",a,!0,{sourceMap:!1,shadowMode:!1})},c336:function(t,e,i){"use strict";var a;i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return r})),i.d(e,"a",(function(){return a}));var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"u-time-axis-item"},[t._t("content"),i("v-uni-view",{staticClass:"u-time-axis-node",style:[t.nodeStyle]},[t._t("node",[i("v-uni-view",{staticClass:"u-dot"})])],2)],2)},r=[]},cac9:function(t,e,i){"use strict";var a;i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return r})),i.d(e,"a",(function(){return a}));var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"u-time-axis"},[t._t("default")],2)},r=[]},cd85:function(t,e,i){"use strict";i.r(e);var a=i("d4d0"),n=i.n(a);for(var r in a)"default"!==r&&function(t){i.d(e,t,(function(){return a[t]}))}(r);e["default"]=n.a},d4d0:function(t,e,i){"use strict";var a=i("4ea4");i("4160"),i("d81d"),i("ac1f"),i("5319"),i("1276"),i("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("96cf");var n=a(i("1da1")),r=i("9ff2"),o=a(i("1dda")),s=a(i("6920")),c={components:{areaTabBtm:o.default,dayTimeDate:s.default},data:function(){return{imei:"",disMap:!0,tabSelectIdx:0,maxSelectTime:"",student:{},startTime:"",endTime:"",footprintList:[],footprintMap:[],oneLoca:[],lastLoca:[],lineList:[],marker:null,map:null,polyline:null}},onLoad:function(t){this.getInitDate(t)},methods:{getInitDate:function(t){try{this.imei=t.imei;var e=(0,r.getCurrentDate)(3);this.maxSelectTime=e.replace(/-/g,"/"),this.student=uni.getStorageSync("student"),t.time?(this.setTime(t.time),this.tabSelectIdx=2):this.setTime(e),this.getLocalList(t.imei)}catch(i){console.log(i)}},trajeAnima:function(){this.lineList.length?this.marker.moveAlong(this.lineList,300):this.$Q.tipUrl({tip:"暂无数据,无法模拟"})},toDay:function(){this.tabSelectIdx=0;var t=(0,r.getCurrentDate)(3);this.setTime(t)},yesDay:function(){this.tabSelectIdx=1;var t=(0,r.getCurrentDate)(4);this.setTime(t)},timeContr:function(t){this.setTime(t)},getLocalList:function(t){var e=this;return(0,n.default)(regeneratorRuntime.mark((function i(){var a,n,o;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.prev=0,a={imei:t,start:e.startTime,end:e.endTime},i.next=4,(0,r.getQueryFoot)(a);case 4:return e.footprintList=i.sent,i.next=7,(0,r.getQueryLocal)(a);case 7:if(n=i.sent,!n.length){i.next=18;break}return e.oneLoca=n[0].location.split(","),e.lastLoca=n[n.length?n.length-1:0].location.split(","),o=[],n.forEach((function(t){o.push(t.location.split(","))})),e.lineList=o,e.marker=o,e.initMap(),e.initRoad(),i.abrupt("return");case 18:e.$Q.tipUrl({tip:"暂无足迹数据"}),e.$wx.ready((function(){e.$wx.getLocation({type:"gcj02",success:function(t){e.oneLoca=[t.longitude,t.latitude],e.lastLoca=[],e.marker=[],e.lineList=[],e.initMap()}})})),setTimeout((function(){e.map||e.$Q.tipUrl({tip:"地图加载超时,请重进",delta:1})}),5e3),i.next=26;break;case 23:i.prev=23,i.t0=i["catch"](0),console.log(i.t0);case 26:case"end":return i.stop()}}),i,null,[[0,23]])})))()},setTime:function(t){this.startTime=t;var e=new Date(t).getTime()+864e5,i=new Date(e),a=i.getFullYear(),n=i.getMonth()+1,r=i.getDate();this.endTime=a+"-"+(n>=10?n:"0"+n)+"-"+(r>=10?r:"0"+r),this.getLocalList(this.imei)},initMap:function(){try{this.map=new AMap.Map("containerMap",{resizeEnable:!0,center:this.oneLoca,zoom:20,viewMode:"3D"}),this.marker=new AMap.Marker({map:this.map,position:this.oneLoca,icon:"/static/img/parent/traje-icon.png",offset:new AMap.Pixel(-26,-26),autoRotation:!0})}catch(t){console.log(t)}},initRoad:function(){this.polyline=new AMap.Polyline({map:this.map,path:this.lineList,showDir:!0,strokeColor:"#009e24",strokeOpacity:.8,strokeWeight:4,strokeStyle:"solid"});var t=new AMap.Polyline({map:this.map,strokeColor:"#0099ff",strokeWeight:4});this.marker.on("moving",(function(e){t.setPath(e.passedPath)})),this.map.setFitView()}}};e.default=c},dae0:function(t,e,i){var a=i("ab95");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("449b3200",a,!0,{sourceMap:!1,shadowMode:!1})},dff0:function(t,e,i){"use strict";var a=i("e60b"),n=i.n(a);n.a},e60b:function(t,e,i){var a=i("a884");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("bbae68e4",a,!0,{sourceMap:!1,shadowMode:!1})},e67d:function(t,e,i){"use strict";i.r(e);var a=i("19c9"),n=i.n(a);for(var r in a)"default"!==r&&function(t){i.d(e,t,(function(){return a[t]}))}(r);e["default"]=n.a},e7e5:function(t,e,i){var a=i("8dc6");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("bb773cb6",a,!0,{sourceMap:!1,shadowMode:!1})},f749:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"area-tab-btm",props:{isTraje:{type:Boolean,default:!1}},data:function(){return{tabSelectIdx:0,tabList:[{id:1,name:"首页",select:!0,imgSelects:"/static/img/parent/security-area-idxs.png",imgSelect:"/static/img/parent/security-area-idx.png"},{id:2,imgSelect:"/static/img/parent/add-bg.png"},{id:3,name:"地图",select:!1,imgSelects:"/static/img/parent/security-area-maps.png",imgSelect:"/static/img/parent/security-area-map.png"}]}},mounted:function(){if(this.isTraje){var t=[{id:1,name:"首页",select:!0,imgSelects:"/static/img/parent/security-area-idxs.png",imgSelect:"/static/img/parent/security-area-idx.png"},{id:2,imgSelect:"/static/img/parent/traje-animation.png"},{id:3,name:"足迹",select:!1,imgSelects:"/static/img/parent/trajectory-icons.png",imgSelect:"/static/img/parent/trajectory-icon.png"}];this.tabList=t}},methods:{tabClick:function(t){this.tabSelectIdx=t,0==t?this.$emit("disList"):this.$emit("disMap")}}};e.default=a},f9c5:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".common-btm[data-v-31f5aa05]{width:100vw;height:%?102?%;z-index:999;position:fixed;bottom:0;left:0;background-color:#fff;-webkit-border-top-left-radius:%?24?%;border-top-left-radius:%?24?%;-webkit-border-top-right-radius:%?24?%;border-top-right-radius:%?24?%;-webkit-box-shadow:2px 2px 10px 0 rgba(0,0,0,.1);box-shadow:2px 2px 10px 0 rgba(0,0,0,.1);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;padding:0 %?100?%}.common-btm .btm-item[data-v-31f5aa05]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column}.common-btm .btm-item .item-name[data-v-31f5aa05]{font-size:%?28?%;font-family:Source Han Sans CN Regular,Source Han Sans CN Regular-Regular;font-weight:400;text-align:left;color:#333;margin-top:%?6?%}.common-btm .btm-item .item-name.select-name[data-v-31f5aa05]{color:#48bbfd}.common-btm .btm-items[data-v-31f5aa05]{position:absolute;top:20%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}",""]),t.exports=e}}]);