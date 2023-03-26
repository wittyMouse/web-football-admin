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
            <a-form-item label="签到日期">
              <a-input
                v-decorator="['dayNum', { initialValue: '' }]"
                placeholder="请输入签到日期"
              ></a-input>
            </a-form-item>
            <a-form-item label="赠送数量">
              <a-input
                v-decorator="['donateIntegral', { initialValue: '' }]"
                placeholder="请输入赠送数量"
              ></a-input>
            </a-form-item>
            <a-form-item label="添加时间">
              <a-range-picker
                v-decorator="['rangeDate', { initialValue: [] }]"
                :show-time="showTime"
                :disabled-date="disabledAfterDate"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              ></a-range-picker>
            </a-form-item>
            <a-form-item label="赠送类型">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['type', { initialValue: '' }]"
                placeholder="请选择类型"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="0">积分</a-select-option>
                <a-select-option :value="1">金币</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" class="text-right">
            <a-button type="primary" icon="search" @click="onSearchClick"
              >搜索</a-button
            >
            <a-button type="primary" icon="reload" @click="onResetClick"
              >重置</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </SearchBar>

    <TableBlock title="签到配置">
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
      :checkInDetail.sync="checkInDetail"
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

const typeMap = ['积分', '金币']

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
      checkInDetail: {}
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

    // 获取签到配置
    getCheckInConfig(params) {
      this.loading = true
      api
        .getCheckInConfig(params)
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

    // 添加签到配置
    addCheckInConfig(params, cb) {
      this.addLoading = true
      api
        .addCheckInConfig(params)
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

    // 更新签到配置
    updateCheckInConfig(params, cb) {
      this.updateLoading = true
      api
        .updateCheckInConfig(params)
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

    // 删除签到配置
    deleteCheckInConfig(params, cb) {
      this.deleteLoading = true
      api
        .deleteCheckInConfig(params)
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
      const { dayNum, donateIntegral } = this.form.getFieldsValue()

      this.form.setFieldsValue({
        dayNum: dayNum.trim(),
        donateIntegral: donateIntegral.trim()
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
      this.checkInDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      this.addCheckInConfig(values, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      this.updateCheckInConfig(values, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { id, dayNum, donateIntegral, type } = record
      this.$confirm({
        title: `是否删除签到配置【签到${dayNum}天赠送${donateIntegral}${typeMap[type]}】`,
        onOk: () => {
          this.deleteCheckInConfig({ id }, () => {
            this.onSearchClick()
          })
        }
      })
    },

    // 格式化请求参数
    formatParams() {
      const {
        dayNum,
        donateIntegral,
        rangeDate,
        type
      } = this.form.getFieldsValue()

      const [createDateBegin, createDateEnd] =
        rangeDate.length > 0 ? rangeDate : ['', '']

      const params = {
        dayNum,
        donateIntegral,
        type,
        createDateBegin,
        createDateEnd,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }

      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getCheckInConfig(params)
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
