<template>
  <a-drawer
    :visible="visible"
    placement="right"
    :body-style="{ paddingBottom: footer ? '77px' : '' }"
    :mask-closable="false"
    :keyboard="false"
    :after-visible-change="afterVisibleChange"
    v-bind="drawerData"
    @close="onClose"
  >
    <slot></slot>
    <div v-if="footer" class="drawer-footer">
      <slot name="footer">
        <a-button @click="onClose">取消</a-button>
        <a-button @click="onConfirm" type="primary" :loading="loading"
          >确定</a-button
        >
      </slot>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'DrawerPanel',
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    visible: Boolean,
    loading: Boolean,
    drawerData: {
      type: Object,
      required: true
    },
    footer: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 切换抽屉时动画结束后的回调
    afterVisibleChange(visible) {
      this.$emit('change', visible)
    },
    // 关闭抽屉
    onClose() {
      this.$emit('close', false)
    },
    // 确认
    onConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="less">
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  width: 100%;
  text-align: right;
  background: #ffffff;
}
</style>
