<template>
  <a-modal
    :visible="visible"
    title="修改密码"
    :keyboard="false"
    :maskClosable="false"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      class="change-pass-modal"
      :form="form"
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 14 }"
      autocomplete="off"
    >
      <a-form-item label="用户账号">
        <a-input
          v-decorator="['username']"
          placeholder="请输入用户账号"
          read-only
        ></a-input>
      </a-form-item>
      <a-form-item label="用户密码">
        <a-input
          allowClear
          v-decorator="[
            'password',
            { initialValue: '', rules: rules.password }
          ]"
          type="password"
          placeholder="请输入用户密码"
        ></a-input>
      </a-form-item>
      <a-form-item label="确认密码">
        <a-input
          allowClear
          v-decorator="[
            'confirmpassword',
            { initialValue: '', rules: rules.confirmpassword }
          ]"
          type="password"
          placeholder="请再次输入密码"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { onlyNumberAndletter } from '@/utils/validate'

export default {
  name: 'ChangePassModal',
  props: {
    visible: Boolean,
    username: String
  },
  watch: {
    username(str) {
      if (str) {
        this.$nextTick().then(() => {
          this.form.setFieldsValue({
            username: str
          })
        })
      }
    }
  },
  data() {
    const validatorPass = (rule, value, callback) => {
      if (value && value.length < 6) {
        callback(new Error('用户密码不能少于6位'))
      } else if (!onlyNumberAndletter(value)) {
        callback(new Error('用户密码只能为数字或大小写字母'))
      } else {
        const err = this.form.getFieldError('confirmpassword')
        if (err) {
          this.form.validateFields(['confirmpassword'])
        }
        callback()
      }
    }
    const validatorCPass = (rule, value, callback) => {
      this.form.validateFields(['password'], (errors, values) => {
        const { password } = values
        if (value && errors) {
          callback(new Error('请先输入符合规则的用户密码'))
        } else if (value && value !== password) {
          callback(new Error('两次输入的用户密码不一致'))
        } else {
          callback()
        }
      })
    }
    return {
      form: this.$form.createForm(this),
      rules: {
        password: [
          { required: true, message: '请输入用户密码' },
          { validator: validatorPass }
        ],
        confirmpassword: [
          { required: true, message: '请再次输入用户密码' },
          { validator: validatorCPass }
        ]
      }
    }
  },
  methods: {
    // Modal 完全关闭后的回调
    afterClose() {
      this.$emit('afterClose')
    },
    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) {
          return
        }
        this.$emit('confirm', values)
      })
    },
    // 取消
    onCancel() {
      this.form.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less">
.change-pass-modal {
  .ant-form-item {
    display: block;
    margin-right: 0;
    margin-bottom: 24px;
  }
}
</style>
