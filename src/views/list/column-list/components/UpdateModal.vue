<template>
  <a-modal
    :visible="visible"
    title="编辑栏目"
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
      <a-form-item label="栏目名称">
        <a-input
          v-decorator="[
            'columnName',
            { initialValue: '', rules: rules.columnName }
          ]"
          placeholder="请输入栏目名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="栏目提示">
        <a-input
          v-decorator="['prompt', { initialValue: '' }]"
          placeholder="请输入栏目提示"
        ></a-input>
      </a-form-item>
      <a-form-item label="排序">
        <a-input
          v-decorator="['sort', { initialValue: '', rules: rules.sort }]"
          placeholder="请输入栏目排序"
        ></a-input>
      </a-form-item>
      <a-form-item label="栏目状态">
        <a-select
          v-decorator="[
            'columnStatus',
            { initialValue: undefined, rules: rules.columnStatus }
          ]"
          placeholder="请选择栏目状态"
        >
          <a-select-option :value="0">隐藏</a-select-option>
          <a-select-option :value="1">正常</a-select-option>
          <a-select-option :value="2">关闭</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const formFields = ['columnName', 'prompt', 'sort', 'columnStatus']

export default {
  name: 'UpdateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    columnDetail: {
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
        columnName: [{ required: true, message: '请输入栏目名称' }],
        sort: [{ required: true, message: '请输入栏目排序' }],
        columnStatus: [{ required: true, message: '请选择栏目状态' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.columnDetail) {
            if (formFields.includes(key)) {
              values[key] = this.columnDetail[key]
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
      this.$emit('update:columnDetail', {})
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
        const { sort } = values
        this.$emit('submit', {
          ...values,
          sort: Number(sort),
          id: this.columnDetail.id
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
