/**
 * 表单过滤公共方法
 */

/**
 * 只能为数字
 * @param {*} str
 */
export const onlyNumber = str => {
  return new RegExp('^\\d*$').test(str)
}

/**
 * 只能为小数
 * @param {*} str
 */
export const onlyDecimal = str => {
  return new RegExp('^\\d{1,}\\.\\d{1,}$').test(str)
}

/**
 * 只能为数字或小数
 * @param {*} str
 */
export const onlyNumberAndDecimal = str => {
  return onlyNumber(str) || onlyDecimal(str)
}

/**
 * 只能为数字或字母
 * @param {*} str
 */
export const onlyNumberAndletter = str => {
  return new RegExp('^[a-zA-Z0-9]*$').test(str)
}

/**
 * 电子邮箱校验
 * @param {*} str
 */
export const checkEmail = str => {
  return new RegExp('^.+@.+\\..+$').test(str)
}

/**
 * 手机号码校验
 * @param {*} str
 */
export const checkPhone = str => {
  return new RegExp('^\\+?[0-9]*$').test(str)
}

export default {
  onlyNumber,
  onlyDecimal,
  onlyNumberAndDecimal,
  checkEmail,
  checkPhone
}
