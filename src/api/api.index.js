import { request } from './_service.js'

export function FOLDERS_TREE () {
  return request({
    url: '/api/bookmark/my-bookmark/foldersTree',
    method: 'post'
  })
}

/**
 * @description 获取列表
 * @param pid
 * @param {Object} data
 */
export function BOOKMARKS (pid = 0, data = {}) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/bookmarks/' + pid,
    method: 'post',
    data
  })
}

/**
 * 链接访问
 * @param params
 * @returns {*}
 * @constructor
 */
export function REDIRECT (params = {}) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/redirect',
    method: 'get',
    params
  })
}
