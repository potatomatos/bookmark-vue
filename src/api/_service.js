import axios from 'axios'
import { get, isEmpty, merge } from 'lodash'
import qs from 'qs'

/**
 * @description 创建请求实例
 */
function createService () {
  // 创建一个 axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    config => config,
    error => {
      // 发送失败
      console.log(error)
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      switch (response.data.code) {
        // 账号过期
        case 5001: toLogin(response.data.msg); break
        // 账号禁用
        case 5004: toLogin(response.data.msg); break
        // 账号锁定
        case 5005: toLogin(response.data.msg); break
        // 未登录
        case 6001: toLogin(response.data.msg); break
        // token不存在
        case 6002: toLogin(response.data.msg); break
        // 登录信息已过期
        case 6003: toLogin(response.data.msg); break
        // token非法
        case 6005: toLogin(response.data.msg); break
        default: return response.data
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: error.message = '网络错误'; break
      }
      throw error
    }
  )
  return service
}

function stringify (data, format) {
  if (format) {
    return qs.stringify(data, format)
  }
  return qs.stringify(data, { allowDots: true, encode: false })
}

export function toLogin (msg) {
  window.location.href = process.env.LOGIN_URL + '?clientId=' + process.env.CLIENT_ID + '&redirect=' + process.env.REDIRECT_URI
}
/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequest (service) {
  return function (config) {
    const token = localStorage.getItem('token')
    const configDefault = {
      headers: {
        access_token: token,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json'),
        'x-requested-with': 'XMLHttpRequest'
      },
      timeout: 10000,
      baseURL: '/',
      data: {}
    }
    const option = merge(configDefault, config)
    // 处理 get 请求的参数
    // 请根据实际需要修改
    if (!isEmpty(option.params)) {
      option.url = option.url + '?' + stringify(option.params, option.format)
      option.params = {}
    }
    // 当需要以 form 形式发送时 处理发送的数据
    // 请根据实际需要修改
    if (!isEmpty(option.data) && option.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      option.data = stringify(option.data)
    }
    return service(option)
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequest(service)
