<template>
  <a-modal
    :visible="visible"
    title="赠送推介"
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
      <a-form-item label="作者">
        <a-select
          v-decorator="['userId', { initialValue: '', rules: rules.userId }]"
          placeholder="请选择作者"
        >
          <a-select-option
            :value="item.id"
            v-for="item in userList"
            :key="item.id"
            >{{ item.realname }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <!-- <a-form-item label="套餐">
        <a-select
          v-decorator="['type', { initialValue: '', rules: rules.type }]"
          placeholder="请选择套餐"
        >
          <a-select-option :value="0">单日</a-select-option>
          <a-select-option :value="1">包周</a-select-option>
        </a-select>
      </a-form-item> -->

      <a-form-item label="套餐类型">
        <a-radio-group
          v-decorator="['type', { initialValue: '', rules: rules.type }]"
        >
          <a-radio :value="0">单日</a-radio>
          <a-radio :value="1">包周</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'FreeRecommendModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    memberDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    userList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        userId: [{ required: true, message: '请选择作者' }],
        type: [{ required: true, message: '请选择套餐类型' }]
      }
    }
  },
  methods: {
    onReset() {
      this.form.resetFields()
      this.$emit('update:memberDetail', {})
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
        const args = {
          ...values,
          memberId: this.memberDetail.memberId
        }
        this.$emit('submit', args)
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
