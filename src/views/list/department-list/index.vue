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
            <a-form-item label="部门名称">
              <a-input
                v-decorator="['name', { initialValue: '' }]"
                placeholder="请输入部门名称"
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

    <TableBlock title="部门列表">
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        size="middle"
      >
        <template slot="options" slot-scope="text, record">
          <a @click="onDetailClick(record)">查看用户</a>
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

    <UserListModal
      :visible.sync="userListModalVisible"
      :deparimentDetail.sync="deparimentDetail"
      :userList="userList"
    />
  </div>
</template>

<script>
import * as api from '@/api'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'
import UserListModal from './components/UserListModal'

export default {
  name: 'department-list',
  components: {
    UserListModal
  },
  data() {
    return {
      loading: false,
      userListLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      userListModalVisible: false,
      deparimentDetail: {},
      userList: []
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

    // 获取搜索用户列表
    getUserList() {
      this.userListLoading = true
      api
        .getUserList({
          pageNo: 1,
          pageSize: 9999,
          query: {}
        })
        .then(res => {
          if (res.code === 200) {
            this.userList = res.result.records
          } else {
            // todo
          }
        })
        .finally(() => {
          this.userListLoading = false
        })
    },

    // 获取栏目列表
    getDepartmentList(params) {
      this.loading = true
      api
        .getDepartmentList(params)
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

    // 搜索按钮
    onSearchClick() {
      const { name } = this.form.getFieldsValue()
      this.form.setFieldsValue({
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

    // 查看用户按钮
    onDetailClick(record) {
      this.deparimentDetail = record
      this.userListModalVisible = true
    },

    // 格式化请求参数
    formatParams() {
      const formData = this.form.getFieldsValue()
      console.log(formData)

      const params = {
        ...formData,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }

      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getDepartmentList(params)
    }
  },
  mounted() {
    this.getUserList()
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
