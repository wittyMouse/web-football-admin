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
            <a-form-item label="消费时间">
              <a-range-picker
                v-decorator="['rangeDate', { initialValue: [] }]"
                :show-time="showTime"
                :disabled-date="disabledAfterDate"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              ></a-range-picker>
            </a-form-item>
            <a-form-item label="会员账号">
              <a-input
                v-decorator="['account', { initialValue: '' }]"
                placeholder="请输入会员账号"
              ></a-input>
            </a-form-item>
            <a-form-item
              label="作者"
              v-show="hasAuth(userPermissionMap, $route.name, 'all')"
            >
              <a-input
                v-decorator="['realname', { initialValue: '' }]"
                placeholder="请输入作者"
              ></a-input>
            </a-form-item>
            <a-form-item label="标题">
              <a-input
                v-decorator="['articleTitle', { initialValue: '' }]"
                placeholder="请输入标题"
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
            <a-button type="primary" icon="export" @click="onExportClick"
              >导出</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </SearchBar>

    <TableBlock title="贴士分成报表">
      <template #option>
        <a-button type="primary" icon="rollback" @click="onRefundClick"
          >返全款</a-button
        >
      </template>

      <a-alert class="buy-report-alert" type="info">
        <template #message>
          <span
            >已选择 <a class="link disabled">{{ selectSize }}</a> 项</span
          >
          <a @click="handleSelectClean">清空</a>
        </template>
      </a-alert>

      <a-table
        rowKey="buyRecordId"
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

    <ExportModal
      :visible.sync="exportModalVisible"
      :pageSize="pagination.pageSize"
      :total="pagination.total"
      :totalPage="pagination.totalPage"
      @confirm="onExportConfirm"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as api from '@/api'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'
import ExportModal from '@/components/ExportModal'

export default {
  name: 'buy-report',
  components: {
    ExportModal
  },
  data() {
    return {
      loading: false,
      exportLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      exportModalVisible: false,
      // 选中项
      selectedRowKeys: [],
      refundLoading: false
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

    // 获取签到记录
    getBuyRecord(params) {
      this.loading = true
      api
        .getBuyRecord(params)
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

    // 导出文件
    exportBuyRecord(params, cb) {
      this.exportLoading = true
      api
        .exportBuyRecord(params)
        .then(res => {
          console.log(res)
          const url = URL.createObjectURL(res.data)
          const disposition = res.headers['content-disposition']
          let name = ''
          if (disposition.indexOf('filename') > -1) {
            name = disposition
              .split(';')[1]
              .split('=')[1]
              .split('.')
              .map((item, idx) => {
                if (idx === 0) {
                  return decodeURIComponent(item)
                } else {
                  return item
                }
              })
              .join('.')
          }
          cb && cb(url, name)
        })
        .finally(() => {
          this.exportLoading = false
        })
    },

    // 文章返款
    refundArticle(params, cb) {
      this.refundLoading = true
      api
        .refundArticle(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.refundLoading = false
        })
    },

    // 搜索按钮
    onSearchClick() {
      const { account, realname, articleTitle } = this.form.getFieldsValue()
      this.form.setFieldsValue({
        account: account.trim(),
        realname: realname.trim(),
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

    // 导出按钮
    onExportClick() {
      this.exportModalVisible = true
    },

    // 导出确认按钮
    onExportConfirm(size) {
      const params = {
        ...this.formatParams(),
        pageNo: 1,
        pageSize: size
      }
      this.exportBuyRecord(params, (url, name) => {
        this.exportByLink(url, name)
        this.exportModalVisible = false
      })
    },

    // 退款按钮
    onRefundClick() {
      if (this.selectedRowKeys.length === 0) {
        this.$error({
          title: '错误',
          content: '请先选择需要反全款的记录！'
        })
        return
      }

      const buyRecordIds = [...this.selectedRowKeys]

      this.$confirm({
        title: `是否将订单号【${buyRecordIds.join('、')}】全款返回给会员？`,
        onOk: () => {
          this.refundArticle({ buyRecordIds }, () => {
            this.$success({
              title: '成功',
              content: `订单号【${buyRecordIds.join('、')}】返全款成功`
            })
            this.updateList()
          })
        }
      })
    },

    // 格式化请求参数
    formatParams() {
      const {
        account,
        realname,
        articleTitle,
        rangeDate
      } = this.form.getFieldsValue()

      const [buyTimeBegin, buyTimeEnd] =
        rangeDate.length > 0 ? rangeDate : ['', '']

      const params = {
        account,
        realname,
        articleTitle,
        buyTimeBegin,
        buyTimeEnd,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }

      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getBuyRecord(params)
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

.buy-report-alert {
  margin: 0 24px 16px;

  .ant-alert-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
