<template>
  <a-card class="table-block">
    <div v-if="title" class="table-block-header">
      <div class="table-block-header-title">{{ title }}</div>
      <div class="table-block-header-option">
        <slot name="option"></slot>
        <div class="table-block-header-default-option"></div>
      </div>
    </div>
    <div class="table-block-content">
      <slot></slot>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'TableBlock',
  props: {
    title: String
  }
}
</script>

<style lang="less">
.table-block {
  // height: calc(100vh - (64px + 40px + 24px + 90px + 24px));

  .ant-card-body {
    padding: 0;
  }
}

.table-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}

.table-block-header-title {
  flex: 1 0;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  opacity: 0.85;
}

.table-block-header-option {
}

.table-block-header-default-option {
}

.table-block-content {
  // padding: 0 24px;
}
</style>
