<template>
  <a-modal
    :visible="visible"
    title="添加用户"
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
      <a-form-item label="用户账号">
        <a-select
          v-decorator="[
            'username',
            { initialValue: undefined, rules: rules.username }
          ]"
          placeholder="请选择用户账号"
        >
          <a-select-option v-for="item in userList" :key="item.username">{{
            item.username
          }}</a-select-option>
        </a-select>
      </a-form-item>
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
export default {
  name: 'CreateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        username: [{ required: true, message: '请选择用户账号' }],
        sortNum: [{ required: true, message: '请输入排序' }]
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
        const { sortNum } = values
        this.$emit('submit', {
          ...values,
          sortNum: Number(sortNum),
          depId: this.id
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
