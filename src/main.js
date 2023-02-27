// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// store
import store from '@/store/index'

import 'jquery-ui-dist/jquery-ui'
import 'jquery-ui-dist/jquery-ui.min.css'
import '@/assets/style/normalize.min.css'
import '@/assets/style/style.scss'

// svg 图标
import '@/assets/svg-icons'

// 公用组件
import '@/components'

// 右键菜单
import Contextmenu from 'vue-contextmenujs'
// elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/mime.scss'

// 弹框组件
import layer from 'vue-pubilc-layer'

Vue.use(Contextmenu)
Vue.use(ElementUI)
Vue.use(layer)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
