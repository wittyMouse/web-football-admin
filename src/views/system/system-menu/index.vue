<template>
  <div class="system-menu container">
    <TableBlock title="菜单管理">
      <template #option>
        <a-button
          type="primary"
          icon="plus"
          :loading="parentMenuLoad"
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

      <a-alert class="system-menu-alert" type="info">
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
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :pagination="false"
        :loading="loading"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEditClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDeleteClick(record)">删除</a>
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
      <MenuForm
        ref="menu-form"
        :treeList="treeList"
        :menuFormData="menuFormData"
        @icon-change="showIconSelectModal = true"
      />
    </DrawerPanel>

    <IconSelectModal
      :visible.sync="showIconSelectModal"
      @change="handleIconChange"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import * as api from '@/api'
import { getToken } from '@/utils'
import { mapActions } from 'vuex'
import mixin from '@/mixins'
import columns from './columns'
import MenuForm from './components/MenuForm'
import DrawerPanel from '@/components/DrawerPanel'
import IconSelectModal from '@/components/IconSelectModal'

export default {
  name: 'system-menu',
  components: {
    MenuForm,
    DrawerPanel,
    IconSelectModal
  },
  data() {
    return {
      loading: false,
      parentMenuLoad: false,
      drawerBtnLoading: false,
      deleteLoading: false,
      allDeleteLoading: false,
      dataSource: [],
      columns,
      selectedRowKeys: [],
      visible: false,
      drawerData: {
        width: 350
      },
      treeList: [],
      menuFormData: {},
      showIconSelectModal: false
    }
  },
  computed: {
    selectSize() {
      return this.selectedRowKeys.length
    },
    isEdit() {
      return !_.isEmpty(this.menuFormData)
    }
  },
  mixins: [mixin],
  methods: {
    ...mapActions(['queryPermissionsByUser']),
    // 表格选中项发生变化时的回调
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 清空选中项
    handleSelectClean() {
      this.selectedRowKeys = []
    },

    // 获取上级菜单列表
    getParentMenuList(cb) {
      this.parentMenuLoad = true
      api
        .queryTreeList()
        .then(res => {
          if (res.success) {
            const treeList = res.result.treeList
            treeList.forEach(element => {
              element.isLeaf = element.leaf
            })
            this.treeList = treeList
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.parentMenuLoad = false
        })
    },

    // 获取菜单管理列表数据
    getMenuControllList(params) {
      this.loading = true
      api
        .getPermissionList(params)
        .then(res => {
          if (res.success) {
            const menuList = res.result.filter(
              item => item.id !== '1300429142151344130'
            )
            this.dataSource = menuList
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 添加菜单
    addMenu(params, cb) {
      this.drawerBtnLoading = true
      api
        .addMenu(params)
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

    // 编辑菜单
    editMenu(params, cb) {
      this.drawerBtnLoading = true
      api
        .editMenu(params)
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

    // 删除菜单
    deleteMenu(params, cb) {
      this.deleteLoading = true
      api
        .deleteMenu(params)
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

    // 批量删除菜单
    deleteBatchMenu(params, cb) {
      this.allDeleteLoading = true
      api
        .deleteBatchMenu(params)
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

    // 添加按钮事件
    handleAddClick() {
      this.getParentMenuList(() => {
        this.$set(this.drawerData, 'title', '添加')
        this.menuFormData = {}
        this.visible = true
      })
    },

    // 批量删除
    handleMultipleDeleteClick() {
      this.$confirm({
        title: '提示',
        content: `确定要删除选中菜单吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            ids: this.selectedRowKeys.join(',')
          }
          this.deleteBatchMenu(params, () => {
            const token = getToken()
            this.queryPermissionsByUser({ token })
            this.selectedRowKeys = []
            this.updateList()
          })
        }
      })
    },

    // 编辑按钮事件
    handleEditClick(record) {
      this.getParentMenuList(() => {
        this.$set(this.drawerData, 'title', '编辑')
        this.menuFormData = record
        this.visible = true
      })
    },

    // 删除按钮事件
    handleDeleteClick(record) {
      this.$confirm({
        title: '提示',
        content: `确定要删除菜单【${record.name}】吗？`,
        keyboard: false,
        onOk: () => {
          const params = {
            id: record.id
          }
          this.deleteMenu(params, () => {
            const token = getToken()
            this.queryPermissionsByUser({ token })
            this.selectedRowKeys = this.selectedRowKeys.filter(
              item => item !== record.id
            )
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
          this.$refs['menu-form'].formDataInit(this.menuFormData)
        } else {
          this.$refs['menu-form'].currentMenuType = 0
        }
      } else {
        // 重置表单
        this.$refs['menu-form'].form.resetFields()
        this.menuFormData = {}
      }
    },

    // 抽屉确认按钮
    handleDrawerConfirm() {
      this.validateForm(values => {
        let params = {
          ...values,
          menuType: this.$refs['menu-form'].currentMenuType
        }

        if (params.menuType === 2) {
          const token = getToken()
          api
            .queryPermissionsByUser({ token })
            .then(res => {
              if (res.success) {
                const allAuth = res.result.allAuth
                if (
                  allAuth.findIndex(item => item.action === params.perms) > -1
                ) {
                  this.$_message.error('权限编码已存在')
                  return
                }
                this.queryMenuRequest(params)
              } else {
                this.$_message.error(res.message)
              }
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          this.queryMenuRequest(params)
        }
      })
    },

    // 发起菜单添加或编辑请求
    queryMenuRequest(params) {
      if (this.isEdit) {
        // 编辑时
        this.editMenu(
          {
            ...this.menuFormData,
            ...params
          },
          () => {
            const token = getToken()
            this.queryPermissionsByUser({ token })
            this.visible = false
            this.updateList()
          }
        )
      } else {
        // 添加时
        this.addMenu(params, () => {
          this.visible = false
          this.updateList()
        })
      }
    },

    // 表单过滤
    validateForm(cb) {
      // const { name, url, redirect } = this.$refs['menu-form'].form.getFieldsValue()
      const { name, url, perms } = this.$refs['menu-form'].form.getFieldsValue()

      if (this.$refs['menu-form'].currentMenuType === 0) {
        this.$refs['menu-form'].form.setFieldsValue({
          name: name.trim(),
          url: url.trim()
          // redirect: redirect.trim()
        })

        // this.$refs['menu-form'].form.validateFields(['name', 'url', 'redirect', 'icon', 'sortNo'], (errors, values) => {
        //   if (errors) return

        //   cb && cb(values)
        // })

        this.$refs['menu-form'].form.validateFields(
          ['name', 'url', 'icon', 'sortNo'],
          (errors, values) => {
            if (errors) return

            cb && cb(values)
          }
        )
      } else if (this.$refs['menu-form'].currentMenuType === 1) {
        this.$refs['menu-form'].form.setFieldsValue({
          name: name.trim(),
          url: url.trim()
        })

        this.$refs['menu-form'].form.validateFields(
          ['name', 'parentId', 'url', 'sortNo'],
          (errors, values) => {
            if (errors) return

            cb && cb(values)
          }
        )
      } else if (this.$refs['menu-form'].currentMenuType === 2) {
        this.$refs['menu-form'].form.setFieldsValue({
          name: name.trim(),
          perms: perms.trim()
        })

        this.$refs['menu-form'].form.validateFields(
          ['name', 'parentId', 'perms'],
          (errors, values) => {
            if (errors) return

            cb && cb({ ...values, status: '1' })
          }
        )
      }
    },

    // 更换图标
    handleIconChange(icon) {
      this.$refs['menu-form'].form.setFieldsValue({
        icon
      })
      this.showIconSelectModal = false
    },

    // 更新列表数据
    updateList() {
      this.getMenuControllList()
    }
  },
  mounted() {
    this.getParentMenuList()
    this.updateList()
  }
}
</script>

<style lang="less">
.system-menu-alert {
  margin: 0 24px 16px;

  .ant-alert-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
