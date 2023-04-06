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
            <a-form-item label="分类">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['channelId', { initialValue: undefined }]"
                placeholder="请选择分类"
              >
                <a-select-option
                  v-for="(item, index) in channelList"
                  :key="index"
                >
                  {{ item.channelName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="有效时间">
              <a-range-picker
                v-decorator="['rangeDate', { initialValue: [] }]"
                :show-time="showTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              ></a-range-picker>
            </a-form-item>
            <a-form-item label="权重">
              <a-input
                v-decorator="['weight', { initialValue: '' }]"
                placeholder="请输入权重"
              ></a-input>
            </a-form-item>
            <a-form-item label="名称">
              <a-input
                v-decorator="['name', { initialValue: '' }]"
                placeholder="请输入名称"
              ></a-input>
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

    <TableBlock title="广告管理">
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
        <template slot="imageUrl" slot-scope="text">
          <img class="system-advertisement-image" :src="text" alt="image" />
        </template>

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

    <CreateModal
      :visible.sync="createModalVisible"
      :channelList="channelList"
      @submit="onCreateSubmit"
    />

    <UpdateModal
      :visible.sync="updateModalVisible"
      :advertisementDetail.sync="advertisementDetail"
      :channelList="channelList"
      @submit="onUpdateSubmit"
    />
  </div>
</template>

<script>
import * as api from '@/api'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'
import { channelList } from './config'
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
      advertisementDetail: {},
      channelList
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

    // 获取广告管理
    getAdvertisementConfig(params) {
      this.loading = true
      api
        .getAdvertisementConfig(params)
        .then(res => {
          if (res.code === 0) {
            this.dataSource = res.result.records.map(item => ({
              ...item,
              expiryDate: this.splitSecond(item.expiryDate)
            }))
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

    // 添加广告管理
    addAdvertisementConfig(params, cb) {
      this.addLoading = true
      api
        .addAdvertisementConfig(params)
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

    // 更新广告管理
    updateAdvertisementConfig(params, cb) {
      this.updateLoading = true
      api
        .updateAdvertisementConfig(params)
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

    // 删除广告管理
    deleteAdvertisementConfig(params, cb) {
      this.deleteLoading = true
      api
        .deleteAdvertisementConfig(params)
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
      const { weight, name } = this.form.getFieldsValue()

      this.form.setFieldsValue({
        weight: weight.trim(),
        name: name.trim()
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
      this.advertisementDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      const params = {
        ...values,
        expiryDate: values.expiryDate + ':00'
      }
      this.addAdvertisementConfig(params, () => {
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
      this.updateAdvertisementConfig(params, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { id, location, name } = record
      this.$confirm({
        title: `是否删除${location}位置的广告【${name}】`,
        onOk: () => {
          this.deleteAdvertisementConfig({ id }, () => {
            this.updateList()
          })
        }
      })
    },

    // 格式化请求参数
    formatParams() {
      const { rangeDate, weight, name } = this.form.getFieldsValue()

      const [expiryDateBegin = '', expiryDateEnd = ''] = rangeDate || []

      const params = {
        weight,
        name,
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
      this.getAdvertisementConfig(params)
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

.system-advertisement-image {
  display: block;
  margin: 0 auto;
  max-width: 200px;
  max-height: 100%;
  // object-fit: fill;
}
</style>
