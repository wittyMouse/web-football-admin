import cloneDeep from 'lodash/cloneDeep'
import { hasAuth } from '@/utils'
import SearchBar from '@/components/SearchBar'
import TableBlock from '@/components/TableBlock'

export default {
  data() {
    return {
      // 分页数据
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '100', '500', '1000'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
        total: 0,
        totalPage: 0
      },

      // 排序数据
      sorter: ''
    }
  },
  methods: {
    // 判断是否存在该权限
    hasAuth,

    // 复制columns
    copyColumns(columns) {
      return cloneDeep(columns)
    },

    // 菜单渲染父节点
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode || document.body
    },

    // 定义浮层的容器，默认为 body 上新建 div
    getCalendarContainer(trigger) {
      return trigger.parentNode || document.body
    },

    // 通过 a 标签导出文件
    exportByLink(url, name) {
      const link = document.createElement('a')
      link.href = url
      link.style.display = 'none'
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },

    // 时间去掉秒
    splitSecond(time) {
      if (time) {
        return time.slice(0, time.lastIndexOf(':'))
      }
      return ''
    }
  },
  components: {
    SearchBar,
    TableBlock
  }
}
