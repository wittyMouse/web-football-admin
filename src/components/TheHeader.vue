<template>
  <header class="the-header">
    <span class="the-header__icon trigger" @click="handleTriggerEvent">
      <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
    </span>

    <div class="the-header__layout">
      <!-- <span class="the-header__icon">
        <a-icon type="bell" />
      </span>
      <span class="the-header__icon">
        <a-icon type="logout" />
      </span> -->
      <a-dropdown>
        <a class="the-header__dropmenu">{{ userInfo.username }}</a>
        <a-menu slot="overlay">
          <a-menu-item>
            <a @click="handleLogOut">退出</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { logout } from '@/api'
import { clearData } from '@/utils'

export default {
  name: 'TheHeader',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['clearStoreData']),
    // 导航栏收缩扩展事件
    handleTriggerEvent() {
      this.$emit('update:collapsed', !this.collapsed)
    },
    // 退出登录
    handleLogOut() {
      this.$confirm({
        title: '提示',
        content: '您真的要退出登录吗?',
        keyboard: false,
        onOk: () => {
          logout().finally(() => {
            this.clearStoreData()
            clearData()
            this.$router.push({ name: 'login' })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.the-header {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.the-header__icon {
  padding: 0 12px;
  line-height: 64px;
  cursor: pointer;

  &.trigger {
    padding: 0 24px;

    .anticon {
      font-size: 20px;
      transition: color 0.3s;
    }

    &:hover {
      .anticon {
        color: #1890ff;
      }
    }
  }
}

.the-header__layout {
  flex: 1 0 auto;
  text-align: right;
}

.the-header__dropmenu {
  display: inline-block;
  padding: 0 12px;
  line-height: 64px;
  transition: background-color 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
</style>
