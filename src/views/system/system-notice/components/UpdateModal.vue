<template>
  <a-modal
    :visible="visible"
    title="编辑公告"
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
      <a-form-item label="公告内容">
        <a-input
          v-decorator="['content', { initialValue: '', rules: rules.content }]"
          placeholder="请输入公告内容"
        ></a-input>
      </a-form-item>
      <a-form-item label="过期时间">
        <a-date-picker
          :style="{ width: '100%' }"
          v-decorator="['expiryDate', { initialValue: '' }]"
          :show-time="showTime"
          :disabled-date="disabledBeforeDate"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          placeholder="请选择过期时间"
        ></a-date-picker>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'

const formFields = ['content', 'expiryDate']

export default {
  name: 'UpdateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    noticeDetail: {
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
        content: [{ required: true, message: '请输入公告内容' }],
        expiryDate: [{ required: true, message: '请选择过期时间' }]
      },
      showTime: {
        format: 'HH:mm'
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.noticeDetail) {
            if (formFields.includes(key)) {
              values[key] = this.noticeDetail[key]
            }
          }
          this.form.setFieldsValue(values)
        })
      }
    }
  },
  methods: {
    // 禁用之前的日期
    disabledBeforeDate(current) {
      return current && current < moment().startOf('day')
    },

    onReset() {
      this.form.resetFields()
      this.$emit('update:noticeDetail', {})
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
          id: this.noticeDetail.id
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
