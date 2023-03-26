<template>
  <div class="system-level container">
    <SearchBar>
      <a-form
        class="search-bar-form"
        :form="form"
        layout="inline"
        autocomplete="off"
      >
        <a-row>
          <a-col>
            <a-form-item label="等级">
              <a-input
                v-decorator="['level', { initialValue: '' }]"
                placeholder="请输入等级"
              ></a-input>
            </a-form-item>
            <a-form-item label="经验值">
              <a-input
                v-decorator="['exp', { initialValue: '' }]"
                placeholder="请输入经验值"
              ></a-input>
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

    <TableBlock title="等级配置">
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
      :levelDetail.sync="levelDetail"
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
  name: 'system-level',
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
      levelDetail: {}
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

    // 获取等级配置
    getLevelConfig(params) {
      this.loading = true
      api
        .getLevelConfig(params)
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

    // 添加等级配置
    addLevelConfig(params, cb) {
      this.addLoading = true
      api
        .addLevelConfig(params)
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

    // 更新等级配置
    updateLevelConfig(params, cb) {
      this.updateLoading = true
      api
        .updateLevelConfig(params)
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

    // 删除等级配置
    deleteLevelConfig(params, cb) {
      this.deleteLoading = true
      api
        .deleteLevelConfig(params)
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
      const { level, exp } = this.form.getFieldsValue()

      this.form.setFieldsValue({
        dayNum: level.trim(),
        donateIntegral: exp.trim()
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
      this.levelDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      this.addLevelConfig(values, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      this.updateLevelConfig(values, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { id, level } = record
      this.$confirm({
        title: `是否删除等级配置【${level}】`,
        onOk: () => {
          this.deleteLevelConfig({ id }, () => {
            this.onSearchClick()
          })
        }
      })
    },

    // 格式化请求参数
    formatParams() {
      const { level, exp } = this.form.getFieldsValue()

      const params = {
        level,
        exp,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }

      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getLevelConfig(params)
    }
  },
  mounted() {
    this.updateList()
  }
}
</script>

<style lang="less">
.system-level {
  .ant-pagination {
    float: right;
    margin: 16px 0;
  }
}
</style>
