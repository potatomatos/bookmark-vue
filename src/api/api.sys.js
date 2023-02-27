import { request } from './_service.js'

export function GET_ACCESS_TOKEN (params = {}) {
  return request({
    url: '/api/cloud-disk/system/getAccessToken',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}

/**
 * @description 登录
 * @param {Object} data 登录携带的信息
 */
export function LOGIN (data = {}) {
  // 接口请求
  return request({
    url: '/api/oauth-server/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

/**
 * @description 注销登录
 */
export function LOGOUT () {
  // 接口请求
  return request({
    url: '/api/oauth-server/logout',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
