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
            <a-form-item label="充值数量">
              <a-input
                v-decorator="['rechargeAmount', { initialValue: '' }]"
                placeholder="请输入充值数量"
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

    <TableBlock title="充值赠送配置">
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
      :rechargeDetail.sync="rechargeDetail"
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
      rechargeDetail: {}
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

    // 获取充值赠送配置
    getRechargeConfig(params) {
      this.loading = true
      api
        .getRechargeConfig(params)
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

    // 添加充值赠送配置
    addRechargeConfig(params, cb) {
      this.addLoading = true
      api
        .addRechargeConfig(params)
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

    // 更新充值赠送配置
    updateRechargeConfig(params, cb) {
      this.updateLoading = true
      api
        .updateRechargeConfig(params)
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

    // 删除充值赠送配置
    deleteRechargeConfig(params, cb) {
      this.deleteLoading = true
      api
        .deleteRechargeConfig(params)
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
      const { rechargeAmount, donateIntegral } = this.form.getFieldsValue()

      this.form.setFieldsValue({
        rechargeAmount: rechargeAmount.trim(),
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
      this.rechargeDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      this.addRechargeConfig(values, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      this.updateRechargeConfig(values, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { id, rechargeAmount, donateIntegral, type } = record
      this.$confirm({
        title: `是否删除充值赠送配置【充${rechargeAmount}送${donateIntegral}${typeMap[type]}】`,
        onOk: () => {
          this.deleteRechargeConfig({ id }, () => {
            this.onSearchClick()
          })
        }
      })
    },

    // 格式化请求参数
    formatParams() {
      const {
        rechargeAmount,
        donateIntegral,
        rangeDate,
        type
      } = this.form.getFieldsValue()

      const [createDateBegin, createDateEnd] =
        rangeDate.length > 0 ? rangeDate : ['', '']

      const params = {
        rechargeAmount,
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
      this.getRechargeConfig(params)
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
