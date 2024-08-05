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
          auth: true,
          keepAlive: true
        },
        component: () => import('@/views/index')
      },
      {
        path: 'recent',
        name: 'recent',
        meta: {
          title: '最近访问',
          auth: true
        },
        component: () => import('@/views/recent')
      },
      {
        path: 'import',
        name: 'import',
        meta: {
          title: '导入书签',
          auth: true,
          keepAlive: false
        },
        component: () => import('@/views/file/import-bookmark')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = []

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
