import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import BasicLayout from '../components/BasicLayout.vue'
import registerBeforeGuards from './guards'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/list'
  },
  // 列表
  {
    path: '/list',
    name: 'list',
    redirect: '/list/article-list',
    component: BasicLayout,
    children: [
      {
        path: 'article-list',
        name: 'article-list',
        component: () => import('../views/list/article-list'),
        meta: { title: '文章列表', requiresAuth: true }
      },
      {
        path: 'column-list',
        name: 'column-list',
        component: () => import('../views/list/column-list'),
        meta: { title: '栏目列表', requiresAuth: true }
      },
      {
        path: 'recommend-list',
        name: 'recommend-list',
        component: () => import('../views/list/recommend-list'),
        meta: { title: '至尊推介列表', requiresAuth: true }
      },
      {
        path: 'member-list',
        name: 'member-list',
        component: () => import('../views/list/member-list'),
        meta: { title: '会员列表', requiresAuth: true }
      },
      {
        path: 'radio-list',
        name: 'radio-list',
        component: () => import('../views/list/radio-list'),
        meta: { title: '节目列表', requiresAuth: true }
      },
      {
        path: 'department-list',
        name: 'department-list',
        component: () => import('../views/list/department-list'),
        meta: { title: '部门列表', requiresAuth: true }
      },
      {
        path: 'ranking-list',
        name: 'ranking-list',
        component: () => import('../views/list/ranking-list'),
        meta: { title: '榜单数据列表', requiresAuth: true }
      }
    ]
  },
  // 记录管理
  {
    path: '/record',
    name: 'record',
    redirect: '/record/order-record',
    component: BasicLayout,
    children: [
      {
        path: 'order-record',
        name: 'order-record',
        component: () => import('../views/record/order-record'),
        meta: { title: '账变记录', requiresAuth: true }
      },
      {
        path: 'check-record',
        name: 'check-record',
        component: () => import('../views/record/check-record'),
        meta: { title: '签到记录', requiresAuth: true }
      },
      {
        path: 'buy-record',
        name: 'buy-record',
        component: () => import('../views/record/buy-record'),
        meta: { title: '购买记录', requiresAuth: true }
      },
      {
        path: 'subscribe-record',
        name: 'subscribe-record',
        component: () => import('../views/record/subscribe-record'),
        meta: { title: '订阅记录', requiresAuth: true }
      },
      {
        path: 'recharge-record',
        name: 'recharge-record',
        component: () => import('../views/record/recharge-record'),
        meta: { title: '充值记录', requiresAuth: true }
      }
    ]
  },
  // 报表管理
  {
    path: '/report',
    name: 'report',
    redirect: '/report/buy-report',
    component: BasicLayout,
    children: [
      {
        path: 'buy-report',
        name: 'buy-report',
        component: () => import('../views/report/buy-report'),
        meta: { title: '贴士分成报表', requiresAuth: true }
      },
      {
        path: 'subscribe-report',
        name: 'subscribe-report',
        component: () => import('../views/report/subscribe-report'),
        meta: { title: '推介分成报表', requiresAuth: true }
      }
    ]
  },
  // 系统管理
  {
    path: '/system',
    name: 'system',
    redirect: '/system/config',
    component: BasicLayout,
    children: [
      {
        path: 'system-user',
        name: 'system-user',
        component: () => import('../views/system/system-user'),
        meta: { title: '用户管理', requiresAuth: true }
      },
      {
        path: 'system-role',
        name: 'system-role',
        component: () => import('../views/system/system-role'),
        meta: { title: '角色管理', requiresAuth: true }
      },
      {
        path: 'system-menu',
        name: 'system-menu',
        component: () => import('../views/system/system-menu'),
        meta: { title: '菜单管理', requiresAuth: true }
      },
      {
        path: 'system-public',
        name: 'system-public',
        component: () => import('../views/system/system-public'),
        meta: { title: '公共配置', requiresAuth: true }
      },
      {
        path: 'system-activities',
        name: 'system-activities',
        component: () => import('../views/system/system-activities'),
        meta: { title: '重大利好配置', requiresAuth: true }
      },
      {
        path: 'system-recharge',
        name: 'system-recharge',
        component: () => import('../views/system/system-recharge'),
        meta: { title: '充值赠送配置', requiresAuth: true }
      },
      {
        path: 'system-advertisement',
        name: 'system-advertisement',
        component: () => import('../views/system/system-advertisement'),
        meta: { title: '广告管理', requiresAuth: true }
      },
      {
        path: 'system-checkin',
        name: 'system-checkin',
        component: () => import('../views/system/system-checkin'),
        meta: { title: '签到配置', requiresAuth: true }
      },
      {
        path: 'system-channel',
        name: 'system-channel',
        component: () => import('../views/system/system-channel'),
        meta: { title: '渠道配置', requiresAuth: true }
      },
      {
        path: 'system-level',
        name: 'system-level',
        component: () => import('../views/system/system-level'),
        meta: { title: '等级配置', requiresAuth: true }
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

// 注册全局前置守卫
registerBeforeGuards(router)

export default router
