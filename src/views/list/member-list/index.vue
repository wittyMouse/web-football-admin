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
            <a-form-item label="会员账户">
              <a-input
                v-decorator="['account', { initialValue: '' }]"
                placeholder="请输入会员账户"
              ></a-input>
            </a-form-item>
            <a-form-item label="会员昵称">
              <a-input
                v-decorator="['nickname', { initialValue: '' }]"
                placeholder="请输入会员昵称"
              ></a-input>
            </a-form-item>
            <a-form-item label="会员状态">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['status', { initialValue: '' }]"
                placeholder="请选择会员状态"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">限制</a-select-option>
                <a-select-option :value="2">正常</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="最后登录">
              <a-range-picker
                v-decorator="['rangeDate', { initialValue: [] }]"
                :show-time="showTime"
                :disabled-date="disabledAfterDate"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              ></a-range-picker>
            </a-form-item>
            <a-form-item label="手机号码">
              <a-input
                v-decorator="['mobile', { initialValue: '' }]"
                placeholder="请输入手机号码"
              ></a-input>
            </a-form-item>
            <a-form-item label="渠道">
              <a-select
                :style="{ width: '174px' }"
                v-decorator="['channelId', { initialValue: '' }]"
                placeholder="请选择"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="item in channelList"
                  :key="item.channelId"
                  >{{ item.channelName }}</a-select-option
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
            <a-button type="primary" icon="export" @click="onExportClick"
              >导出</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </SearchBar>

    <TableBlock title="会员列表">
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{ x: 1810 }"
        :pagination="false"
        :loading="loading"
        size="middle"
      >
        <template slot="mobile" slot-scope="text">{{
          hasAuth(userPermissionMap, $route.name, 'fullPhone')
            ? text
            : phoneNumberFilter(text)
        }}</template>

        <template slot="options" slot-scope="text, record">
          <a @click="onUpdateClick(record)">修改会员信息</a>
          <a-divider type="vertical" />
          <a @click="onTableClick('points', record)">积分充值</a>
          <a-divider type="vertical" />
          <a @click="onTableClick('coin', record)">金币充值</a>
          <a-divider type="vertical" />
          <a @click="onTableClick('experience', record)">经验值修改</a>
          <a-divider type="vertical" />
          <a @click="onTableClick('free', record)">赠送推介</a>
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

    <ExportModal
      :visible.sync="exportModalVisible"
      :pageSize="pagination.pageSize"
      :total="pagination.total"
      :totalPage="pagination.totalPage"
      @confirm="onExportConfirm"
    />

    <UpdateModal
      :visible.sync="updateModalVisible"
      :memberDetail.sync="memberDetail"
      :loading="resetPasswordLoading"
      :userPermissionMap="userPermissionMap"
      @submit="onUpdateSubmit"
      @reset="onResetPassword"
    />

    <RechargeModal
      :visible.sync="rechargeModalVisible"
      :target="target"
      :memberDetail.sync="memberDetail"
      @submit="onRechargeSubmit"
    />

    <RechargeInfoModal
      :visible.sync="rechargeInfoModalVisible"
      :target="target"
      :rechargeInfo.sync="rechargeInfo"
    />

    <FreeRecommendModal
      :visible.sync="freeRecommendModalVisible"
      :memberDetail.sync="memberDetail"
      :userList="userList"
      @submit="onFreeRecommendSubmit"
    />

    <ExperienceModal
      :visible.sync="experienceModalVisible"
      :member-detail.sync="memberDetail"
      :level-list.sync="levelList"
      @submit="onExperienceSubmit"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as api from '@/api'
import { phoneNumberFilter } from '@/utils'
import mixin from '@/mixins'
import dateRange from '@/mixins/dateRange'
import columns from './columns'
import ExportModal from '@/components/ExportModal'
import UpdateModal from './components/UpdateModal'
import RechargeModal from './components/RechargeModal'
import RechargeInfoModal from './components/RechargeInfoModal'
import FreeRecommendModal from './components/FreeRecommendModal'
import ExperienceModal from './components/ExperienceModal'

export default {
  name: 'member-list',
  components: {
    ExportModal,
    UpdateModal,
    RechargeModal,
    RechargeInfoModal,
    FreeRecommendModal,
    ExperienceModal
  },
  data() {
    return {
      loading: false,
      rechargeLoading: false,
      integralRechargeLoading: false,
      updateLoading: false,
      exportLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      exportModalVisible: false,
      updateModalVisible: false,
      rechargeModalVisible: false,
      rechargeInfoModalVisible: false,
      freeRecommendModalVisible: false,
      experienceModalVisible: false,
      memberDetail: {},
      channelListloading: false,
      channelList: [],
      resetPasswordLoading: false,
      target: '',
      rechargeInfo: {},
      userListLoading: false,
      userList: [],
      freeReommendLoading: false,
      changeExperienceLoading: false,
      levelList: []
    }
  },
  computed: {
    ...mapState(['userPermissionMap'])
  },
  mixins: [mixin, dateRange],
  methods: {
    phoneNumberFilter,

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

    // 获取会员列表
    getMemberList(params) {
      this.loading = true
      api
        .getMemberList(params)
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
    exportMemberList(params, cb) {
      this.exportLoading = true
      api
        .exportMemberList(params)
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

    // 获取渠道配置
    getChannelConfig() {
      this.channelListloading = true
      api
        .getChannelConfig({
          pageNo: 1,
          pageSize: 9999
        })
        .then(res => {
          if (res.code === 0) {
            this.channelList = res.result.records
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.channelListloading = false
        })
    },

    // 重置密码
    resetPassword(params, cb) {
      this.resetPasswordLoading = true
      api
        .resetPassword(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.resetPasswordLoading = false
        })
    },

    // 修改会员状态
    updateMemberStatus(params, cb) {
      this.updateLoading = true
      api
        .updateMemberStatus(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.updateLoading = false
        })
    },

    // 会员充值
    memberRecharge(params, cb) {
      this.rechargeLoading = true
      api
        .memberRecharge(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb(res.result)
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.rechargeLoading = false
        })
    },

    // 积分充值
    integralRecharge(params, cb) {
      this.integralRechargeLoading = true
      api
        .integralRecharge(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb(res.result)
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.integralRechargeLoading = false
        })
    },

    // 查询用户列表
    getUserList() {
      this.userListLoading = true
      api
        .getUserList({
          pageNo: 1,
          pageSize: 9999,
          query: {}
        })
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

    // 赠送推介
    freeReommend(params, cb) {
      this.freeReommendLoading = true
      api
        .freeReommend(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb(res.result)
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.freeReommendLoading = false
        })
    },

    // 获取等级配置
    getLevelConfig() {
      const data = {
        pageNo: 1,
        pageSize: 9999
      }
      api.getLevelConfig(data).then(res => {
        if (res.code === 0) {
          this.levelList = res.result.records
        }
      })
    },

    // 经验值修改
    changeExperience(params, cb) {
      this.changeExperienceLoading = true
      api
        .changeExperience(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb(res.result)
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.changeExperienceLoading = false
        })
    },

    // 搜索按钮
    onSearchClick() {
      const { account, nickname, mobile } = this.form.getFieldsValue()
      this.form.setFieldsValue({
        account: account.trim(),
        nickname: nickname.trim(),
        mobile: mobile.trim()
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
      this.exportMemberList(params, (url, name) => {
        this.exportByLink(url, name)
        this.exportModalVisible = false
      })
    },

    // 修改会员状态
    onUpdateClick(record) {
      this.memberDetail = record
      this.updateModalVisible = true
    },

    // 充值按钮
    onTableClick(target, record) {
      this.memberDetail = record
      switch (target) {
        case 'points':
        case 'coin':
          // 积分/金币充值
          this.target = target
          this.rechargeModalVisible = true
          break
        case 'free':
          // 赠送推介
          this.freeRecommendModalVisible = true
          break
        case 'experience':
          // 经验值修改
          this.getLevelConfig()
          this.experienceModalVisible = true
          break
      }
    },

    // 点击重置密码
    onResetPassword({ id }) {
      // console.log(id)
      const params = { id }
      this.resetPassword(params, () => {
        this.$success({
          title: '提示',
          content: '用户密码重置成功，默认密码为：123456'
        })
      })
    },

    // 提交修改会员状态表单
    onUpdateSubmit(values) {
      console.log('update', values)
      this.updateMemberStatus(values, () => {
        this.updateList()
        this.updateModalVisible = false
        this.$success({
          title: '提示',
          content: '用户信息修改成功'
        })
      })
    },

    // 提交充值表单
    onRechargeSubmit(values) {
      console.log('recharge', values)
      const {
        memberId,
        account,
        nickname,
        balance,
        integral
      } = this.memberDetail
      const rechargeInfo = {
        memberId,
        account,
        nickname
      }
      switch (this.target) {
        case 'points':
          // 充值积分
          rechargeInfo.beforeValue = integral
          rechargeInfo.value = values.integral
          this.integralRecharge(values, res => {
            rechargeInfo.orderId = res.orderId
            rechargeInfo.afterValue = res.balance
            this.updateList()
            this.rechargeModalVisible = false
            this.rechargeInfo = rechargeInfo
            this.rechargeInfoModalVisible = true
          })
          break
        case 'coin':
          // 充值金币
          rechargeInfo.beforeValue = balance
          rechargeInfo.value = values.balance
          rechargeInfo.type = values.type
          this.memberRecharge(values, res => {
            rechargeInfo.orderId = res.orderId
            rechargeInfo.afterValue = res.balance
            this.updateList()
            this.rechargeModalVisible = false
            this.rechargeInfo = rechargeInfo
            this.rechargeInfoModalVisible = true
          })
          break
      }
    },

    // 赠送推介提交
    onFreeRecommendSubmit(values) {
      // console.log('freeRecommend', values)
      this.freeReommend(values, () => {
        this.updateList()
        this.freeRecommendModalVisible = false
        this.$success({
          title: '提示',
          content: '赠送推介成功'
        })
      })
    },

    // 经验值修改提交
    onExperienceSubmit(values) {
      this.changeExperience(values, () => {
        this.updateList()
        this.experienceModalVisible = false
        this.$success({
          title: '提示',
          content: '经验值修改成功'
        })
      })
    },

    // 格式化请求参数
    formatParams() {
      const {
        account,
        nickname,
        status,
        rangeDate,
        mobile,
        channelId
      } = this.form.getFieldsValue()

      const [lastLoginTimeBegin, lastLoginTimeEnd] =
        rangeDate.length > 0 ? rangeDate : ['', '']

      const params = {
        account,
        nickname,
        status,
        mobile,
        channelId,
        lastLoginTimeBegin,
        lastLoginTimeEnd,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }

      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getMemberList(params)
    }
  },
  mounted() {
    this.getChannelConfig()
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
