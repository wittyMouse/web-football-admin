<template>
  <a-modal
    :visible="visible"
    title="导出"
    :width="520"
    :keyboard="false"
    :maskClosable="false"
    okText="导出"
    :afterClose="afterClose"
    @ok="handleConfirmClick"
    @cancel="cancel"
  >
    <div>
      <p>
        当前每页条数：{{ pageSize }}，数据总条数：{{ total }}，可导出页数：{{
          totalPage
        }}
      </p>
      <p>
        导出页数：
        <a-select :style="{ width: '174px' }" v-model="value">
          <a-select-option value="">全部</a-select-option>
          <a-select-option v-for="(item, index) in totalPage" :key="index + 1"
            >导出 {{ index + 1 }} 页</a-select-option
          >
        </a-select>
      </p>
      <p>是否导出相应excel文件？</p>
      <p>
        (注意如数据过大，导出时间将相应增加。同时数据超出excel限制最大,则回丢失数据！）
      </p>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'ExportModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    totalPage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    // Modal 完全关闭后的回调
    afterClose() {
      this.$emit('afterClose')
    },

    // 点击确认按钮
    handleConfirmClick() {
      const size = this.value
        ? this.pageSize * this.value
        : this.pageSize * this.totalPage
      this.$emit('confirm', size)
    },

    // 点击取消按钮
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less"></style>
