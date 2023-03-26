<template>
  <a-modal
    :visible="visible"
    title="修改密码"
    :width="600"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      :form="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      autocomplete="off"
    >
      <a-form-item label="编号">
        <a-input
          v-decorator="['memberId', { initialValue: '' }]"
          placeholder="请输入编号"
          disabled
        ></a-input>
      </a-form-item>
      <a-form-item label="账号">
        <a-input
          v-decorator="['account', { initialValue: '' }]"
          placeholder="请输入账号"
          disabled
        ></a-input>
      </a-form-item>
      <a-form-item label="昵称">
        <a-input
          v-decorator="[
            'nickname',
            { initialValue: '', rules: rules.nickname }
          ]"
          placeholder="请输入昵称"
          disabled
        ></a-input>
      </a-form-item>
      <a-form-item label="密码">
        <a-input-password
          v-decorator="['pwd', { initialValue: '', rules: rules.pwd }]"
          placeholder="请输入密码"
        ></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const formFields = ['memberId', 'account', 'nickname']

export default {
  name: 'ChangePasswordModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    memberDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        pwd: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.memberDetail) {
            if (formFields.includes(key)) {
              values[key] = this.memberDetail[key]
            }
          }
          this.form.setFieldsValue(values)
        })
      }
    }
  },
  methods: {
    onReset() {
      this.form.resetFields()
      this.$emit('update:memberDetail', {})
    },

    // 完全关闭后
    afterClose() {
      this.onReset()
      this.$emit('afterClose')
    },

    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) return
        const args = {
          ...values,
          id: this.memberDetail.id
        }
        this.$emit('submit', args)
      })
    },

    // 取消
    onCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped></style>
