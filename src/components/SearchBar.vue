<template>
  <a-card class="search-bar">
    <slot></slot>
  </a-card>
</template>

<script>
export default {
  name: 'SearchBar'
}
</script>

<style lang="less">
.search-bar.ant-card {
  margin-bottom: 24px;
}
</style>
