// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'  //引入路由插件
import axios from 'axios'
import VueAxios from 'vue-axios'  //引入axios异步请求插件
//引入所有scss包
import './common/scss/index.scss'

//需要启用axios插件
Vue.use(VueAxios, axios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
