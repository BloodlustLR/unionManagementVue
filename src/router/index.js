import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Topic from '../views/Menu/Topic'
import FillLoss from '../views/Menu/union/FillLoss'

import UnionArmy from '../views/Menu/sys/unionArmy'

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
        path:'unionArmy',
        name:'UnionArmy',
        component: UnionArmy
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
