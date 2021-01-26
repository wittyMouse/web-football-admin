<template>
  <a-modal
    title="选择图标"
    :visible="visible"
    :width="848"
    :bodyStyle="{ height: '600px', overflowY: 'auto' }"
    :keyboard="false"
    :maskClosable="false"
    :footer="null"
    :afterClose="afterClose"
    @cancel="onCancel"
  >
    <div class="icon-list clearfix">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        class="icon-list-item float-left"
        @click="onChange(index)"
      >
        <a-icon :type="item" />
      </div>
    </div>
  </a-modal>
</template>

<script>
import iconList from '@/utils/iconList'

export default {
  name: 'IconSelectModal',
  props: {
    visible: Boolean
  },
  data() {
    return {
      iconList
    }
  },
  methods: {
    // Modal完全关闭后的回调
    afterClose() {
      this.$emit('afterClose')
    },
    // 关闭Modal
    onCancel() {
      this.$emit('update:visible', false)
    },
    // 修改图标
    onChange(idx) {
      this.$emit('change', this.iconList[idx])
    }
  }
}
</script>

<style lang="less">
.icon-list {
}

.icon-list-item {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  font-size: 30px;
  text-align: center;
  line-height: 60px;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
  cursor: pointer;

  .anticon {
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    background-color: #1a90ff;
    color: #fff;

    .anticon {
      transform: scale(1.4);
    }
  }
}
</style>
