<template>
  <a-modal
    :visible="visible"
    title="编辑渠道"
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
      <a-form-item label="渠道名称">
        <a-input
          v-decorator="[
            'channelName',
            { initialValue: '', rules: rules.channelName }
          ]"
          placeholder="请输入渠道名称"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const formFields = ['channelName']

export default {
  name: 'UpdateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    channelDetail: {
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
        channelName: [{ required: true, message: '请输入渠道名称' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.channelDetail) {
            if (formFields.includes(key)) {
              values[key] = this.channelDetail[key]
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
      this.$emit('update:channelDetail', {})
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
          id: this.channelDetail.id
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
