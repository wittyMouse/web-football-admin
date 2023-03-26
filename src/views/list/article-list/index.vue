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
            <a-form-item
              label="作者"
              v-show="hasAuth(userPermissionMap, $route.name, 'all')"
            >
              <a-input
                v-decorator="['realname', { initialValue: '' }]"
                placeholder="请输入作者名称"
              ></a-input>
            </a-form-item>
            <a-form-item label="分类">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['channelId', { initialValue: undefined }]"
                placeholder="请选择分类"
              >
                <a-select-option
                  v-for="item in channelList"
                  :key="item.channelId"
                  >{{ item.channelName }}</a-select-option
                >
              </a-select>
            </a-form-item>
            <a-form-item label="栏目">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['columnId', { initialValue: undefined }]"
                placeholder="请选择栏目"
              >
                <a-select-option
                  v-for="item in columnList"
                  :key="item.columnId"
                  >{{ item.columnName }}</a-select-option
                >
              </a-select>
            </a-form-item>
            <a-form-item label="文章标题">
              <a-input
                v-decorator="['articleTitle', { initialValue: '' }]"
                placeholder="请输入文章标题"
              ></a-input>
            </a-form-item>
            <!-- <a-form-item label="置顶">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['isTop', { initialValue: '' }]"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="推荐">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['isRecommend', { initialValue: '' }]"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item> -->
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

    <TableBlock title="文章列表">
      <template #option>
        <a-button type="primary" icon="plus" @click="onAddClick"
          >写文章</a-button
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
          <a @click="onEditClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="onDeleteClick(record)">删除</a>
          <!-- <template
            v-if="
              hasAuth(userPermissionMap, $route.name, 'top') ||
                hasAuth(userPermissionMap, $route.name, 'recommend')
            "
          >
            <a-divider type="vertical" />
            <a-dropdown>
              <a>更多 <a-icon type="down"/></a>
              <a-menu slot="overlay">
                <a-menu-item
                  v-show="hasAuth(userPermissionMap, $route.name, 'top')"
                >
                  <a @click="onTopClick(record)">{{
                    record.isTop ? '取消置顶' : '置顶'
                  }}</a>
                </a-menu-item>
                <a-menu-item
                  v-show="hasAuth(userPermissionMap, $route.name, 'recommend')"
                >
                  <a @click="onRecommendClick(record)">{{
                    record.isRecommend ? '取消推荐' : '推荐'
                  }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template> -->
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
      :columnList="columnList"
      :userList="userList"
      :userPermissionMap="userPermissionMap"
      @submit="onCreateSubmit"
    />
    <UpdateModal
      :visible.sync="updateModalVisible"
      :articleDetail.sync="articleDetail"
      :columnList="columnList"
      :userList="userList"
      :userPermissionMap="userPermissionMap"
      @submit="onUpdateSubmit"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as api from '@/api'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'
import { channelList } from './config'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'

export default {
  name: 'article-list',
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
      batchDeleteLoading: false,
      topLoading: false,
      recommendLoading: false,
      columnListLoading: false,
      userListLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      // 选中项
      selectedRowKeys: [],
      createModalVisible: false,
      updateModalVisible: false,
      articleDetail: {},
      channelList,
      columnList: [],
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

    // 获取栏目列表
    getColumnList() {
      this.columnListLoading = true
      api
        .getColumnList({
          pageNo: 1,
          pageSize: 9999
        })
        .then(res => {
          if (res.code === 0) {
            this.columnList = res.result.records
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.columnListLoading = false
        })
    },

    // 查询用户列表
    getUserList() {
      const params = {
        query: {},
        pageNo: 1,
        pageSize: 9999
      }
      this.userListLoading = true
      api
        .getUserList(params)
        .then(res => {
          if (res.success) {
            this.userList = res.result.records
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.userListLoading = false
        })
    },

    // 获取文章列表
    getArticleList(params) {
      this.loading = true
      api
        .getArticleList(params)
        .then(res => {
          if (res.code === 0) {
            this.dataSource = res.result.records.map(item => ({
              ...item,
              disclosureTime: this.splitSecond(item.disclosureTime),
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

    // 添加文章
    addArticle(params, cb) {
      this.addLoading = true
      api
        .addArticle(params)
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

    // 更新文章
    updateArticle(params, cb) {
      this.updateLoading = true
      api
        .updateArticle(params)
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

    // 删除文章
    deleteArticle(params, cb) {
      this.deleteLoading = true
      api
        .deleteArticle(params)
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

    // 批量删除文章
    batchDeleteArticle(params, cb) {
      this.batchDeleteLoading = true
      api
        .batchDeleteArticle(params)
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

    // 更新文章置顶信息
    topArticle(params, cb) {
      this.topLoading = true
      api
        .topArticle(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.topLoading = false
        })
    },

    // 更新文章推荐信息
    recommendArticle(params, cb) {
      this.recommendLoading = true
      api
        .recommendArticle(params)
        .then(res => {
          if (res.code === 0) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.recommendLoading = false
        })
    },

    // 搜索按钮
    onSearchClick() {
      const { articleTitle } = this.form.getFieldsValue()
      this.form.setFieldsValue({
        articleTitle: articleTitle.trim()
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
        content: `确定要删除选中文章吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            ids: this.selectedRowKeys.join(',')
          }
          this.batchDeleteArticle(params, () => {
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
      record.channelId = record.channelId + ''
      this.articleDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      const params = {
        ...values,
        disclosureTime: values.disclosureTime + ':00',
        publicationTime: values.publicationTime + ':00'
      }
      this.addArticle(params, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      const params = {
        ...values,
        disclosureTime: values.disclosureTime + ':00',
        publicationTime: values.publicationTime + ':00'
      }
      this.updateArticle(params, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 置顶按钮
    onTopClick(record) {
      const { id, articleTitle, isTop } = record
      this.$confirm({
        title: `是否将文章【${articleTitle}】${isTop ? '取消置顶' : '置顶'}`,
        onOk: () => {
          this.topArticle({ id, isTop: isTop ? 0 : 1 }, () => {
            this.updateList()
          })
        }
      })
    },

    // 推荐按钮
    onRecommendClick(record) {
      const { id, articleTitle, isRecommend } = record
      this.$confirm({
        title: `是否将文章【${articleTitle}】设为${
          isRecommend ? '正常' : '推荐'
        }`,
        onOk: () => {
          this.recommendArticle(
            { id, isRecommend: isRecommend ? 0 : 1 },
            () => {
              this.updateList()
            }
          )
        }
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      const { id, articleTitle } = record
      this.$confirm({
        title: `是否删除文章【${articleTitle}】`,
        onOk: () => {
          this.deleteArticle({ id }, () => {
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
      this.getArticleList(params)
    }
  },
  mounted() {
    if (!this.hasAuth(this.userPermissionMap, this.$route.name, 'all')) {
      const { realname } = this.userInfo
      this.form.setFieldsValue({ realname })
    }

    this.getColumnList()
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
