import Vue from 'vue'
import Router from 'vue-router'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',  //指定被选中的路由的类名
  routes: [
    {
      path: '/',
      redirect: '/goods'   //重定向，默认为goods路由
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ]
})
