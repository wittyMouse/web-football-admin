<template>
  <a-modal
    :visible="visible"
    title="添加签到配置"
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
      <a-form-item label="签到日期">
        <a-input
          v-decorator="['dayNum', { initialValue: '', rules: rules.dayNum }]"
          placeholder="请输入签到日期"
        ></a-input>
      </a-form-item>
      <a-form-item label="赠送数量">
        <a-input
          v-decorator="[
            'donateIntegral',
            { initialValue: '', rules: rules.donateIntegral }
          ]"
          placeholder="请输入赠送数量"
        ></a-input>
      </a-form-item>
      <a-form-item label="赠送类型">
        <a-select
          v-decorator="['type', { initialValue: undefined, rules: rules.type }]"
          placeholder="请选择赠送类型"
        >
          <a-select-option :value="0">积分</a-select-option>
          <a-select-option :value="1">金币</a-select-option>
        </a-select>
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
        dayNum: [{ required: true, message: '请输入签到日期' }],
        donateIntegral: [{ required: true, message: '请输入赠送数量' }],
        type: [{ required: true, message: '请选择赠送类型' }]
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
