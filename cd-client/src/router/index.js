import Vue from 'vue'
import VueRouter from 'vue-router'
// import Layout from '../components/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/home')
  },
  {
    path: '/release/:id',
    component: () => import('../views/release')
  }
]

const router = new VueRouter({
  routes
})

export default router
