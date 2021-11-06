<template>
  <a-modal
    :visible="visible"
    title="推介购买列表"
    :width="900"
    :footer="null"
    :afterClose="afterClose"
    @cancel="onCancel"
  >
    <a-table
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      size="middle"
    >
    </a-table>
  </a-modal>
</template>

<script>
import columns from './columns'

export default {
  name: 'RecommendTableModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      columns
    }
  },
  methods: {
    // 完全关闭后
    afterClose() {
      this.$emit('update:dataSource', [])
    },

    // 取消
    onCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped></style>
