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
 * @description 删除书签
 * @param id
 */
export function BOOKMARK_DEL (id) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/delete/bookmark/' + id,
    method: 'post'
  })
}

/**
 * @description 删除收藏夹
 * @param id
 */
export function FOLDER_DEL (id) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/delete/folder/' + id,
    method: 'post'
  })
}

/**
 * 校验url是否已存在
 * @param params
 * @returns {*}
 * @constructor
 */
export function CHECK_URL (params) {
  return request({
    url: '/api/bookmark/my-bookmark/bookmark/url/check',
    method: 'post',
    params
  })
}

/**
 * 最近访问
 * @param data
 * @returns {*}
 * @constructor
 */
export function RECENT (data = {}) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/recent',
    method: 'post',
    data
  })
}
/**
 * 保存书签
 * @param data
 * @returns {*}
 * @constructor
 */
export function CREATE_BOOKMARK (data = {}) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/save/bookmark',
    method: 'post',
    data
  })
}

/**
 * 更新书签
 * @param data
 * @returns {*}
 * @constructor
 */
export function UPDATE_BOOKMARK (data = {}) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/update/bookmark',
    method: 'post',
    data
  })
}

/**
 * 保存收藏夹
 * @param data
 * @returns {*}
 * @constructor
 */
export function CREATE_FOLDER (data = {}) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/save/folder',
    method: 'post',
    data
  })
}
/**
 * 更新收藏夹
 * @param data
 * @returns {*}
 * @constructor
 */
export function UPDATE_FOLDER (data = {}) {
  // 接口请求
  return request({
    url: '/api/bookmark/my-bookmark/update/folder',
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
