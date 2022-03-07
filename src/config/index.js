/* eslint-disable comma-dangle */

export const CONFIG = {
  serveName: process.env.VUE_APP_SERVENAME,
  whiteList: [
    '/sys/role/delete',
    '/sys/role/deleteBatch',
    '/sys/user/delete',
    '/sys/user/deleteBatch',
    '/sys/permission/delete',
    '/sys/permission/deleteBatch',
    '/article/deleteBatch',
    '/marketing/deleteBatch'
  ]
}

export default CONFIG
