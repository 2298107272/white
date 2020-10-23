import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Roles from '../components/roles/roles.vue'
import Rights from '../components/rights/rights.vue'
import Goods from '../components/goods/goods.vue'
import Params from '../components/params/params.vue'
import Categories from '../components/categories/categories.vue'
import Orders from "../components/orders/orders.vue"
import Reports from "../components/reports/reports.vue"
import Add from '../components/goods/Add.vue'


Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [{ path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports },
      { path: "/add", component: Add }
      



    ]

  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const str = window.sessionStorage.getItem('token')
  if (!str) {
    return next('/login')
  }
  next()
})
export default router




// <h1>添加商品</h1>
// <el-breadcrumb separator="/">
//     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
//     <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
//     <el-breadcrumb-item>添加商品</el-breadcrumb-item>
// </el-breadcrumb>
// <!-- <!卡片视图区域 > -->
// <el-card>
//     <!-- <!消息提示 > -->
//   <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
