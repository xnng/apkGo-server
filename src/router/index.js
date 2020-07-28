import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../components/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/home')
      }
    ]
  },
  {
    path: '/release/:id',
    component: () => import('../views/release')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === `/release/${to.params.id}`) {
    document.getElementById('viewport').setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=0')
  } else {
    document.getElementById('viewport').setAttribute('content', 'width=device-width,initial-scale=0.47')
  }
  next()
})

export default router
