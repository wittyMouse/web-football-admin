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
            <a-form-item label="赛事名称">
              <a-input
                v-decorator="['competition', { initialValue: '' }]"
                placeholder="请输入赛事名称"
              ></a-input>
            </a-form-item>
            <a-form-item label="主队">
              <a-input
                v-decorator="['homeTeam', { initialValue: '' }]"
                placeholder="请输入主队"
              ></a-input>
            </a-form-item>
            <a-form-item label="客队">
              <a-input
                v-decorator="['visitingTeam', { initialValue: '' }]"
                placeholder="请输入客队"
              ></a-input>
            </a-form-item>
            <a-form-item label="比分">
              <a-input
                v-decorator="['score', { initialValue: '' }]"
                placeholder="请输入赛事比分"
              ></a-input>
            </a-form-item>
            <a-form-item label="成绩">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['result', { initialValue: '' }]"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="2">赢</a-select-option>
                <a-select-option :value="1">赢半</a-select-option>
                <a-select-option :value="0">走</a-select-option>
                <a-select-option :value="-1">输半</a-select-option>
                <a-select-option :value="-2">输</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="作者"
              v-show="hasAuth(userPermissionMap, $route.name, 'all')"
            >
              <a-input
                v-decorator="['realname', { initialValue: '' }]"
                placeholder="请输入作者名称"
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

    <TableBlock title="至尊推介列表">
      <template #option>
        <a-button type="primary" icon="plus" @click="onAddClick"
          >写推介</a-button
        >
        <a-button
          v-show="selectSize > 0"
          type="danger"
          icon="delete"
          :loading="batchDeleteLoading"
          @click="handleMultipleDeleteClick"
          >批量删除</a-button
        >
      </template>

      <a-alert class="article-list-alert" type="info">
        <template #message>
          <span
            >已选择 <a class="link disabled">{{ selectSize }}</a> 项</span
          >
          <a @click="handleSelectClean">清空</a>
        </template>
      </a-alert>

      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :loading="loading"
        size="middle"
      >
        <template slot="options" slot-scope="text, record">
          <template
            v-if="hasAuth(userPermissionMap, $route.name, 'modifyResult')"
          >
            <a @click="onUpdateResultClick(record)">修改结果</a>
            <a-divider type="vertical" />
          </template>
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
      :userPermissionMap="userPermissionMap"
      @submit="onCreateSubmit"
    />
    <UpdateModal
      :visible.sync="updateModalVisible"
      :recommendDetail.sync="recommendDetail"
      :userList="userList"
      :userPermissionMap="userPermissionMap"
      @submit="onUpdateSubmit"
    />
    <UpdateResultModal
      :visible.sync="updateResultModalVisible"
      :recommendDetail.sync="recommendDetail"
      @submit="onUpdateResultSubmit"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as api from '@/api'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'
import UpdateResultModal from './components/UpdateResultModal'

export default {
  name: 'recommend-list',
  components: {
    CreateModal,
    UpdateModal,
    UpdateResultModal
  },
  data() {
    return {
      loading: false,
      addLoading: false,
      updateLoading: false,
      deleteLoading: false,
      batchDeleteLoading: false,
      updateResultLoading: false,
      userListLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      selectedRowKeys: [],
      createModalVisible: false,
      updateModalVisible: false,
      updateResultModalVisible: false,
      recommendDetail: {},
      userList: []
    }
  },
  computed: {
    ...mapState(['userInfo', 'userPermissionMap']),
    selectSize() {
      return this.selectedRowKeys.length
    }
  },
  mixins: [mixin, dateRange],
  methods: {
    // 选中项发生变化时的回调
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 清空选中项
    handleSelectClean() {
      this.selectedRowKeys = []
    },

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
          query: {},
          pageNo: 1,
          pageSize: 9999
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

    // 获取至尊推介列表
    getRecommendList(params) {
      this.loading = true
      api
        .getRecommendList(params)
        .then(res => {
          if (res.code === 0) {
            this.dataSource = res.result.records.map(item => ({
              ...item,
              publicationTime: this.splitSecond(item.publicationTime)
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

    // 添加至尊推介
    addRecommend(params, cb) {
      this.addLoading = true
      api
        .addRecommend(params)
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

    // 更新至尊推介
    updateRecommend(params, cb) {
      this.updateLoading = true
      api
        .updateRecommend(params)
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

    // 修改至尊推介结果
    setRecommendResult(params, cb) {
      this.updateResultLoading = true
      api
        .setRecommendResult(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.updateResultLoading = false
        })
    },

    // 删除至尊推介
    deleteRecommend(params, cb) {
      this.deleteLoading = true
      api
        .deleteRecommend(params)
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

    // 批量删除至尊推介
    batchDeleteRecommend(params, cb) {
      this.batchDeleteLoading = true
      api
        .batchDeleteRecommend(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.batchDeleteLoading = false
        })
    },

    // 搜索按钮
    onSearchClick() {
      const {
        competition,
        homeTeam,
        visitingTeam,
        score,
        realname
      } = this.form.getFieldsValue()

      this.form.setFieldsValue({
        competition: competition.trim(),
        homeTeam: homeTeam.trim(),
        visitingTeam: visitingTeam.trim(),
        score: score.trim(),
        realname: realname.trim()
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

      if (!this.hasAuth(this.userPermissionMap, this.$route.name, 'all')) {
        const { realname } = this.userInfo
        this.form.setFieldsValue({ realname })
      }
      this.updateList()
    },

    // 添加按钮
    onAddClick() {
      this.getUserList()
      this.createModalVisible = true
    },

    // 批量删除
    handleMultipleDeleteClick() {
      this.$confirm({
        title: '提示',
        content: `确定要删除选中推介吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            ids: this.selectedRowKeys.join(',')
          }
          this.batchDeleteRecommend(params, () => {
            this.selectedRowKeys = []
            this.pagination.current = 1
            this.pagination.pageSize = 10
            this.updateList()
          })
        }
      })
    },

    // 编辑按钮
    onEditClick(record) {
      this.getUserList()
      this.recommendDetail = record
      this.updateModalVisible = true
    },

    // 修改结果按钮
    onUpdateResultClick(record) {
      this.recommendDetail = record
      this.updateResultModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      const params = {
        ...values,
        publicationTime: values.publicationTime + ':00'
      }
      this.addRecommend(params, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      const params = {
        ...values,
        publicationTime: values.publicationTime + ':00'
      }
      this.updateRecommend(params, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 提交修改结果表单
    onUpdateResultSubmit(values) {
      console.log('updateResult', values)
      this.setRecommendResult(values, () => {
        this.updateList()
        this.updateResultModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { id } = record
      this.$confirm({
        title: `是否删除至尊推介`,
        onOk: () => {
          this.deleteRecommend({ id }, () => {
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
      this.getRecommendList(params)
    }
  },
  mounted() {
    if (!this.hasAuth(this.userPermissionMap, this.$route.name, 'all')) {
      const { realname } = this.userInfo
      this.form.setFieldsValue({ realname })
    }

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

.article-list-alert {
  margin: 0 24px 16px;

  .ant-alert-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
