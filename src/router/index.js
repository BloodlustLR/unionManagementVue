import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Topic from '../views/Menu/Topic'
import FillLoss from '../views/Menu/union/FillLoss'
import FillLossDetail from '../views/Menu/union/FillLossDetail'

import UnionArmy from '../views/Menu/sys/unionArmy'
import Ship from '../views/Menu/sys/ship'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/home/topic',
    children: [
      {
        path: 'topic',
        name:'Topic',
        component: Topic
      },
      {
        path: 'fillloss',
        name:'FillLoss',
        component: FillLoss
      },
      {
        path: 'filllossDetail',
        name:'FillLossDetail',
        component: FillLossDetail
      },
      {
        path:'unionArmy',
        name:'UnionArmy',
        component: UnionArmy
      },
      {
        path:'ship',
        name:'Ship',
        component: Ship
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
