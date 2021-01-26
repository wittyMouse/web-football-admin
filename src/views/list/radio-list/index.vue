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
            <a-form-item label="节目类型">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['itemId', { initialValue: '' }]"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="item in radioGroupList"
                  :key="item.itemId"
                  >{{ item.itemName }}</a-select-option
                >
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

    <TableBlock title="节目列表">
      <template #option>
        <a-button type="primary" icon="plus" @click="onAddClick">添加</a-button>
      </template>

      <a-table
        rowKey="recordId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        size="middle"
      >
        <template slot="itemId" slot-scope="text">
          {{ radioGroupMap[text] }}
        </template>

        <template slot="filePath" slot-scope="text">
          <audio :src="text" controls="controls"></audio>
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
      :radioGroupList="radioGroupList"
      @submit="onCreateSubmit"
    />
    <UpdateModal
      :visible.sync="updateModalVisible"
      :radioDetail.sync="radioDetail"
      :radioGroupList="radioGroupList"
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
  name: 'radio-list',
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
      radioGroupListloading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      createModalVisible: false,
      updateModalVisible: false,
      radioDetail: {},
      radioGroupList: []
    }
  },
  computed: {
    radioGroupMap() {
      const radioGroupMap = {}
      this.radioGroupList.forEach(item => {
        const { itemId, itemName } = item
        radioGroupMap[itemId] = itemName
      })
      return radioGroupMap
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

    // 获取节目分类列表
    getRadioGroupList() {
      this.radioGroupListloading = true
      api
        .getRadioGroupList()
        .then(res => {
          if (res.code === 0) {
            this.radioGroupList = res.result
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.radioGroupListloading = false
        })
    },

    // 获取节目列表
    getRadioList(params) {
      this.loading = true
      api
        .getRadioList(params)
        .then(res => {
          if (res.code === 0) {
            this.dataSource = res.result.records.map(item => ({
              ...item,
              recordTime: this.splitSecond(item.recordTime)
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

    // 添加节目
    addRadio(params, cb) {
      this.addLoading = true
      api
        .addRadio(params)
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

    // 更新节目
    updateRadio(params, cb) {
      this.updateLoading = true
      api
        .updateRadio(params)
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

    // 删除节目
    deleteRadio(params, cb) {
      this.deleteLoading = true
      api
        .deleteRadio(params)
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
      // const { itemId } = this.form.getFieldsValue()
      // this.form.setFieldsValue({
      //   itemId: itemId.trim()
      // })

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
      this.radioDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateSubmit(values) {
      console.log('create', values)
      const params = {
        ...values,
        recordTime: values.recordTime + ':00'
      }
      this.addRadio(params, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateSubmit(values) {
      console.log('update', values)
      const params = {
        ...values,
        recordTime: values.recordTime + ':00'
      }
      this.updateRadio(params, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      console.log(record)
      const { recordId } = record
      this.$confirm({
        title: `是否删除节目`,
        onOk: () => {
          this.deleteRadio({ recordId }, () => {
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
      this.getRadioList(params)
    }
  },
  mounted() {
    this.getRadioGroupList()
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
