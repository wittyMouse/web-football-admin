import axios from 'axios'
import qs from 'qs'
import { getData, setData, getToken, clearData } from '@/utils'
import CONFIG from '@/config'
import { Modal } from 'ant-design-vue'

const http = axios.create({})

// Add a request interceptor
http.interceptors.request.use(
  function(config) {
    // Do something before request is sent

    config.url = `/${CONFIG.serveName}${config.url}`

    const token = getToken()
    if (token) {
      config.headers['X-Access-Token'] = token
    }

    if (config.headers['content-type']) {
      return config
    }

    // 白名单内接口使用表单格式传输,否则使用json格式传输
    let isWhiteUrl = false
    const len = CONFIG.whiteList.length
    for (let i = 0; i < len; i++) {
      const url = CONFIG.whiteList[i]
      if (config.url.indexOf(`/${CONFIG.serveName}${url}`) > -1) {
        isWhiteUrl = true
        break
      }
    }

    if (isWhiteUrl) {
      config.transformRequest = [
        function(data) {
          // Do whatever you want to transform the data

          return qs.stringify(data)
        }
      ]

      console.log('request', config)

      return config
    }

    console.log('request', config)

    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
http.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    if (response.data.code === 501) {
      const tokentimeout = getData('tokentimeout')
      if (tokentimeout) {
        return
      }
      setData('tokentimeout', 1)
      Modal.error({
        title: '错误',
        content: '登录状态已失效，点击确定重新登录',
        keyboard: false,
        onOk: () => {
          clearData()
          location.href =
            process.env.NODE_ENV === 'production'
              ? `/${process.env.VUE_SECOND_HOST}`
              : `/test-${process.env.VUE_SECOND_HOST}`
        }
      })
    }

    if (response.headers['content-disposition']) {
      console.log('response', response)
      return response
    }

    console.log('response', response.data)

    return response.data
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default http
