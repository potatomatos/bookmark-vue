import Layout from '@/layout/index'

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    component: Layout,
    redirect: {name: 'index'},
    children: [
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '首页',
          auth: false
        },
        component: () => import('@/views/index')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  {
    path: '/login',
    name: 'login',
    meta: {
      auth: false
    },
    component: () => import('@/views/system/login')
  },
  {
    path: '/auth',
    name: 'auth',
    meta: {
      auth: false
    },
    component: () => import('@/views/system/auth')
  }
]
/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    meta: {
      auth: false
    },
    component: () => import('@/views/error/404')
  }
]
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
