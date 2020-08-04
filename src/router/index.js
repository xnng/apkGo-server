import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/layout'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/home')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/user/login')
  },
  {
    path: '/register',
    component: () => import('@/views/user/register')
  },
  {
    path: '/release/:id',
    component: () => import('@/views/release')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 移动适配
  if (to.path === `/release/${to.params.id}`) {
    document.getElementById('viewport').setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=0')
  } else {
    document.getElementById('viewport').setAttribute('content', 'width=device-width,initial-scale=0.47')
  }
  next()

  // 登录鉴权
  // if (!store.state.user.token && to.path !== '/login') {
  //   next('/login')
  // } else {
  //   next()
  // }
})

export default router
