import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Login',
    component:() => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: '/home/topic',
    children: [
      {
        path: 'topic',
        name:'Topic',
        component: () => import('../views/Menu/Topic.vue')
      },
      {
        path: 'fillloss',
        name:'FillLoss',
        component: () => import('../views/Menu/union/FillLoss')
      },
      {
        path: 'killCount',
        name:'KillCount',
        component: () => import('../views/Menu/union/KillCount')
      },
      {
        path: 'armyFillLoss',
        name:'ArmyFillLoss',
        component: () => import('../views/Menu/army/ArmyFillLoss')
      },
      {
        path: 'armyFillLossDetail',
        name:'ArmyFillLossDetail',
        component: () => import('../views/Menu/army/ArmyFillLossDetail')
      },
      {
        path: 'filllossDetail',
        name:'FillLossDetail',
        component: () => import('../views/Menu/union/FillLossDetail')
      },
      {
        path:'unionArmy',
        name:'UnionArmy',
        component: () => import('../views/Menu/sys/unionArmy')
      },
      {
        path:'ship',
        name:'Ship',
        component: () => import('../views/Menu/sys/ship')
      },
      {
        path:'userManage',
        name:'UserManage',
        component: () => import('../views/Menu/sys/userManage')
      }
    ]
  },
  {
    path: '/reportPayment',
    name: 'ReportPayment',
    component: () => import('../views/ReportPayment.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
