<template>
  <div class="report-game container">
    <SearchBar>
      <a-form
        class="search-bar-form"
        :form="form"
        layout="inline"
        autocomplete="off"
      >
        <a-row>
          <a-col>
            <a-form-item label="公告内容">
              <a-input
                v-decorator="['content', { initialValue: '' }]"
                placeholder="请输入公告内容"
              ></a-input>
            </a-form-item>
            <a-form-item label="过期时间">
              <!-- <a-date-picker
                v-decorator="['expiryDate', { initialValue: '' }]"
                :show-time="showTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择过期时间"
              ></a-date-picker> -->
              <a-range-picker
                v-decorator="['rangeDate', { initialValue: [] }]"
                :show-time="showTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              ></a-range-picker>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="text-right">
            <a-button type="primary" icon="search" @click="onSearchClick">
              搜索
            </a-button>
            <a-button type="primary" icon="reload" @click="onResetClick">
              重置
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </SearchBar>

    <TableBlock title="公告配置">
      <template #option>
        <a-button type="primary" icon="plus" @click="onAddClick">添加</a-button>
      </template>

      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        size="middle"
      >
        <template slot="options" slot-scope="text, record">
          <a @click="onEditClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="onDeleteClick(record)">删除</a>
        </template>
      </a-table>

      <a-pagination
        :current="pagination.current"
        :pageSize="pagination.pageSize"
        :pageSizeOptions="pagination.pageSizeOptions"
        :showQuickJumper="pagination.showQuickJumper"
        :showSizeChanger="pagination.showSizeChanger"
        :showTotal="pagination.showTotal"
        :total="pagination.total"
        @change="handlePaginationChange"
        @showSizeChange="handleShowSizeChange"
      />
    </TableBlock>

    <CreateModal :visible.sync="createModalVisible" @submit="onCreateSubmit" />
    <UpdateModal
      :visible.sync="updateModalVisible"
      :noticeDetail.sync="noticeDetail"
      @submit="onUpdateSubmit"
    />
  </div>
</template>

<script>
import * as api from '@/api'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'

export default {
  name: 'system-recharge',
  components: {
    CreateModal,
    UpdateModal
  },
  data() {
    return {
      loading: false,
      addLoading: false,
      updateLoading: false,
      deleteLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      createModalVisible: false,
      updateModalVisible: false,
      noticeDetail: {}
    }
  },
  mixins: [mixin, dateRange],
  methods: {
    // 页码改变的回调，参数是改变后的页码及每页条数
    handlePaginationChange(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.updateList()
    },

    // pageSize 变化的回调
    handleShowSizeChange(page, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      this.updateList()
    },

    // 获取公告配置
    getNoticeList(params) {
      this.loading = true
      api
        .getNoticeList(params)
        .then(res => {
          if (res.code === 0) {
            this.dataSource = res.result.records
            this.pagination.total = res.result.total
            this.pagination.totalPage = res.result.pages
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 添加公告配置
    addNotice(params, cb) {
      this.addLoading = true
      api
        .addNotice(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.addLoading = false
        })
    },

    // 更新公告配置
    updateNotice(params, cb) {
      this.updateLoading = true
      api
        .updateNotice(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.updateLoading = false
        })
    },

    // 删除公告配置
    deleteNotice(params, cb) {
      this.deleteLoading = true
      api
        .deleteNotice(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.deleteLoading = false
        })
    },

    // 搜索按钮
    onSearchClick() {
      const { content } = this.form.getFieldsValue()

      this.form.setFieldsValue({
        content: content.trim()
      })

      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.updateList()
    },

    // 重置按钮
    onResetClick() {
      this.form.resetFields()
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.updateList()
    },

    // 添加按钮
    onAddClick() {
      this.createModalVisible = true
    },

    // 编辑按钮
    onEditClick(record) {
      this.noticeDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      const params = {
        ...values,
        expiryDate: values.expiryDate + ':00'
      }
      this.addNotice(params, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      const params = {
        ...values,
        expiryDate: values.expiryDate + ':00'
      }
      this.updateNotice(params, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { id, content } = record
      this.$confirm({
        title: `是否删除公告【${content}】`,
        onOk: () => {
          this.deleteNotice({ id }, () => {
            this.onSearchClick()
          })
        }
      })
    },

    // 格式化请求参数
    // formatParams() {
    //   const { content, expiryDate } = this.form.getFieldsValue()

    //   const params = {
    //     content,
    //     expiryDate,
    //     pageNo: this.pagination.current,
    //     pageSize: this.pagination.pageSize
    //   }

    //   return params
    // },

    // 格式化请求参数
    formatParams() {
      const { content, rangeDate } = this.form.getFieldsValue()

      const [expiryDateBegin = '', expiryDateEnd = ''] = rangeDate || []

      const params = {
        content,
        expiryDateBegin,
        expiryDateEnd,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }

      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getNoticeList(params)
    }
  },
  mounted() {
    this.updateList()
  }
}
</script>

<style lang="less">
.report-game {
  .ant-pagination {
    float: right;
    margin: 16px 0;
  }
}
</style>
