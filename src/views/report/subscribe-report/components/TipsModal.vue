<template>
  <a-modal
    :visible="visible"
    title="返款比例"
    :width="400"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      :form="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
    >
      <a-form-item label="返款比例">
        <a-input
          v-decorator="[
            'percentage',
            { initialValue: '', rules: rules.percentage }
          ]"
          placeholder="请输入返款比例"
          addon-after="%"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'TipsModal',
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
        percentage: [{ required: true, message: '请输入返款比例' }]
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

<style></style>
