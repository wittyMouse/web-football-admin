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
            <a-form-item label="会员账号">
              <a-input
                v-decorator="['account', { initialValue: '' }]"
                placeholder="请输入会员账号"
              ></a-input>
            </a-form-item>
            <a-form-item label="会员昵称">
              <a-input
                v-decorator="['nickname', { initialValue: '' }]"
                placeholder="请输入会员昵称"
              ></a-input>
            </a-form-item>
            <a-form-item label="变更类型">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['type', { initialValue: '' }]"
                placeholder="请选择变更类型"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="0">充值</a-select-option>
                <a-select-option :value="1">购买文章</a-select-option>
                <a-select-option :value="2">至尊推荐</a-select-option>
                <a-select-option :value="7">购买文章推介</a-select-option>
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

    <TableBlock title="账变记录">
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
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
  </div>
</template>

<script>
import * as api from '@/api'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'

export default {
  name: 'order-record',
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: []
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

    // 获取账变记录
    getOrderRecord(params) {
      this.loading = true
      api
        .getOrderRecord(params)
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
      const { account, nickname } = this.form.getFieldsValue()
      this.form.setFieldsValue({
        account: account.trim(),
        nickname: nickname.trim()
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
      this.getOrderRecord(params)
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
