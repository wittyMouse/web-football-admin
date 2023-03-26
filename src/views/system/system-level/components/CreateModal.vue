<template>
  <a-modal
    :visible="visible"
    title="添加等级配置"
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
      <a-form-item label="等级">
        <a-input
          v-decorator="['level', { initialValue: '', rules: rules.level }]"
          placeholder="请输入等级"
        ></a-input>
      </a-form-item>
      <a-form-item label="经验值">
        <a-input
          v-decorator="['exp', { initialValue: '', rules: rules.exp }]"
          placeholder="请输入经验值"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'CreateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        level: [{ required: true, message: '请输入等级' }],
        exp: [{ required: true, message: '请输入经验值' }]
      }
    }
  },
  methods: {
    onReset() {
      this.form.resetFields()
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
        // console.log(values)
        this.$emit('submit', { ...values })
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
