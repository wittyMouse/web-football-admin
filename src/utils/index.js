/**
 * 通用方法
 */

/**
 * 从 sessionStorage 中取出数据
 * @param {*} key
 */
export function getData(key) {
  return sessionStorage.getItem(key)
}

/**
 * 将数据存入 sessionStorage
 * @param {*} key
 * @param {*} value
 */
export function setData(key, value) {
  sessionStorage.setItem(key, value)
}

/**
 * 移除 sessionStorage 中某条数据
 * @param {*} key
 */
export function removeData(key) {
  sessionStorage.removeItem(key)
}

/**
 * 清空 sessionStorage 中的数据
 */
export function clearData() {
  sessionStorage.clear()
}

/**
 * 获取 token
 */
export function getToken() {
  return getData('token')
}

/**
 * 存储 token
 * @param {*} token
 */
export function setToken(token) {
  return setData('token', token)
}

/**
 * 对象转查询字符串
 * @param {Object} params
 * @param {Boolean} mark 是否加上?
 */
export function objectToQueryString(params, mark) {
  if (typeof params !== 'object') {
    throw new Error('参数错误')
  }
  let queryString = Object.keys(params)
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    })
    .join('&')
  mark && (queryString = `?${queryString}`)
  return queryString
}

/**
 * 查询字符串转对象
 * @param {String} queryString 查询字符串
 */
export function queryStringToObject(queryString) {
  if (typeof queryString !== 'string') {
    throw new Error('参数错误')
  }
  const obj = {}
  queryString
    .replace('?', '')
    .split('&')
    .forEach(item => {
      const arr = item.split('=')
      obj[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1])
    })
  return obj
}

/**
 * 金额格式化
 * @param {*} num
 */
export function amountFormat(num) {
  if (num === undefined || num === null || num === '') return ''
  const val = num + ''
  const arr = val.split('.')
  arr[0] = arr[0].replace(/\d{1,3}(?=(\d{3})+$)/g, s => {
    return s + ','
  })
  return arr.join('.')
}

/**
 * 判断额度显示的颜色
 * @param {*} text
 */
export function getColor(text) {
  const str = text + ''

  if (str === '0') {
    return ''
  }

  if (str.indexOf('-') > -1) {
    return 'red'
  }

  return 'green'
}

/**
 * 隐藏部分手机号
 * @param {*} phone
 */
export function phoneNumberFilter(phone) {
  if (phone) {
    return phone
      .split('')
      .map((item, index, array) => {
        if (index < 3 || index > array.length - 3) {
          return item
        }
        return '*'
      })
      .join('')
  }
  return ''
}

/**
 * 判断是否存在该权限
 * @param {*} userPermissionMap
 * @param {*} routeName
 * @param {*} perms
 */
export function hasAuth(userPermissionMap, routeName, perms) {
  return (
    (userPermissionMap[routeName] && userPermissionMap[routeName][perms]) ||
    false
  )
}

export function findIndexByProp(arr, prop, value) {
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i]
    if (obj[prop] === value) {
      return i
    }
    if (Array.isArray(obj['children'])) {
      const index = findIndexByProp(obj['children'], prop, value)
      if (index !== -1) {
        return [i, index]
      }
    }
  }
  return -1
}
