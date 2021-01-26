import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)

const { success, error, info } = Vue.prototype.$message

Vue.prototype.$_message = {
  success: content => {
    const config = { content, key: 'success' }
    success(config)
  },
  error: content => {
    const config = { content, key: 'error' }
    error(config)
  },
  info: content => {
    const config = { content, key: 'info' }
    info(config)
  }
}
