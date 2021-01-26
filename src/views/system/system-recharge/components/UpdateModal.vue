<template>
  <a-modal
    :visible="visible"
    title="编辑充值赠送配置"
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
      <a-form-item label="充值数量">
        <a-input
          v-decorator="[
            'rechargeAmount',
            { initialValue: '', rules: rules.rechargeAmount }
          ]"
          placeholder="请输入充值数量"
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
          placeholder="请选择类型"
        >
          <a-select-option :value="0">积分</a-select-option>
          <a-select-option :value="1">金币</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const formFields = ['rechargeAmount', 'donateIntegral', 'type']

export default {
  name: 'UpdateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rechargeDetail: {
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
        rechargeAmount: [{ required: true, message: '请输入充值数量' }],
        donateIntegral: [{ required: true, message: '请输入赠送数量' }],
        type: [{ required: true, message: '请选择赠送类型' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.rechargeDetail) {
            if (formFields.includes(key)) {
              values[key] = this.rechargeDetail[key]
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
      this.$emit('update:rechargeDetail', {})
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
        this.$emit('submit', {
          ...values,
          id: this.rechargeDetail.id
        })
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
