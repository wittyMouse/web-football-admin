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
            <a-form-item label="榜单名称">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['type', { initialValue: undefined }]"
                placeholder="请选择榜单名称"
              >
                <a-select-option :value="0">王牌推介榜</a-select-option>
                <a-select-option :value="1">劲爆贴士榜</a-select-option>
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

    <TableBlock title="榜单数据列表">
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
        <template slot="type" slot-scope="text">
          {{ rankingMap[text] }}
        </template>
        <template slot="userId" slot-scope="text">
          {{ userMap[text] }}
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
      :userList="userList"
      @submit="onCreateSubmit"
    />

    <UpdateModal
      :visible.sync="updateModalVisible"
      :rankingDetail.sync="rankingDetail"
      :userList="userList"
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
  name: 'ranking-list',
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
      userListLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      createModalVisible: false,
      updateModalVisible: false,
      rankingDetail: {},
      userList: [],
      rankingMap: {
        0: '王牌推介榜',
        1: '劲爆贴士榜'
      }
    }
  },
  computed: {
    userMap() {
      if (this.userList && this.userList) {
        const userMap = {}
        this.userList.forEach(item => {
          userMap[item.id] = item.realname
        })
        return userMap
      } else {
        return {}
      }
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
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.userListLoading = false
        })
    },

    // 获取榜单分页列表
    getRankingList(params) {
      this.loading = true
      api
        .getRankingList(params)
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

    // 添加榜单数据
    addRanking(params, cb) {
      this.addLoading = true
      api
        .addRanking(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb(res.data)
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.addLoading = false
        })
    },

    // 更新榜单数据
    updateRanking(params, cb) {
      this.updateLoading = true
      api
        .updateRanking(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb(res.data)
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.updateLoading = false
        })
    },

    // 删除榜单数据
    deleteRanking(params, cb) {
      this.deleteLoading = true
      api
        .deleteRanking(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb(res.data)
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
      this.rankingDetail = record
      this.updateModalVisible = true
    },

    // 删除按钮
    onDeleteClick(record) {
      // console.log(record)
      const { id, type, userId } = record
      let message = ''
      switch (type) {
        case 0:
          message = '王牌推介榜'
          break
        case 1:
          message = '劲爆贴士榜'
          break
      }
      this.$confirm({
        title: `是否删除【${message}】，作者【${this.userMap[userId]}】的数据`,
        onOk: () => {
          this.deleteRanking({ id }, () => {
            this.updateList()
          })
        }
      })
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      this.addRanking(values, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      this.updateRanking(values, () => {
        this.updateList()
        this.updateModalVisible = false
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
      this.getRankingList(params)
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
