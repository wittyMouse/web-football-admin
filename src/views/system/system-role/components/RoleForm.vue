<template>
  <a-form class="role-form" :form="form" autocomplete="off">
    <a-form-item label="角色编码">
      <a-input
        v-decorator="['roleCode', { initialValue: '', rules: rules.roleCode }]"
        placeholder="请输入角色编码"
        :read-only="isEdit"
      />
    </a-form-item>
    <a-form-item label="角色名称">
      <a-input
        v-decorator="['roleName', { initialValue: '', rules: rules.roleName }]"
        placeholder="请输入角色名称"
      />
    </a-form-item>
    <a-form-item label="描述">
      <a-textarea
        v-decorator="[
          'description',
          { initialValue: '', rules: rules.description }
        ]"
        placeholder="请输入描述"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import _ from 'lodash'
import { onlyNumberAndletter } from '@/utils/validate'

export default {
  name: 'RoleForm',
  props: {
    roleFormData: Object
  },
  data() {
    // 校验角色编码
    const validateRoleCode = (rule, value, callback) => {
      if (!onlyNumberAndletter(value)) {
        callback(new Error('角色编码只能为数字或大小写字母'))
      } else {
        callback()
      }
    }
    return {
      form: this.$form.createForm(this),
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编码' },
          {
            min: 0,
            max: 64,
            message: '长度不能超过 64 个字符',
            trigger: 'blur'
          },
          { validator: validateRoleCode }
        ],
        roleName: [
          { required: true, message: '请输入角色名称' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符之间',
            trigger: 'blur'
          }
        ],
        description: [
          {
            min: 0,
            max: 126,
            message: '长度不能超过 126 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    isEdit() {
      return !_.isEmpty(this.roleFormData)
    }
  },
  methods: {
    // 表单值初始化
    formValueInit() {
      this.form.setFieldsValue({
        roleCode: this.roleFormData.roleCode,
        roleName: this.roleFormData.roleName,
        description: this.roleFormData.description
      })
    }
  }
}
</script>

<style lang="less">
.role-form {
}
</style>
