<template>
  <a-modal
    :visible="visible"
    title="充值成功"
    :width="300"
    :afterClose="afterClose"
    @cancel="onCancel"
  >
    <template slot="footer">
      <a-button type="primary" @click="onCancel">确定</a-button>
    </template>

    <div>
      <a-row class="recharge-info-modal-item">
        <a-col class="recharge-info-modal-label" :span="8">会员编号：</a-col>
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeInfo.memberId
        }}</a-col>
      </a-row>

      <a-row class="recharge-info-modal-item">
        <a-col class="recharge-info-modal-label" :span="8">会员账户：</a-col>
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeInfo.account
        }}</a-col>
      </a-row>

      <a-row class="recharge-info-modal-item">
        <a-col class="recharge-info-modal-label" :span="8">会员昵称：</a-col>
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeInfo.nickname
        }}</a-col>
      </a-row>

      <a-row class="recharge-info-modal-item">
        <a-col class="recharge-info-modal-label" :span="8"
          >充值前{{ target ? rechargeTarget[target] : '' }}：</a-col
        >
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeInfo.beforeValue
        }}</a-col>
      </a-row>

      <a-row class="recharge-info-modal-item">
        <a-col class="recharge-info-modal-label" :span="8"
          >充值{{ target ? rechargeTarget[target] : '' }}：</a-col
        >
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeInfo.value
        }}</a-col>
      </a-row>

      <!-- <a-row class="recharge-info-modal-item">
        <a-col class="recharge-info-modal-label" :span="8"
          >充值后{{ target ? rechargeTarget[target] : '' }}：</a-col
        >
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeInfo.afterValue
        }}</a-col>
      </a-row> -->

      <a-row class="recharge-info-modal-item" v-show="target === 'coin'">
        <a-col class="recharge-info-modal-label" :span="8">充值方式：</a-col>
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeTypeMap[rechargeInfo.type]
        }}</a-col>
      </a-row>

      <!-- <a-row class="recharge-info-modal-item">
        <a-col class="recharge-info-modal-label" :span="8">订单号：</a-col>
        <a-col class="recharge-info-modal-value" :span="16">{{
          rechargeInfo.orderId
        }}</a-col>
      </a-row> -->
    </div>
  </a-modal>
</template>

<script>
const rechargeTarget = {
  points: '积分',
  coin: '金币'
}

const rechargeTypeMap = {
  0: '系统充值',
  1: '微信支付'
}

export default {
  name: 'RechargeInfoModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: ''
    },
    rechargeInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rechargeTarget,
      rechargeTypeMap
    }
  },
  methods: {
    onReset() {
      this.$emit('update:rechargeInfo', {})
    },

    // 完全关闭后
    afterClose() {
      this.onReset()
      this.$emit('afterClose')
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

.recharge-info-modal-item:not(:last-child) {
  margin-bottom: 16px;
}
.recharge-info-modal-label {
  text-align: right;
}
</style>
