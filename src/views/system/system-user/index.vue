<template>
  <div class="system-user container">
    <SearchBar>
      <UserSearchForm
        ref="user-search-form"
        @search="handleSearchClick"
        @reset="handleResetClick"
      />
    </SearchBar>

    <TableBlock title="用户管理">
      <template #option>
        <a-button
          type="primary"
          icon="plus"
          :loading="roleLoad"
          @click="handleAddClick"
          >添加</a-button
        >
        <a-button
          v-show="selectSize > 0"
          type="danger"
          icon="delete"
          :loading="allDeleteLoading"
          @click="handleMultipleDeleteClick"
          >批量删除</a-button
        >
      </template>

      <a-alert class="system-user-alert" type="info">
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
        :pagination="pagination"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="avatar" slot-scope="text">
          <div class="system-user-avatar">
            <img :src="text" alt="avatar" />
          </div>
        </template>

        <template slot="action" slot-scope="text, record">
          <a @click="handleEditClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a>更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="onEditClick(record)">修改订阅金币</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="onSaleClick(record)"
                  >{{ { 0: '限时', 1: '取消' }[record.sale] }}特价</a
                >
              </a-menu-item>
              <a-menu-item>
                <a @click="handlePassClick(record)">修改密码</a>
              </a-menu-item>
              <a-menu-item>
                <a
                  v-if="record.status === 1"
                  @click="handleDisableClick(record)"
                  >冻结</a
                >
                <a v-else @click="handleEnableClick(record)">解冻</a>
              </a-menu-item>
              <a-menu-item v-if="record.username !== 'admin'">
                <a @click="handleDeleteClick(record)">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>
    </TableBlock>

    <DrawerPanel
      v-model="visible"
      :drawerData="drawerData"
      :loading="drawerBtnLoading"
      @change="handleDrawerChange"
      @confirm="handleDrawerConfirm"
    >
      <a-form :form="userForm" autocomplete="off">
        <a-form-item label="用户头像">
          <a-upload
            v-decorator="[
              'avatar',
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
                rules: rules.avatar
              }
            ]"
            name="files"
            list-type="picture-card"
            :show-upload-list="false"
            action="/df/sys/upload/uploadFile"
            :headers="uploadHeaders"
            @change="handleUploadChange"
          >
            <img
              class="avatar-image"
              :src="imageUrl"
              alt="avatar"
              v-if="imageUrl"
            />
            <div v-else>
              <a-icon :type="uploading ? 'loading' : 'plus'" />
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="用户账号">
          <a-input
            allowClear
            v-decorator="[
              'username',
              { initialValue: '', rules: rules.username }
            ]"
            placeholder="请输入用户账号"
            :read-only="isEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="用户姓名">
          <a-input
            allowClear
            v-decorator="[
              'realname',
              { initialValue: '', rules: rules.realname }
            ]"
            placeholder="请输入用户姓名"
          ></a-input>
        </a-form-item>
        <a-form-item label="角色分配">
          <a-select
            style="width: 100%;"
            :defaultActiveFirstOption="false"
            labelInValue
            v-decorator="['selectedroles', { rules: rules.role }]"
            placeholder="请选择角色"
          >
            <a-select-option v-for="item in roleList" :key="item.id">{{
              item.roleName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            allowClear
            v-decorator="['email', { initialValue: '', rules: rules.email }]"
            placeholder="请输入邮箱"
          ></a-input>
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input
            allowClear
            v-decorator="['phone', { initialValue: '', rules: rules.phone }]"
            placeholder="请输入手机号码"
          ></a-input>
        </a-form-item>
        <a-form-item label="描述">
          <a-input
            allowClear
            v-decorator="['description', { initialValue: '' }]"
            placeholder="请输入描述"
          ></a-input>
        </a-form-item>
      </a-form>
    </DrawerPanel>

    <ChangePassModal
      :visible.sync="showPassModal"
      :username="username"
      @afterClose="handleModalAfterClose"
      @confirm="handlePassConfirm"
    />

    <EditModal
      :visible.sync="editModalVisible"
      :userDetail.sync="userDetail"
      @submit="onEditModalSubmit"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import * as api from '@/api'
import { onlyNumberAndletter, checkEmail, checkPhone } from '@/utils/validate'
import mixin from '@/mixins'
import columns from './columns'
import { mapState } from 'vuex'
import DrawerPanel from '@/components/DrawerPanel'
import UserSearchForm from './components/UserSearchForm'
import ChangePassModal from './components/ChangePassModal'
import EditModal from './components/EditModal'

export default {
  name: 'system-user',
  components: {
    DrawerPanel,
    UserSearchForm,
    ChangePassModal,
    EditModal
  },
  data() {
    const validatorUserName = (rule, value, callback) => {
      if (!onlyNumberAndletter(value)) {
        callback(new Error('用户账号只能为数字或大小写字母'))
      } else {
        callback()
      }
    }
    const validatorEmail = (rule, value, callback) => {
      if (value && !checkEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    const validatorPhone = (rule, value, callback) => {
      if (value && !checkPhone(value)) {
        callback(new Error('手机号码格式错误'))
      } else {
        callback()
      }
    }
    return {
      // 用户列表请求加载状态
      loading: false,
      // 用户信息修改加载状态
      drawerBtnLoading: false,
      // 删除用户加载状态
      deleteLoading: false,
      // 批量删除状态
      allDeleteLoading: false,
      // 加载所有角色列表状态
      roleLoad: false,
      // 加载自身角色列表状态
      roleSelfLoad: false,
      // 用户表单
      userForm: this.$form.createForm(this),
      // 表头数据
      columns,
      // 表格数据
      dataSource: [],
      // 管理员id
      adminId: '',
      // 选中项
      selectedRowKeys: [],
      // 所有角色列表
      roleList: [],
      // 自身角色列表
      roleSelfList: [],
      // 抽屉开关
      visible: false,
      // 抽屉参数
      drawerData: {
        width: 350
      },
      // 用户表单参数
      userFormData: {},
      // 修改密码弹窗显示状态
      showPassModal: false,
      username: '',
      rules: {
        avatar: [{ required: true, message: '用户头像不能为空' }],
        username: [
          { required: true, message: '用户账号不能为空' },
          { validator: validatorUserName }
        ],
        realname: [{ required: true, message: '用户姓名不能为空' }],
        role: [{ required: true, message: '请选择用户角色' }],
        email: [{ validator: validatorEmail }],
        phone: [{ validator: validatorPhone }]
      },
      editLoading: false,
      editModalVisible: false,
      userDetail: {},
      uploadHeaders: {
        'X-Access-Token': window.sessionStorage.getItem('token')
      },
      uploading: false,
      imageUrl: '',
      onSaleLoading: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    selectSize() {
      return this.selectedRowKeys.length
    },
    isEdit() {
      return !_.isEmpty(this.userFormData)
    },
    showGAConfig() {
      if (
        this.userInfo.username === 'admin' ||
        this.userInfo.username === 'admin2'
      ) {
        return true
      }
      return false
    }
  },
  mixins: [mixin],
  methods: {
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },

    // 上传状态变更事件
    handleUploadChange(info) {
      if (info.file.status === 'uploading') {
        this.uploading = true
        return
      }
      if (info.file.status === 'done') {
        const { code, result } = info.file.response
        if (code === 0) {
          this.imageUrl = result[0].fileSrc
          this.uploading = false
        }
      }
    },

    // 选中项发生变化时的回调
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 清空选中项
    handleSelectClean() {
      this.selectedRowKeys = []
    },

    // 分页、排序、筛选变化时触发
    handleTableChange(pagination) {
      const { current, pageSize } = pagination
      if (this.pagination.pageSize !== pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
      } else if (this.pagination.current !== current) {
        this.pagination.current = current
      }
      this.updateList()
    },

    // 查询用户列表
    getUserList(params) {
      this.loading = true
      api
        .getUserList(params)
        .then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            this.pagination.total = res.result.total
            this.pagination.totalPage = res.result.pages
            const adminData = this.dataSource.find(
              item => item.username === 'admin'
            )
            this.adminId = adminData ? adminData.id : ''
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 获取所有角色
    queryAllRole(params, cb) {
      this.roleLoad = true
      api
        .queryAllRole(params)
        .then(res => {
          if (res.success) {
            this.roleList = res.result
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.roleLoad = false
        })
    },

    // 获取自身角色
    queryUserRole(params) {
      this.roleSelfLoad = true
      api
        .queryUserRole(params)
        .then(res => {
          if (res.success) {
            this.roleSelfList = res.result
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.roleSelfLoad = false
        })
    },

    // 添加用户
    addUser(params, cb) {
      this.drawerBtnLoading = true
      api
        .addUser(params)
        .then(res => {
          if (res.success) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.drawerBtnLoading = false
        })
    },

    // 编辑用户
    editUser(params, cb) {
      this.drawerBtnLoading = true
      api
        .editUser(params)
        .then(res => {
          if (res.success) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.drawerBtnLoading = false
        })
    },

    // 删除用户
    deleteUser(params, cb) {
      this.deleteLoading = true
      api
        .deleteUser(params)
        .then(res => {
          if (res.success) {
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

    // 批量删除用户
    deleteBatchUser(params, cb) {
      this.allDeleteLoading = true
      api
        .deleteBatchUser(params)
        .then(res => {
          if (res.success) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.allDeleteLoading = false
        })
    },

    // 冻结/解冻
    frozenBatch(params, cb) {
      this.frozenLoading = true
      api
        .frozenBatch(params)
        .then(res => {
          if (res.success) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.frozenLoading = false
        })
    },

    // 修改密码
    changePassword(params, cb) {
      this.changePassLoading = true
      api
        .changePassword(params)
        .then(res => {
          if (res.success) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.changePassLoading = false
        })
    },

    // 重置GA验证码
    resetGACode(params, cb) {
      this.changePassLoading = true
      api
        .resetGACode(params)
        .then(res => {
          if (res.success) {
            this.$_message.success('操作成功')
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.changePassLoading = false
        })
    },

    // 修改是否使用GA登录
    updateGALoginStatus(params, cb) {
      this.changePassLoading = true
      api
        .updateGALoginStatus(params)
        .then(res => {
          if (res.success) {
            this.$_message.success('操作成功')
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.changePassLoading = false
        })
    },

    // 更新用户订阅金币
    updateSubscribeCoin(params, cb) {
      this.editLoading = true
      api
        .updateSubscribeCoin(params)
        .then(res => {
          if (res.code === 200) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.editLoading = false
        })
    },

    // 修改用户限时促销状态
    updateOnSaleStatus(params, cb) {
      this.onSaleLoading = true
      api
        .updateOnSaleStatus(params)
        .then(res => {
          if (res.code === 200) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.onSaleLoading = false
        })
    },

    // 修改订阅金币
    onEditClick(record) {
      this.userDetail = record
      this.editModalVisible = true
    },

    // 提交修改订阅金币表单
    onEditModalSubmit(values) {
      console.log('edit', values)
      this.updateSubscribeCoin(values, () => {
        this.updateList()
        this.editModalVisible = false
      })
    },

    // 搜索
    handleSearchClick() {
      const { username, realname, phone } = this.$refs[
        'user-search-form'
      ].form.getFieldsValue()

      this.$refs['user-search-form'].form.setFieldsValue({
        username: username.trim(),
        realname: realname.trim(),
        phone: phone.trim()
      })

      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.updateList()
    },

    // 重置
    handleResetClick() {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.updateList()
    },

    // 添加按钮事件
    handleAddClick() {
      this.queryAllRole({}, () => {
        this.$set(this.drawerData, 'title', '添加')
        this.visible = true
      })
    },

    // 批量删除
    handleMultipleDeleteClick() {
      if (this.selectedRowKeys.includes(this.adminId)) {
        this.$_message.error('请勿删除管理员')
        return
      }

      this.$confirm({
        title: '提示',
        content: `确定要删除选中用户吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            ids: this.selectedRowKeys.join(',')
          }
          this.deleteBatchUser(params, () => {
            this.selectedRowKeys = []
            this.pagination.current = 1
            this.pagination.pageSize = 10
            this.updateList()
          })
        }
      })
    },

    // 编辑按钮事件
    handleEditClick(record) {
      const pm1 = api.queryAllRole()
      const pm2 = api.queryUserRole({ userid: record.id })
      Promise.all([pm1, pm2]).then(res => {
        if (res[0].success && res[1].success) {
          const roleList = res[0].result
          const roleSelfList = res[1].result
          this.roleList = roleList
          let selectedroles = []
          if (roleSelfList && roleSelfList.length > 0) {
            for (let i = 0; i < roleList.length; i++) {
              const { id, roleName } = roleList[i]
              if (new RegExp(roleSelfList.join('|')).test(id)) {
                selectedroles.push({
                  key: id,
                  label: roleName
                })
              }
            }
          }
          this.$set(this.drawerData, 'title', '编辑')
          this.userFormData = { ...record, selectedroles }
          this.visible = true
        } else {
          this.$_message.error(res[1].message)
        }
      })
    },

    //
    onSaleClick(record) {
      this.$confirm({
        title: '提示',
        content: `确定要${{ 0: '开启', 1: '取消' }[record.sale]}用户【${
          record.realname
        }】限时特价吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            id: record.id,
            sale: record.sale ? 0 : 1
          }
          this.updateOnSaleStatus(params, () => {
            this.updateList()
          })
        }
      })
    },

    // 修改密码
    handlePassClick(record) {
      this.username = record.username
      this.showPassModal = true
    },

    // Modal 完全关闭后的回调
    handleModalAfterClose() {
      this.username = ''
    },

    // 提交表单
    handlePassConfirm(params) {
      this.changePassword(params, () => {
        this.showPassModal = false
        this.updateList()
      })
    },

    // 冻结
    handleDisableClick(record) {
      this.$confirm({
        title: '提示',
        content: `确定要冻结用户【${record.realname}】吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            ids: record.id,
            status: 2
          }
          this.frozenBatch(params, () => {
            this.updateList()
          })
        }
      })
    },

    // 解冻
    handleEnableClick(record) {
      this.$confirm({
        title: '提示',
        content: `确定要解冻用户【${record.realname}】吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            ids: record.id,
            status: 1
          }
          this.frozenBatch(params, () => {
            this.updateList()
          })
        }
      })
    },

    // 删除按钮事件
    handleDeleteClick(record) {
      this.$confirm({
        title: '提示',
        content: `确定要删除用户【${record.realname}】吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            id: record.id
          }
          this.deleteUser(params, () => {
            this.selectedRowKeys = this.selectedRowKeys.filter(
              item => item !== record.id
            )
            this.pagination.current = 1
            this.pagination.pageSize = 10
            this.updateList()
          })
        }
      })
    },

    // 重置GA验证码按钮事件
    handleResetGAClick(record) {
      this.$confirm({
        title: '提示',
        content: `确定要重置用户【${record.realname}】的谷歌验证码吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            id: record.id
          }
          this.resetGACode(params, () => {
            this.updateList()
          })
        }
      })
    },

    // 修改GA验证码状态
    handleUpdateGAClick(record) {
      let str = ''
      if (record.gaFlag === 1) {
        str = '关闭'
      } else if (record.gaFlag === 0) {
        str = '开启'
      }
      this.$confirm({
        title: '提示',
        content: `确定要${str}用户【${record.realname}】的谷歌验证码吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            id: record.id
          }
          this.updateGALoginStatus(params, () => {
            this.updateList()
          })
        }
      })
    },

    // 切换抽屉时动画结束后的回调
    handleDrawerChange(visible) {
      if (visible) {
        // 编辑时为表单赋值
        if (this.isEdit) {
          const values = {
            username: this.userFormData.username,
            realname: this.userFormData.realname,
            email: this.userFormData.email,
            phone: this.userFormData.phone,
            description: this.userFormData.description
          }
          if (
            this.userFormData.selectedroles &&
            this.userFormData.selectedroles.length > 0
          ) {
            values.selectedroles = this.userFormData.selectedroles[0]
          }
          if (this.userFormData.avatar) {
            const { avatar } = this.userFormData
            this.imageUrl = avatar
            values.avatar = [
              {
                uid: '-1',
                name: avatar.slice(avatar.lastIndexOf('/') + 1),
                status: 'done',
                url: avatar
              }
            ]
          }
          this.userForm.setFieldsValue(values)
        }
      } else {
        // 重置表单
        this.userForm.resetFields()
        this.userFormData = {}
        this.imageUrl = ''
      }
    },

    // 抽屉确认按钮
    handleDrawerConfirm() {
      const {
        username,
        realname,
        email,
        phone,
        description
      } = this.userForm.getFieldsValue()
      this.userForm.setFieldsValue({
        username: username.trim(),
        realname: realname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        description: description.trim()
      })

      this.userForm.validateFields((errors, values) => {
        if (errors) {
          return
        }
        let params = { ...values, avatar: '', selectedroles: {} }
        params.avatar = this.imageUrl
        params.selectedroles = values.selectedroles
          ? values.selectedroles.key
          : ''
        if (this.isEdit) {
          // 编辑时
          params = {
            ...this.userFormData,
            ...params
          }
          this.editUser(params, () => {
            this.visible = false
            this.updateList()
          })
        } else {
          // 添加时
          this.addUser(params, () => {
            this.visible = false
            this.updateList()
          })
        }
      })
    },

    // 格式化请求参数
    formatParams() {
      const formData = this.$refs['user-search-form'].form.getFieldsValue()
      const params = {
        query: {
          username: formData.username,
          realname: formData.realname,
          phone: formData.phone,
          status: formData.status
        },

        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getUserList(params)
    }
  },
  mounted() {
    this.updateList()
  }
}
</script>

<style lang="less">
.system-user {
}

.system-user-alert {
  margin: 0 24px 16px;

  .ant-alert-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.system-user-avatar {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  font-size: 0;

  & img {
    width: 100%;
    height: 100%;
  }
}

.system-user .avatar-image {
  max-width: 250px;
}

.system-user .ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
</style>
