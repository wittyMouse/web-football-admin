<template>
  <a-modal
    :visible="visible"
    title="用户列表"
    :width="1200"
    :bodyStyle="{ padding: '16px' }"
    :footer="null"
    :afterClose="afterClose"
    @cancel="onCancel"
  >
    <a-row type="flex" justify="end" :style="{ marginBottom: '16px' }">
      <a-button type="primary" icon="plus" @click="onAddClick">添加</a-button>
    </a-row>

    <a-table
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
    >
      <template slot="options" slot-scope="text, record">
        <a @click="onEditClick(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)">删除</a>
      </template>
    </a-table>

    <CreateModal
      :visible.sync="createModalVisible"
      :id="deparimentDetail.id"
      :userList="userList"
      @submit="onCreateModalSubmit"
    />
    <UpdateModal
      :visible.sync="updateModalVisible"
      :userDetail.sync="userDetail"
      @submit="onUpdateModalSubmit"
    />
  </a-modal>
</template>

<script>
import * as api from '@/api'
import columns from './columns'
import CreateModal from './CreateModal'
import UpdateModal from './UpdateModal'

export default {
  name: 'UserListModal',
  components: {
    CreateModal,
    UpdateModal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    deparimentDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      addLoading: false,
      updateLoading: false,
      deleteLoading: false,
      columns,
      dataSource: [],
      createModalVisible: false,
      updateModalVisible: false,
      userDetail: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.updateList()
      }
    }
  },
  methods: {
    onReset() {
      this.$emit('update:deparimentDetail', {})
    },

    // 完全关闭后
    afterClose() {
      this.onReset()
      this.$emit('afterClose')
    },

    // 取消
    onCancel() {
      this.$emit('update:visible', false)
    },

    // 根据部门ID查询用户列表
    getUserListByDeparment(params) {
      this.loading = true
      api
        .getUserListByDeparment(params)
        .then(res => {
          if (res.code === 0) {
            this.dataSource = res.result
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 添加用户到指定部门
    addUserToDepartment(params, cb) {
      this.addLoading = true
      api
        .addUserToDepartment(params)
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

    // 更新用户在部门的排序号
    updateUserToDepartment(params, cb) {
      this.updateLoading = true
      api
        .updateUserToDepartment(params)
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

    // 删除用户到指定部门
    deleteUserToDepartment(params, cb) {
      this.deleteLoading = true
      api
        .deleteUserToDepartment(params)
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

    // 添加按钮
    onAddClick() {
      this.createModalVisible = true
    },

    // 编辑按钮
    onEditClick(record) {
      this.userDetail = record
      this.updateModalVisible = true
    },

    // 提交添加表单
    onCreateModalSubmit(values) {
      console.log('create', values)
      this.addUserToDepartment(values, () => {
        this.updateList()
        this.createModalVisible = false
      })
    },

    // 提交更新表单
    onUpdateModalSubmit(values) {
      console.log('update', values)
      this.updateUserToDepartment(values, () => {
        this.updateList()
        this.updateModalVisible = false
      })
    },

    // 删除按钮
    onDeleteClick(record) {
      const { id, username } = record
      const { name } = this.deparimentDetail
      this.$confirm({
        title: `是否将用户【${username}】移出部门【${name}】`,
        onOk: () => {
          this.deleteUserToDepartment({ id }, () => {
            this.updateList()
          })
        }
      })
    },

    // 更新列表数据
    updateList() {
      const { id } = this.deparimentDetail
      this.getUserListByDeparment({ id })
    }
  }
}
</script>

<style lang="less" scoped></style>
