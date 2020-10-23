import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
//树形表格
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
//goods数据里时间格式转换
import moment from 'moment'
Vue.prototype.$moment = 'moment'
Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY年MM月DD日';
  // return moment(value).format(formatString); // value可以是普通日期 20170723
  return moment.unix(value).format(formatString); // 这是时间戳转时间
});
//
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
