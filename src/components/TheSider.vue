<template>
  <aside class="the-sider the-sider--layout">
    <a class="the-sider__header" href="/">
      <img class="the-sider__logo" src="../assets/images/logo.svg" alt="logo" />
      <h3 class="the-sider__title" v-if="!collapsed">巅峰后台</h3>
    </a>

    <el-scrollbar
      style="height: calc(100vh - 64px);"
      wrap-class="overflow-x-hidden"
    >
      <a-menu
        mode="inline"
        theme="dark"
        :selectedKeys="[selectedMenu]"
        :openKeys="openSubMenu"
        @openChange="handleOpenChange"
      >
        <template v-for="item in menuList">
          <a-sub-menu v-if="item.children" :key="item.name">
            <span slot="title">
              <a-icon :type="item.meta.icon" />
              <span>{{ item.meta.title }}</span>
            </span>
            <a-menu-item
              v-for="subItem in item.children"
              :key="subItem.name.replace(`${item.name}-`, '')"
            >
              <router-link :to="subItem.path">
                <span>{{ subItem.meta.title }}</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="item.name">
            <router-link :to="item.path">
              <a-icon :type="item.meta.icon" />
              <span>{{ item.meta.title }}</span>
            </router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </el-scrollbar>
  </aside>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TheSider',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['menuList', 'selectedMenu', 'openSubMenu'])
  },
  methods: {
    ...mapActions(['updateOpenSubMenu']),
    handleOpenChange(openKeys) {
      this.updateOpenSubMenu(openKeys)
    }
  }
}
</script>

<style lang="less">
.the-sider {
  &.the-sider--layout {
    position: relative;
    z-index: 10;
    min-width: 0;
    min-height: 100%;
    background: #001529;
    transition: all 0.2s;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  }
}

.the-sider__header {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 24px;
  height: 64px;
  overflow: hidden;
  background: #001529;
  cursor: pointer;
  transition: all 0.3s;

  .the-sider__logo {
    width: 32px;
    height: 32px;
  }

  .the-sider__title {
    display: inline-block;
    margin: 0 0 0 12px;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    animation: fade-in;
    animation-duration: 0.3s;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
// 768
// 992
</style>
