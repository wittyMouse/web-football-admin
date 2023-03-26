<template>
  <a-modal
    :visible="visible"
    title="修改订阅金币"
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
      <a-form-item label="单日">
        <a-input
          v-decorator="[
            'dayAmount',
            { initialValue: '', rules: rules.dayAmount }
          ]"
          placeholder="请输入单日价格"
        ></a-input>
      </a-form-item>
      <a-form-item label="包周">
        <a-input
          v-decorator="[
            'weekAmount',
            { initialValue: '', rules: rules.weekAmount }
          ]"
          placeholder="请输入包周价格"
        ></a-input>
      </a-form-item>
      <!-- <a-form-item label="包月">
        <a-input v-decorator="['monthAmount', { initialValue: '' }]"></a-input>
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'EditModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userDetail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        dayAmount: [{ required: true, message: '请输入单日价格' }],
        weekAmount: [{ required: true, message: '请输入包周价格' }]
      }
    }
  },
  methods: {
    onReset() {
      this.form.resetFields()
      this.$emit('update:userDetail', {})
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
        this.$emit('submit', { ...values, id: this.userDetail.id })
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
