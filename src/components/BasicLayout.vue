<template>
  <a-layout class="basic-layout">
    <div v-if="loadPermission" class="basic-layout-page-loading">
      <a-spin size="large" />
    </div>

    <template v-else>
      <!-- 侧边栏 -->
      <a-layout-sider
        breakpoint="lg"
        :width="200"
        collapsible
        :trigger="null"
        v-model="collapsed"
      >
        <TheSider :collapsed="collapsed" />
      </a-layout-sider>

      <a-layout>
        <!-- 页眉 -->
        <a-layout-header>
          <TheHeader :collapsed.sync="collapsed" />
        </a-layout-header>

        <!-- 内容 -->
        <a-layout-content>
          <TheTabs />

          <el-scrollbar
            style="height: calc(100vh - 104px);"
            wrap-class="overflow-x-hidden"
          >
            <slot>
              <keep-alive :include="keepAliveList">
                <router-view />
              </keep-alive>
            </slot>
          </el-scrollbar>
        </a-layout-content>
      </a-layout>
    </template>
  </a-layout>
</template>

<script>
import TheSider from '@/components/TheSider'
import TheHeader from '@/components/TheHeader'
import TheTabs from '@/components/TheTabs'
import isEmpty from 'lodash/isEmpty'
import { mapState, mapActions } from 'vuex'
import { getToken } from '@/utils'

export default {
  name: 'BasicLayout',
  components: {
    TheSider,
    TheHeader,
    TheTabs
  },
  data() {
    return {
      // 导航栏收缩扩展状态
      collapsed: false,
      // 加载权限相关信息状态
      loadPermission: true
    }
  },
  computed: {
    ...mapState(['tabsList']),

    keepAliveList() {
      if (isEmpty(this.tabsList)) {
        return []
      }

      const arr = this.tabsList.map(item => item.name)
      return arr
    }
  },
  methods: {
    ...mapActions([
      'updateMenuList',
      'updateOpenSubMenu',
      'queryPermissionsByUser'
    ]),
    // 获取用户权限信息
    queryPermissions() {
      this.loadPermission = true
      const token = getToken()
      this.queryPermissionsByUser({
        token,
        cb: () => {
          this.loadPermission = false
        }
      })
    }
  },
  mounted() {
    this.queryPermissions()
  }
}
</script>

<style lang="less">
.basic-layout {
  position: relative;
  min-height: 100% !important;

  .ant-layout-header {
    padding: 0;
    width: 100%;
    background: #fff;
  }
}

.basic-layout-page-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  transition: background 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
