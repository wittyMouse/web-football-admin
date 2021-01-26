<template>
  <a-modal
    :visible="visible"
    title="修改用户排序号"
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
      <a-form-item label="排序">
        <a-input
          v-decorator="['sortNum', { initialValue: '', rules: rules.sortNum }]"
          placeholder="请输入排序"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const formFields = ['sortNum']

export default {
  name: 'UpdateModal',
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
        sortNum: [{ required: true, message: '请输入排序' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.userDetail) {
            if (formFields.includes(key)) {
              values[key] = this.userDetail[key]
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
      this.$emit('udpate:userDetail', {})
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
        const { sortNum } = values
        this.$emit('submit', {
          ...values,
          sortNum: Number(sortNum),
          id: this.userDetail.id
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
