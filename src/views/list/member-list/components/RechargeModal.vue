<template>
  <a-modal
    :visible="visible"
    :title="target ? rechargeTitle[target] : ''"
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
      <a-form-item label="会员编号">
        {{ memberDetail.memberId }}
      </a-form-item>
      <a-form-item label="会员账户">
        {{ memberDetail.account }}
      </a-form-item>
      <a-form-item label="会员昵称">
        {{ memberDetail.nickname }}
      </a-form-item>
      <a-form-item label="充值积分" v-show="target === 'points'">
        <a-input
          v-decorator="[
            'integral',
            {
              initialValue: '',
              rules: target === 'points' ? rules.integral : []
            }
          ]"
          placeholder="请输入积分"
        ></a-input>
      </a-form-item>
      <a-form-item v-show="target === 'points'">
        <div class="tips-text">
          请注意：充值积分为添加积分，非修改积分值
        </div>
      </a-form-item>
      <a-form-item label="充值金币" v-show="target === 'coin'">
        <a-input
          v-decorator="[
            'balance',
            { initialValue: '', rules: target === 'coin' ? rules.balance : [] }
          ]"
          placeholder="请输入金币"
        ></a-input>
      </a-form-item>
      <a-form-item v-show="target === 'coin'">
        <div class="tips-text">
          请注意：充值金币为添加金币，非修改金币余额值
        </div>
      </a-form-item>
      <a-form-item label="充值方式" v-show="target === 'coin'">
        <!-- <a-select
          v-decorator="[
            'type',
            {
              initialValue: undefined,
              rules: target === 'coin' ? rules.type : []
            }
          ]"
          placeholder="请选择充值方式"
        >
          <a-select-option :value="0">系统充值</a-select-option>
          <a-select-option :value="1">微信支付</a-select-option>
        </a-select> -->
        <a-select
          v-decorator="[
            'type',
            {
              initialValue: 0,
              rules: target === 'coin' ? rules.type : []
            }
          ]"
          placeholder="请选择充值方式"
        >
          <a-select-option :value="0">系统充值</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const rechargeTitle = {
  points: '积分充值',
  coin: '金币充值'
}

export default {
  name: 'RechargeModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: ''
    },
    memberDetail: {
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
        integral: [{ required: true, message: '请输入积分' }],
        balance: [{ required: true, message: '请输入金币' }],
        type: [{ required: true, message: '请选择充值方式' }]
      },
      rechargeTitle
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
        const { balance, integral, type } = values
        const args = {}
        switch (this.target) {
          case 'points':
            args.integral = integral
            break
          case 'coin':
            args.balance = balance
            args.type = type
            break
        }
        this.$emit('submit', { ...args, id: this.memberDetail.id })
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
.tips-text {
  text-indent: 22px;
  color: #ff3737;
}
</style>
