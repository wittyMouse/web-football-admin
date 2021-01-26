<template>
  <a-config-provider :locale="zh_CN" :getPopupContainer="getPopupContainer">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
/* eslint camelcase: ["error", {allow: ['zh_CN']}] */

import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { mapState, mapActions } from 'vuex'
import { getData } from '@/utils'

moment.locale('zh-cn')

export default {
  name: 'app',
  data() {
    return {
      zh_CN
    }
  },
  computed: {
    ...mapState(['menuList', 'tabsList'])
  },
  watch: {
    $route(to) {
      // 如果在登录页，跳过后续逻辑
      if (to.name === 'login') {
        return
      }

      // 若当前跳转的页面没有访问过，则往tabsList加一条数据
      if (!this.tabsList.find(item => item.name === to.name)) {
        // let title = ''

        // // 从菜单列表中查找路由标题
        // first: for (let i = 0; i < this.menuList.length; i++) {
        //   if (this.menuList[i].name === to.name) {
        //     title = this.menuList[i].meta.title
        //     break
        //   }
        //   if (
        //     this.menuList[i].children &&
        //     this.menuList[i].children.length > 0
        //   ) {
        //     for (let j = 0; j < this.menuList[i].children.length; j++) {
        //       if (this.menuList[i].children[j].name === to.name) {
        //         title = this.menuList[i].children[j].meta.title
        //         break first
        //       }
        //     }
        //   }
        // }

        this.addTabsList({
          name: to.name,
          title: to.meta.title,
          fullPath: to.fullPath
        })
      }

      // 更新当前激活的tab
      this.updateActiveTab(to.name)

      // 若不在首页则更新打开的二级菜单
      // if (to.name !== 'dashboard') {
      //   this.updateOpenSubMenu([to.matched[0].name])
      // }

      // 更新当前选中的菜单
      this.updateSelectedMenu(to.name)
    }
  },
  methods: {
    ...mapActions([
      'updateUserInfo',
      'updateSelectedMenu',
      'updateOpenSubMenu',
      'addTabsList',
      'updateActiveTab'
    ]),
    getPopupContainer(triggerNode) {
      return triggerNode ? triggerNode.parentNode : window.document.body
    }
  },
  mounted() {
    if (this.$route.name !== 'login') {
      const userInfo = getData('userInfo')
      if (userInfo) {
        this.updateUserInfo(JSON.parse(userInfo))
      }
    }
  }
}
</script>
