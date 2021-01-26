<template>
  <a-form
    class="search-bar-form"
    :form="form"
    layout="inline"
    autocomplete="off"
  >
    <a-row>
      <a-col>
        <a-form-item label="角色名称">
          <a-input
            v-decorator="['rolename', { initialValue: '' }]"
            placeholder="请输入角色名称"
          />
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
  name: 'RoleSearchForm',
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
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

<style lang="less">
.role-search-form {
  .ant-form-item {
    display: flex;

    .ant-form-item-control-wrapper {
      flex: 1 0 auto;
    }
  }
}
</style>
