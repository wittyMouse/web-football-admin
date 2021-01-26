<template>
  <a-modal
    :visible="visible"
    title="会员信息"
    :width="1000"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      :form="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
    >
      <a-row type="flex">
        <a-col :span="6">
          <a-form-item label="编号">
            {{ memberDetail.memberId }}
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="账号">
            {{ memberDetail.account }}
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="昵称">
            {{ memberDetail.nickname }}
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="渠道">
            {{ memberDetail.channelName }}
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="手机">
            <a-input
              v-decorator="['mobile', { initialValue: '' }]"
              placeholder="请输入手机号码"
            ></a-input>
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="状态">
            <a-select
              v-decorator="['status', { initialValue: '' }]"
              placeholder="请选择"
            >
              <a-select-option :value="0">停用</a-select-option>
              <a-select-option :value="1">限制</a-select-option>
              <a-select-option :value="2">正常</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="积分">
            {{ memberDetail.integral }}
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="金币">
            {{ memberDetail.balance }}
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="注册时间">
            {{ memberDetail.registerTime }}
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="更新时间">
            {{ memberDetail.upgradeTime }}
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="最后登录">
            {{ memberDetail.lastLoginTime }}
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="重置密码">
            <a-button
              type="primary"
              icon="reload"
              :loading="loading"
              @click="onResetClick"
              >重置</a-button
            >
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { hasAuth, phoneNumberFilter } from '@/utils'

const formFields = ['mobile', 'status']

export default {
  name: 'UpdateModal',
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
    loading: {
      type: Boolean,
      default: false
    },
    userPermissionMap: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.memberDetail) {
            if (formFields.includes(key)) {
              values[key] = this.memberDetail[key]
            }
          }
          if (
            values.mobile &&
            !hasAuth(this.userPermissionMap, this.$route.name, 'fullPhone')
          ) {
            values.mobile = this.phoneNumberFilter(values.mobile)
          }
          this.form.setFieldsValue(values)
        })
      }
    }
  },
  methods: {
    phoneNumberFilter,

    onReset() {
      this.form.resetFields()
      this.$emit('update:memberDetail', {})
    },

    // 完全关闭后
    afterClose() {
      this.onReset()
      this.$emit('afterClose')
    },

    // 重置密码
    onResetClick() {
      this.$confirm({
        title: `是否重置用户密码为：123456`,
        onOk: () => {
          this.$emit('reset', { id: this.memberDetail.id })
        }
      })
    },

    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) return
        const { mobile } = values
        const args = {
          ...values,
          id: this.memberDetail.id
        }
        if (mobile.indexOf('*') > -1) {
          args.mobile = this.memberDetail.mobile
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
