import Vue from 'vue'
import App from './App'

import $http from './common/request/requestConfig.js'
import $queue from './common/js/queue.js'
import VueAMap from "vue-amap"


Vue.prototype.$http=$http;
Vue.prototype.$Q=$queue;

import commonEmpty from "./components/common-empty.vue"
Vue.component("common-empty",commonEmpty);

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '72fe1c0a1dbc1ff6afe06524dd6c748a',
  plugin: ['AMap.Autocomplete','AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

// 使用uviewui库
import uView from "uview-ui";
Vue.use(uView);

// #ifdef H5
import wx from './common/js/weixin.js'
Vue.prototype.$wx=wx;
// #endif










Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
