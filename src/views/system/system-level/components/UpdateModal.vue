<template>
  <a-modal
    :visible="visible"
    title="编辑等级配置"
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
const formFields = ['level', 'exp']

export default {
  name: 'UpdateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    levelDetail: {
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
        level: [{ required: true, message: '请输入等级' }],
        exp: [{ required: true, message: '请输入经验值' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.levelDetail) {
            if (formFields.includes(key)) {
              values[key] = this.levelDetail[key]
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
      this.$emit('update:levelDetail', {})
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
          id: this.levelDetail.id
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
