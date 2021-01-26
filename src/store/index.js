import Vue from 'vue'
import Vuex from 'vuex'
import { queryPermissionsByUser } from '@/api'
import {
  SET_USER_INFO,
  SET_MENU_LIST,
  SET_TABS_LIST,
  ADD_TABS_LIST,
  SET_ACTIVE_TAB,
  SET_SELECTED_MENU,
  SET_OPEN_SUB_MENU,
  SET_USER_PERMISSION,
  SET_USER_PERMISSION_MAP
} from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {},
    // 菜单列表
    menuList: [],
    // 当前选中菜单
    selectedMenu: '',
    // 当前打开的SubMenu菜单
    openSubMenu: [],
    // tabs列表
    tabsList: [],
    // 当前选中tab
    activeTab: '',
    // 用户权限
    userPermission: {},
    // 用户权限 Map
    userPermissionMap: {}
  },
  mutations: {
    // 存储用户信息
    [SET_USER_INFO](state, data) {
      state.userInfo = data
    },
    // 存储菜单信息
    [SET_MENU_LIST](state, data) {
      state.menuList = data
    },
    // 存储当前选中菜单
    [SET_SELECTED_MENU](state, data) {
      state.selectedMenu = data
    },
    // 存储当前打开的SubMenu菜单
    [SET_OPEN_SUB_MENU](state, data) {
      state.openSubMenu = data
    },
    // 存储tabsList信息
    [SET_TABS_LIST](state, data) {
      state.tabsList = data
    },
    // 增加tabsList信息
    [ADD_TABS_LIST](state, data) {
      state.tabsList.push(data)
    },
    // 存储当前选中tab信息
    [SET_ACTIVE_TAB](state, data) {
      state.activeTab = data
    },
    // 存储用户权限
    [SET_USER_PERMISSION](state, data) {
      state.userPermission = data
    },
    // 存储用户权限 Map
    [SET_USER_PERMISSION_MAP](state, data) {
      state.userPermissionMap = data
    }
  },
  actions: {
    // 存储用户信息
    updateUserInfo({ commit }, data) {
      commit(SET_USER_INFO, data)
    },
    // 存储菜单信息
    updateMenuList({ commit }, data) {
      commit(SET_MENU_LIST, data)
    },
    // 存储当前选中菜单
    updateSelectedMenu({ commit }, data) {
      commit(SET_SELECTED_MENU, data)
    },
    // 存储当前打开的SubMenu菜单
    updateOpenSubMenu({ commit }, data) {
      commit(SET_OPEN_SUB_MENU, data)
    },
    // 存储tabsList信息
    updateTabsList({ commit }, data) {
      commit(SET_TABS_LIST, data)
    },
    // 增加tabsList信息
    addTabsList({ commit }, data) {
      commit(ADD_TABS_LIST, data)
    },
    // 存储当前选中tab信息
    updateActiveTab({ commit }, data) {
      commit(SET_ACTIVE_TAB, data)
    },
    // 退出时还原所有store数据
    clearStoreData({ commit }) {
      commit(SET_USER_INFO, {})
      commit(SET_MENU_LIST, [])
      commit(SET_SELECTED_MENU, '')
      commit(SET_OPEN_SUB_MENU, [])
      commit(SET_TABS_LIST, [])
      commit(SET_ACTIVE_TAB, '')
    },
    // 获取用户权限信息
    queryPermissionsByUser({ commit }, data) {
      const params = {
        token: data.token
      }
      queryPermissionsByUser(params)
        .then(res => {
          if (res.success) {
            const { auth, menu } = res.result
            const menuList = menu.filter(item => item.name !== 'home')
            const openSubMenu = []
            menu.forEach(item => {
              if (item.children && item.children.length > 0) {
                openSubMenu.push(item.name)
              }
            })
            const userPermissionMap = {}
            auth.forEach(item => {
              if (item.action.indexOf(':') > -1) {
                const [key, perms] = item.action.split(':')
                if (!userPermissionMap[key]) {
                  userPermissionMap[key] = {}
                }
                userPermissionMap[key][perms] = true
              }
            })
            commit(SET_USER_PERMISSION, res.result)
            commit(SET_USER_PERMISSION_MAP, userPermissionMap)
            commit(SET_MENU_LIST, menuList)
            commit(SET_OPEN_SUB_MENU, openSubMenu)
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          data.cb && data.cb()
        })
    }
  },
  modules: {}
})
