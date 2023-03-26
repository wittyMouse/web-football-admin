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
            <a-form-item label="类型">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['type', { initialValue: undefined }]"
                placeholder="请选择类型"
              >
                <a-select-option v-for="item in typeList" :key="item.typeId">
                  {{ item.typeName }}
                </a-select-option>
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

    <TableBlock title="会员发布列表">
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
          <div class="member-share-list-image">
            <img :src="text" alt="image" />
          </div>
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
      :memberList="memberList"
      @submit="onCreateSubmit"
    />
    <UpdateModal
      :visible.sync="updateModalVisible"
      :memberList="memberList"
      :memberShareDetail.sync="memberShareDetail"
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
import { typeList } from './config'

export default {
  name: 'member-share-list',
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
      memberListLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      createModalVisible: false,
      updateModalVisible: false,
      memberShareDetail: {},
      typeList,
      memberList: []
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

    // 获取会员发布列表
    getMemberShareList(params) {
      this.loading = true
      api
        .getMemberShareList(params)
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

    // 查询用户列表
    getMemberList() {
      const params = {
        query: {},
        pageNo: 1,
        pageSize: 9999
      }
      this.memberListLoading = true
      api
        .getMemberList(params)
        .then(res => {
          if (res.success) {
            this.memberList = res.result.records
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.memberListLoading = false
        })
    },

    // 添加会员发布
    addMemberShare(params, cb) {
      this.addLoading = true
      api
        .addMemberShare(params)
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

    // 更新会员发布
    updateMemberShare(params, cb) {
      this.updateLoading = true
      api
        .updateMemberShare(params)
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

    // 删除会员发布
    deleteMemberShare(params, cb) {
      this.deleteLoading = true
      api
        .deleteMemberShare(params)
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
      const { columnName } = this.form.getFieldsValue()
      this.form.setFieldsValue({
        columnName: columnName.trim()
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
      this.getMemberList()
      this.createModalVisible = true
    },

    // 编辑按钮
    onEditClick(record) {
      this.getMemberList()
      record.type = record.type + ''
      this.memberShareDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      this.addMemberShare(values, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      this.updateMemberShare(values, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { id } = record
      this.$confirm({
        // title: `是否删除会员发布【${columnName}】`,
        title: `是否删除选中会员发布`,
        onOk: () => {
          this.deleteMemberShare({ id }, () => {
            this.updateList()
          })
        }
      })
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
      this.getMemberShareList(params)
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

.member-share-list-image {
  margin: 0 auto;
  width: 80px;
  height: auto;
  font-size: 0;
  // object-fit: fill;

  & img {
    width: 100%;
    height: 100%;
  }
}
</style>
