<template>
  <a-form
    class="search-bar-form"
    :form="form"
    layout="inline"
    autocomplete="off"
  >
    <a-row>
      <a-col>
        <a-form-item label="用户账号">
          <a-input
            v-decorator="['username', { initialValue: '' }]"
            placeholder="请输入用户账号"
          />
        </a-form-item>
        <a-form-item label="用户姓名">
          <a-input
            v-decorator="['realname', { initialValue: '' }]"
            placeholder="请输入用户姓名"
          />
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input
            v-decorator="['phone', { initialValue: '' }]"
            placeholder="请输入手机号码"
          />
        </a-form-item>
        <a-form-item label="用户状态">
          <a-select
            style="width: 150px;"
            v-decorator="['status', { initialValue: '' }]"
            placeholder="请选择用户状态"
            :getPopupContainer="getPopupContainer"
          >
            <a-select-option value>全部</a-select-option>
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">冻结</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" class="text-right">
        <a-button type="primary" icon="search" @click="handleSearchClick"
          >搜索</a-button
        >
        <a-button type="primary" icon="reload" @click="handleResetClick"
          >重置</a-button
        >
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
export default {
  name: 'UserSearchForm',
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // 菜单渲染父节点
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode || document.body
    },
    // 搜索按钮
    handleSearchClick() {
      this.$emit('search')
    },
    // 重置按钮
    handleResetClick() {
      this.form.resetFields()
      this.$emit('reset')
    }
  }
}
</script>

<style lang="less"></style>
