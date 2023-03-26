<template>
  <a-modal
    :visible="visible"
    title="添加榜单数据"
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
      <a-form-item label="榜单名称">
        <a-select
          v-decorator="['type', { initialValue: undefined, rules: rules.type }]"
          placeholder="请选择榜单名称"
        >
          <a-select-option :value="0">王牌推介榜</a-select-option>
          <a-select-option :value="1">劲爆贴士榜</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="作者">
        <a-select
          v-decorator="[
            'userId',
            { initialValue: undefined, rules: rules.userId }
          ]"
          placeholder="请选择作者"
        >
          <a-select-option v-for="item in userList" :key="item.id">{{
            item.realname
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="排序">
        <a-input-number
          :style="{ width: '100%' }"
          v-decorator="['sortNum', { initialValue: '', rules: rules.sortNum }]"
          placeholder="请输入排序"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="推">
        <a-input-number
          :style="{ width: '100%' }"
          v-decorator="['tui', { initialValue: '', rules: rules.tui }]"
          placeholder="请输入推"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="中">
        <a-input-number
          :style="{ width: '100%' }"
          v-decorator="['zhong', { initialValue: '', rules: rules.zhong }]"
          placeholder="请输入中"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="走">
        <a-input-number
          :style="{ width: '100%' }"
          v-decorator="['zou', { initialValue: '', rules: rules.zou }]"
          placeholder="请输入走"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="负">
        <a-input-number
          :style="{ width: '100%' }"
          v-decorator="['fu', { initialValue: '', rules: rules.fu }]"
          placeholder="请输入负"
          :min="0"
        />
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
    userList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        type: [{ required: true, message: '请选择榜单名称' }],
        userId: [{ required: true, message: '请选择作者' }],
        sortNum: [{ required: true, message: '请输入排序' }],
        tui: [{ required: true, message: '请输入推' }],
        zhong: [{ required: true, message: '请输入中' }],
        zou: [{ required: true, message: '请输入走' }],
        fu: [{ required: true, message: '请输入负' }]
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
        // console.log('values', values)
        this.$emit('submit', {
          ...values
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

<style lang="less" scoped>
.ant-input-number::v-deep .ant-input-number-handler-wrap {
  display: none;
}
</style>
