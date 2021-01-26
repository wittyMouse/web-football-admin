<template>
  <a-tabs
    class="the-tabs"
    :activeKey="activeTab"
    tabPosition="top"
    size="small"
    :type="this.tabsList.length > 1 ? 'editable-card' : 'card'"
    :hideAdd="true"
    @edit="handleTabEdit"
    @change="handleTabChange"
  >
    <a-tab-pane
      v-for="item in tabsList"
      :tab="item.title"
      :key="item.name"
    ></a-tab-pane>
  </a-tabs>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TheTabs',
  computed: {
    ...mapState(['tabsList', 'activeTab'])
  },
  methods: {
    ...mapActions(['updateTabsList']),
    // 编辑tab
    handleTabEdit(targetKey, action) {
      // 删除tab
      if (action === 'remove') {
        if (targetKey === 'dashboard') {
          this.$_message.error('首页不能删除')
        } else {
          const arr = this.tabsList.filter(item => item.name !== targetKey)
          const idx = this.tabsList.findIndex(item => item.name === targetKey)
          this.updateTabsList(arr)

          // 如果是当前选中的tab
          if (this.activeTab === targetKey) {
            const route = arr[idx] ? arr[idx] : arr[idx - 1]
            this.$router.push({ path: route.fullPath })
          }
        }
      }
    },

    // 切换tab
    handleTabChange(targetKey) {
      const route = this.tabsList.find(item => item.name === targetKey)
      this.$router.push({ path: route.fullPath })
    }
  }
}
</script>

<style lang="less">
.the-tabs {
  .ant-tabs-bar {
    margin: 0;
  }
}
</style>
