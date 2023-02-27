/**
 * 自定义指令使得弹框可拖动
 */
import drag from './drag'

const install = function (Vue) {
  Vue.directive('el-drag-dialog', drag)
}

if (window.Vue) {
  window['el-drag-dialog'] = drag
  window.Vue.use(install)
}

drag.install = install
export default drag
