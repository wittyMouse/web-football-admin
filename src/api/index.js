import { getAction, postAction } from './manage'

// 获取验证码
export const getCheckCode = currTimestamp =>
  getAction(`/sys/randomImage/${currTimestamp}`)

// 登录
export const login = params => postAction('/sys/login', params)

// 退出
export const logout = () => postAction('/sys/logout')

// 校验GA验证码
export const checkGaCode = params => postAction('/sys/checkGaCode', params)

// 获取用户权限信息
export const queryPermissionsByUser = params =>
  postAction('/sys/permission/getUserPermissionByToken', params)

// 用户管理
export const addUser = params => postAction('/sys/user/add', params)
export const editUser = params => postAction('/sys/user/edit', params)
export const deleteUser = params => postAction('/sys/user/delete', params)
export const deleteBatchUser = params =>
  postAction('/sys/user/deleteBatch', params)
export const queryUserRole = params =>
  getAction('/sys/user/queryUserRole', params)
export const getUserList = params => postAction('/sys/user/list', params)
export const queryAllRole = params => getAction('/sys/role/queryall', params)
export const frozenBatch = params => postAction('/sys/user/frozenBatch', params)
export const changePassword = params =>
  postAction('/sys/user/changePassword', params)
// 重置GA验证码
export const resetGACode = params =>
  postAction('/sys/user/setGaCodeIsNull', params)
// 修改是否使用GA登录
export const updateGALoginStatus = params =>
  postAction('/sys/user/updatdGaStatus', params)
// 更新用户订阅金币
export const updateSubscribeCoin = params =>
  postAction('/sys/user/editAmont', params)

// 角色管理
export const getRoleList = params => postAction('/sys/role/list', params)
export const addRole = params => postAction('/sys/role/add', params)
export const editRole = params => postAction('/sys/role/edit', params)
export const deleteRole = params => postAction('/sys/role/delete', params)
export const deleteRoleList = params =>
  postAction('/sys/role/deleteBatch', params)
export const queryTreeListForRole = params =>
  getAction('/sys/role/queryTreeList', params)
export const queryRolePermission = params =>
  getAction('/sys/permission/queryRolePermission', params)
export const saveRolePermission = params =>
  postAction('/sys/permission/saveRolePermission', params)

// 菜单管理
export const addMenu = params => postAction('/sys/permission/add', params)
export const editMenu = params => postAction('/sys/permission/edit', params)
export const getPermissionList = params =>
  postAction('/sys/permission/list', params)
export const queryTreeList = params =>
  postAction('/sys/permission/queryTreeList', params)
export const deleteMenu = params => postAction('/sys/permission/delete', params)
export const deleteBatchMenu = params =>
  postAction('/sys/permission/deleteBatch', params)

// 文章列表
export const getArticleList = params =>
  postAction('/article/findListByPage', params)
// 添加文章
export const addArticle = params => postAction('/article/add', params)
// 更新文章
export const updateArticle = params => postAction('/article/update', params)
// 删除文章
export const deleteArticle = params => postAction('/article/delete', params)
// 更新文章置顶信息
export const topArticle = params => postAction('/article/updateIsTop', params)
// 更新文章推荐信息
export const recommendArticle = params =>
  postAction('/article/updateIsRecommend', params)

// 栏目列表
export const getColumnList = params =>
  postAction('/column/findListByPage', params)
// 添加栏目
export const addColumn = params => postAction('/column/add', params)
// 更新栏目
export const updateColumn = params => postAction('/column/update', params)
// 删除栏目
export const deleteColumn = params => postAction('/column/delete', params)

// 至尊推介信息列表
export const getRecommendList = params =>
  postAction('/marketing/findListByPage', params)
// 添加至尊推介信息
export const addRecommend = params => postAction('/marketing/add', params)
// 更新至尊推介信息
export const updateRecommend = params => postAction('/marketing/update', params)
// 删除至尊推介信息
export const deleteRecommend = params => postAction('/marketing/delete', params)
// 修改至尊推介结果
export const setRecommendResult = params =>
  postAction('/marketing/setResult', params)

// 会员列表
export const getMemberList = params =>
  postAction('/member/findListByPage', params)
// 会员列表导出
export const exportMemberList = params =>
  postAction('/member/findListByPageExportExcel', params, {
    responseType: 'blob'
  })
// 会员金币充值
export const memberRecharge = params => postAction('/member/recharge', params)
// 会员积分充值
export const integralRecharge = params =>
  postAction('/member/rechargeIntegral', params)
// 更新会员状态
export const updateMemberStatus = params =>
  postAction('/member/updateStatus', params)
// 会员重置密码
export const resetPassword = params =>
  postAction('/member/resetPassword', params)

// 获取节目分类列表
export const getRadioGroupList = params =>
  postAction('/record/findItemGroupList', params)
// 节目列表
export const getRadioList = params =>
  postAction('/record/queryPageList', params)
// 添加节目
export const addRadio = params => postAction('/record/addRecord', params)
// 更新节目
export const updateRadio = params => postAction('/record/updateRecord', params)
// 删除节目
export const deleteRadio = params => postAction('/record/deleteRecord', params)

// 账变记录
export const getOrderRecord = params =>
  postAction('/member/amountChangeListByPage', params)

// 签到记录
export const getCheckRecord = params =>
  postAction('/member/signInRecordListByPage', params)

// 文章购买记录列表信息（贴士报表）
export const getBuyRecord = params =>
  postAction('/member/buyRecordListByPage', params)
// 文章返款
export const refundArticle = params =>
  postAction('/member/refundArticle', params)
// 导出贴士报表
export const exportBuyRecord = params =>
  postAction('/member/buyRecordListByPageExportExcel', params, {
    responseType: 'blob'
  })

// 至尊订阅记录列表信息（推介报表）
export const getSubscribeRecord = params =>
  postAction('/member/subscribeRecordListByPage', params)
// 推介返款
export const refundSubscribe = params =>
  postAction('/member/refundSubscribe', params)
// 导出推介报表
export const exportSubscribeRecord = params =>
  postAction('/member/subscribeRecordListByPageExportExcel', params, {
    responseType: 'blob'
  })

// 文件上传
export const uploadFile = params =>
  postAction('/sys/upload/uploadFile', params, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })

// 获取部门分页列表
export const getDepartmentList = params =>
  postAction('/sys/sysDepart/findListByPage', params)
// 根据部门ID查询用户列表
export const getUserListByDeparment = params =>
  postAction('/sys/sysDepart/findUserListByDepartId', params)
// 添加用户到指定部门
export const addUserToDepartment = params =>
  postAction('/sys/sysDepart/addUserToDepart', params)
// 更新用户在部门的排序号
export const updateUserToDepartment = params =>
  postAction('/sys/sysDepart/updateUserToDepart', params)
// 删除指定部门里的用户
export const deleteUserToDepartment = params =>
  postAction('/sys/sysDepart/delUserToDepart', params)

// 上传图片
export const uploadImage = params =>
  postAction('/sys/upload/uploadQRCode', params)

// 获取重大利好配置
export const getBestNewsConfig = params =>
  postAction('/pageConfig/findId', params)

// 更新重大利好配置
export const updateBestNewsConfig = params =>
  postAction('/pageConfig/update', params)

// 获取充值赠送配置列表
export const getRechargeConfig = params =>
  postAction('/donateConfig/findListByPage', params)

// 添加充值赠送配置
export const addRechargeConfig = params =>
  postAction('/donateConfig/add', params)

// 更新充值赠送配置
export const updateRechargeConfig = params =>
  postAction('/donateConfig/update', params)

// 删除充值赠送配置
export const deleteRechargeConfig = params =>
  postAction('/donateConfig/delete', params)

// 充值记录
export const getRechargeRecord = params =>
  postAction('/member/rechargeRecordListByPage', params)

// 导出充值记录
export const exportRechargeRecord = params =>
  postAction('/member/rechargeRecordListByPageExportExcel', params, {
    responseType: 'blob'
  })

// 获取广告管理
export const getAdvertisementConfig = params =>
  postAction('/adConfig/findListByPage', params)

// 添加广告管理
export const addAdvertisementConfig = params =>
  postAction('/adConfig/add', params)

// 更新广告管理
export const updateAdvertisementConfig = params =>
  postAction('/adConfig/update', params)

// 删除广告管理
export const deleteAdvertisementConfig = params =>
  postAction('/adConfig/delete', params)

// 获取签到配置
export const getCheckInConfig = params =>
  postAction('/signInConfig/findListByPage', params)

// 添加签到配置
export const addCheckInConfig = params =>
  postAction('/signInConfig/add', params)

// 更新签到配置
export const updateCheckInConfig = params =>
  postAction('/signInConfig/update', params)

// 删除签到配置
export const deleteCheckInConfig = params =>
  postAction('/signInConfig/delete', params)

// 获取渠道配置
export const getChannelConfig = params =>
  postAction('/channel/findListByPage', params)

// 添加渠道配置
export const addChannelConfig = params => postAction('/channel/add', params)

// 更新渠道配置
export const updateChannelConfig = params =>
  postAction('/channel/update', params)

// 删除渠道配置
export const deleteChannelConfig = params =>
  postAction('/channel/delete', params)

export default {
  getCheckCode,
  login,
  logout,
  checkGaCode,
  queryPermissionsByUser,

  // 用户管理
  addUser,
  editUser,
  deleteUser,
  deleteBatchUser,
  queryUserRole,
  getUserList,
  queryAllRole,
  frozenBatch,
  changePassword,
  resetGACode,
  updateGALoginStatus,
  updateSubscribeCoin,

  // 角色管理
  addRole,
  editRole,
  deleteRole,
  getRoleList,
  deleteRoleList,
  queryTreeListForRole,
  queryRolePermission,
  saveRolePermission,

  // 菜单管理
  addMenu,
  editMenu,
  getPermissionList,
  queryTreeList,
  deleteMenu,
  deleteBatchMenu,

  // 文章
  getArticleList,
  addArticle,
  updateArticle,
  deleteArticle,
  topArticle,
  recommendArticle,

  // 栏目
  getColumnList,
  addColumn,
  updateColumn,
  deleteColumn,

  // 至尊推介
  getRecommendList,
  addRecommend,
  updateRecommend,
  deleteRecommend,
  setRecommendResult,

  // 会员
  getMemberList,
  exportMemberList,
  memberRecharge,
  integralRecharge,
  updateMemberStatus,
  resetPassword,

  // 节目
  getRadioList,
  addRadio,
  updateRadio,
  deleteRadio,
  getRadioGroupList,

  // 账变记录
  getOrderRecord,

  // 签到记录
  getCheckRecord,

  // 购买记录（贴士报表）
  getBuyRecord,
  refundArticle,
  exportBuyRecord,

  // 订阅记录（推介报表）
  getSubscribeRecord,
  refundSubscribe,
  exportSubscribeRecord,

  // 文件上传
  uploadFile,

  // 部门
  getDepartmentList,
  getUserListByDeparment,
  addUserToDepartment,
  updateUserToDepartment,
  deleteUserToDepartment,

  // 重大利好配置
  getBestNewsConfig,
  updateBestNewsConfig,

  // 充值赠送配置
  getRechargeConfig,
  addRechargeConfig,
  updateRechargeConfig,
  deleteRechargeConfig,

  // 充值记录
  getRechargeRecord,
  exportRechargeRecord,

  // 广告管理
  getAdvertisementConfig,
  addAdvertisementConfig,
  updateAdvertisementConfig,
  deleteAdvertisementConfig,

  // 签到配置
  getCheckInConfig,
  addCheckInConfig,
  updateCheckInConfig,
  deleteCheckInConfig,

  // 渠道配置
  getChannelConfig,
  addChannelConfig,
  updateChannelConfig,
  deleteChannelConfig
}
