/**
 * 自定义指令使得弹框可拖动
 */
import focus from './focus'

const install = function (Vue) {
  Vue.directive('focus', focus)
}

if (window.Vue) {
  window['focus'] = focus
  window.Vue.use(install)
}

focus.install = install
export default focus
