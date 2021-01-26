<template>
  <div class="system-role container">
    <SearchBar>
      <RoleSearchForm
        ref="role-search-form"
        @search="handleSearchClick"
        @reset="handleResetClick"
      />
    </SearchBar>

    <TableBlock title="角色管理">
      <template #option>
        <a-button type="primary" icon="plus" @click="handleAddClick"
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

      <a-alert class="system-role-alert" type="info">
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
        <template slot="description" slot-scope="text">
          <a-tooltip :title="text">
            {{ overTenEllipsis(text) }}
          </a-tooltip>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEditClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleAuthClick(record)">授权</a>
          <template v-if="record.roleCode !== 'admin'">
            <a-divider type="vertical" />
            <a @click="handleDeleteClick(record)">删除</a>
          </template>
        </span>
      </a-table>
    </TableBlock>

    <DrawerPanel
      v-model="visible"
      :drawerData="drawerData"
      :loading="drawerBtnLoading"
      @change="handleDrawerChange"
      @confirm="handleDrawerConfirm"
    >
      <RoleAuthTree
        v-if="showAuthTree"
        :authTreeData="authTreeData"
        @check="handleTreeCheck"
        @expand="handleTreeExpand"
      ></RoleAuthTree>

      <RoleForm v-else ref="role-form" :roleFormData="roleFormData"></RoleForm>

      <template #footer v-if="showAuthTree">
        <div class="drawer-panel-footer-wrapper">
          <a-dropdown :trigger="['click']" placement="topLeft">
            <a-menu slot="overlay" @click="handleTreeControll">
              <a-menu-item key="1">选中全部</a-menu-item>
              <a-menu-item key="2">取消全选</a-menu-item>
              <a-menu-item key="3">展开所有</a-menu-item>
              <a-menu-item key="4">合并所有</a-menu-item>
            </a-menu>
            <a-button> 树操作 <a-icon type="down" /> </a-button>
          </a-dropdown>
          <div>
            <a-button @click="handleAuthTreeCancel">取消</a-button>
            <a-button @click="handleAuthTreeConfirm" :loading="authBtnLoading"
              >确定</a-button
            >
          </div>
        </div>
      </template>
    </DrawerPanel>
  </div>
</template>

<script>
import _ from 'lodash'
import * as api from '@/api'
import { getToken } from '@/utils'
import { mapActions } from 'vuex'
import mixin from '@/mixins'
import columns from './columns'
import DrawerPanel from '@/components/DrawerPanel'
import RoleSearchForm from './components/RoleSearchForm'
import RoleForm from './components/RoleForm'
import RoleAuthTree from './components/RoleAuthTree'

export default {
  name: 'system-role',
  components: {
    DrawerPanel,
    RoleSearchForm,
    RoleForm,
    RoleAuthTree
  },
  data() {
    return {
      // 角色列表请求加载状态
      loading: false,
      // 角色权限信息加载状态
      roleInfoLoading: false,
      // 角色信息修改加载状态
      drawerBtnLoading: false,
      // 删除角色加载状态
      deleteBtnLoading: false,
      // 批量删除角色加载状态
      allDeleteLoading: false,
      // 保存权限加载状态
      authBtnLoading: false,
      // 表头数据
      columns,
      // 表格数据
      dataSource: [],
      // 管理员id
      adminId: '',
      // 选中项
      selectedRowKeys: [],
      // 抽屉开关
      visible: false,
      // 抽屉参数
      drawerData: {
        width: 350
      },
      // 角色表单参数
      roleFormData: {},
      // 显示权限配置
      showAuthTree: false,
      // 所有树的key数组
      allTreeKeys: [],
      // 权限树参数
      authTreeData: {}
    }
  },
  computed: {
    selectSize() {
      return this.selectedRowKeys.length
    },
    isEdit() {
      return !_.isEmpty(this.roleFormData)
    }
  },
  mixins: [mixin],
  methods: {
    ...mapActions(['queryPermissionsByUser']),

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

    // 超过十个字省略
    overTenEllipsis(text) {
      let str = text + ''
      return str.length > 10 ? str.slice(0, 10) + '...' : str
    },

    // 获取角色列表数据
    getRoleList(params) {
      this.loading = true
      api
        .getRoleList(params)
        .then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            this.pagination.total = res.result.total
            this.pagination.totalPage = res.result.pages
            const adminData = this.dataSource.find(
              item => item.roleCode === 'admin'
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

    // 添加角色
    addRole(params, cb) {
      this.drawerBtnLoading = true
      api
        .addRole(params)
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

    // 编辑角色
    editRole(params, cb) {
      this.drawerBtnLoading = true
      api
        .editRole(params)
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

    // 删除角色
    deleteRole(params, cb) {
      this.deleteBtnLoading = true
      api
        .deleteRole(params)
        .then(res => {
          if (res.success) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.deleteBtnLoading = false
        })
    },

    // 批量删除角色
    deleteRoleList(params, cb) {
      this.allDeleteLoading = true
      api
        .deleteRoleList(params)
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

    // 获取角色授权数据
    getRoleAuthData(id, cb) {
      this.roleInfoLoading = true
      // 树形结构列表
      const pm1 = api.queryTreeListForRole()
      // 获取角色权限
      const pm2 = api.queryRolePermission({ roleId: id })

      Promise.all([pm1, pm2])
        .then(res => {
          if (res[0].success && res[1].success) {
            const { ids, treeList } = res[0].result
            this.allTreeKeys = ids
            this.authTreeData = {
              treeData: treeList.filter(
                item => item.key !== '1300429142151344130'
              ),
              checkedKeys: [...res[1].result],
              defaultCheckedKeys: [...res[1].result],
              expandedKeys: ids
            }
            cb && cb()
          } else {
            this.$_message.error(res[0].message)
            this.$_message.error(res[1].message)
          }
        })
        .finally(() => {
          this.roleInfoLoading = false
        })
    },

    // 保存角色授权数据
    saveRolePermission(params, cb) {
      this.authBtnLoading = true
      api
        .saveRolePermission(params)
        .then(res => {
          if (res.success) {
            this.$_message.success(res.message)
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.authBtnLoading = false
        })
    },

    // 搜索按钮
    handleSearchClick() {
      const { roleName } = this.$refs['role-search-form'].form.getFieldsValue()

      this.$refs['role-search-form'].form.setFieldsValue({
        roleName: roleName.trim()
      })

      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.updateList()
    },

    // 重置按钮
    handleResetClick() {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.updateList()
    },

    // 添加按钮事件
    handleAddClick() {
      this.showAuthTree = false
      this.$set(this.drawerData, 'title', '添加')
      this.roleFormData = {}
      this.visible = true
    },

    // 批量删除
    handleMultipleDeleteClick() {
      if (this.selectedRowKeys.includes(this.adminId)) {
        this.$_message.error('请勿删除管理员')
        return
      }

      this.$confirm({
        title: '提示',
        content: `确定要删除选中角色吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            ids: this.selectedRowKeys.join(',')
          }
          this.deleteRoleList(params, () => {
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
      this.showAuthTree = false
      this.$set(this.drawerData, 'title', '编辑')
      this.roleFormData = record
      this.visible = true
    },

    // 授权按钮事件
    handleAuthClick(record) {
      this.getRoleAuthData(record.id, () => {
        this.roleFormData = record
        this.showAuthTree = true
        this.$set(this.drawerData, 'title', '角色权限配置')
        this.visible = true
      })
    },

    // 删除按钮事件
    handleDeleteClick(record) {
      this.$confirm({
        title: '提示',
        content: `确定要删除角色【${record.roleName}】吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            id: record.id
          }
          this.deleteRole(params, () => {
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

    // 切换抽屉时动画结束后的回调
    handleDrawerChange(visible) {
      if (visible) {
        if (this.showAuthTree) {
          return
        }

        // 编辑时为表单赋值
        if (this.isEdit) {
          this.$refs['role-form'].formValueInit()
        }
      } else {
        if (this.showAuthTree) {
          this.authTreeData = {}
          return
        }

        // 重置表单
        this.$refs['role-form'].form.resetFields()
      }
    },

    // 抽屉确认按钮
    handleDrawerConfirm() {
      const { roleCode, roleName, description } = this.$refs[
        'role-form'
      ].form.getFieldsValue()
      this.$refs['role-form'].form.setFieldsValue({
        roleCode: roleCode.trim(),
        roleName: roleName.trim(),
        description: description.trim()
      })

      this.$refs['role-form'].form.validateFields((errors, values) => {
        if (errors) {
          return
        }
        let params = values
        if (this.isEdit) {
          // 编辑时
          params = {
            ...this.roleFormData,
            ...params
          }
          this.editRole(params, () => {
            this.visible = false
            this.updateList()
          })
        } else {
          // 添加时
          this.addRole(params, () => {
            this.visible = false
            this.updateList()
          })
        }
      })
    },

    // 角色权限树取消按钮
    handleAuthTreeCancel() {
      this.visible = false
    },

    // 角色权限树确认按钮
    handleAuthTreeConfirm() {
      const params = {
        roleId: this.roleFormData.id,
        permissionIds: this.authTreeData.checkedKeys.join(','),
        lastpermissionIds: this.authTreeData.defaultCheckedKeys.join(',')
      }
      this.saveRolePermission(params, () => {
        const token = getToken()
        this.queryPermissionsByUser({
          token,
          cb: () => {
            this.visible = false
          }
        })
      })
    },

    // 获取更新列表
    getUpdateKeys(newKey) {
      let arr = []
      for (let i = 0; i < this.authTreeData.treeData.length; i++) {
        if (this.authTreeData.treeData[i].key === newKey[0]) {
          arr = newKey
          if (this.authTreeData.treeData[i].children) {
            arr = arr.concat(
              this.authTreeData.treeData[i].children.map(item => item.key)
            )
          }
          break
        }
      }
      if (arr.length === 0) {
        arr = newKey
      }
      return arr
    },

    // 点击复选框触发
    handleTreeCheck(checkedKeys) {
      if (this.authTreeData.checkedKeys.length < checkedKeys.length) {
        // 添加菜单
        const newKey = _.difference(checkedKeys, this.authTreeData.checkedKeys)
        const updateKeys = this.getUpdateKeys(newKey)

        this.authTreeData.checkedKeys = [
          ...new Set(this.authTreeData.checkedKeys.concat(updateKeys))
        ]
      } else if (this.authTreeData.checkedKeys.length > checkedKeys.length) {
        // 删除菜单
        const newKey = _.difference(this.authTreeData.checkedKeys, checkedKeys)
        const updateKeys = this.getUpdateKeys(newKey)

        this.authTreeData.checkedKeys = _.difference(
          this.authTreeData.checkedKeys,
          updateKeys
        )
      }
    },

    // 展开/收起节点时触发
    handleTreeExpand(expandedKeys) {
      this.authTreeData.expandedKeys = expandedKeys
    },

    // 树操作
    handleTreeControll({ key }) {
      switch (key) {
        case '1':
          // 选中全部
          this.authTreeData.checkedKeys = this.allTreeKeys
          break
        case '2':
          // 取消全选
          this.authTreeData.checkedKeys = []
          break
        case '3':
          // 展开所有
          this.authTreeData.expandedKeys = this.allTreeKeys
          break
        case '4':
          // 合并所有
          this.authTreeData.expandedKeys = []
          break
        default:
          break
      }
    },

    // 格式化请求参数
    formatParams() {
      const formData = this.$refs['role-search-form'].form.getFieldsValue()
      const params = {
        roleName: formData.roleName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      return params
    },

    // 更新列表数据
    updateList() {
      const params = this.formatParams()
      this.getRoleList(params)
    }
  },
  mounted() {
    this.updateList()
  }
}
</script>

<style lang="less">
.system-role {
}

.system-role-alert {
  margin: 0 24px 16px;

  .ant-alert-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.drawer-panel-footer-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
