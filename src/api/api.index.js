import { request } from './_service.js'

export function FOLDERS_TREE () {
  return request({
    url: '/api/bookmark/my-bookmark/foldersTree',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
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
