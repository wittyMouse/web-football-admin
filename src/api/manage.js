/**
 * 请求管理方法
 */

import http from '@/utils/axios'

// get
export function getAction(url, params, config = {}) {
  return http.get(url, { params, ...config })
}

// post
export function postAction(url, data, config) {
  return http.post(url, data, config)
}

export default {
  getAction,
  postAction
}
