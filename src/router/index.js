import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由数据
import routes from './routes'

import {toLogin} from '@/api/_service'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getQueryString} from '@/libs/util.common'
import {USER_INFO} from '@/api/api.sys'
import cookies from '@/libs/util.cookies'
import store from '@/store'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  mode: 'history',
  routes
})
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  if (to.name === 'index') {
    let accessToken = getQueryString('accessToken')
    if (accessToken) {
      localStorage.setItem('token', accessToken)
      let res = await USER_INFO()
      if (res.code === 200 && res.data) {
        cookies.set('uid', res.data.id)
        await store.dispatch('common/user/set', {name: res.data.realName, ...res.data})
        await store.dispatch('common/user/load')
      }
    } else {
      await store.dispatch('common/user/load')
    }
  }

  // 进度条
  NProgress.start()
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    let token = localStorage.getItem('token')
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    if (token && token !== 'undefined') {
      next()
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      toLogin()
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
})
export default router
