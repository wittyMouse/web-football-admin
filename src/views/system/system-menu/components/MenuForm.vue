<template>
  <a-form :form="form" autocomplete="off">
    <a-form-item label="菜单类型">
      <a-radio-group
        v-decorator="['menuType', { initialValue: currentMenuType }]"
        @change="handleMenuTypeChange"
      >
        <a-radio :value="0">一级菜单</a-radio>
        <a-radio :value="1">子菜单</a-radio>
        <a-radio :value="2">按钮/权限</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item :label="currentMenuType === 2 ? '按钮/权限' : '菜单名称'">
      <a-input
        v-decorator="['name', { initialValue: '', rules: rules.name }]"
        :placeholder="
          `请输入${currentMenuType === 2 ? '按钮/权限' : '菜单'}名称`
        "
      />
    </a-form-item>

    <a-form-item v-show="currentMenuType !== 0" label="上级菜单">
      <a-tree-select
        style="width: 100%"
        :treeData="treeList"
        placeholder="请选择上级菜单"
        v-decorator="['parentId', { rules: rules.parentId }]"
      >
      </a-tree-select>
    </a-form-item>

    <a-form-item label="权限编码" v-show="currentMenuType === 2">
      <a-input
        v-decorator="['perms', { initialValue: '', rules: rules.perms }]"
        placeholder="请输入权限编码"
      />
    </a-form-item>

    <a-form-item label="菜单路径" v-show="currentMenuType !== 2">
      <a-input
        v-decorator="['url', { initialValue: '', rules: rules.url }]"
        placeholder="请输入菜单路径"
      />
    </a-form-item>

    <!-- <a-form-item
      v-show="currentMenuType === 0"
      label="默认跳转地址"
    >
      <a-input
        v-decorator="['redirect', { initialValue: '' }]"
        placeholder="请输入默认跳转地址"
      />
    </a-form-item> -->

    <a-form-item label="菜单图标" v-show="currentMenuType === 0">
      <a-input
        v-decorator="['icon', { rules: rules.icon }]"
        read-only
        placeholder="请输入菜单图标"
      >
        <a-icon slot="addonAfter" type="setting" @click="handleOpenIconPanel" />
      </a-input>
    </a-form-item>

    <a-form-item label="排序" v-show="currentMenuType !== 2">
      <a-input-number
        style="width: 50%"
        v-decorator="['sortNo', { initialValue: 0, rules: rules.sortNo }]"
        placeholder="请输入菜单排序"
        :min="0"
        :max="9999"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { onlyNumberAndDecimal } from '@/utils/validate'
const validatorSortNo = (rule, value, callback) => {
  if (value && !onlyNumberAndDecimal(value)) {
    callback(new Error('菜单排序只能为整数或小数'))
  } else {
    callback()
  }
}

export default {
  name: 'MenuForm',
  props: {
    // 父级菜单列表
    treeList: Array,
    // 菜单表单数据
    menuFormData: Object
  },
  data() {
    return {
      form: this.$form.createForm(this),
      // 当前菜单类型
      currentMenuType: 0
    }
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: '请输入菜单名称' }],
        parentId: [{ required: true, message: '请选择上级菜单' }],
        url: [
          { required: this.currentMenuType !== 2, message: '请输入菜单路径' }
        ],
        icon: [{ required: true, message: '请选择菜单图标' }],
        sortNo: [
          { required: true, message: '请输入菜单排序' },
          { validator: validatorSortNo }
        ],
        perms: [{ required: true, message: '请输入权限编码' }]
      }
    }
  },
  methods: {
    // 切换菜单类型
    handleMenuTypeChange(e) {
      this.currentMenuType = e.target.value
    },

    // 打开icon选择框
    handleOpenIconPanel() {
      this.$emit('icon-change')
    },

    // 数据初始化
    formDataInit(data) {
      this.currentMenuType = data.menuType
      const obj = {
        menuType: data.menuType,
        name: data.name ? data.name : '',
        parentId: data.parentId ? data.parentId : null,
        perms: data.perms ? data.perms : '',
        url: data.url ? data.url : '',
        // redirect: data.redirect ? data.redirect : '',
        icon: data.icon,
        sortNo: data.sortNo
      }
      this.form.setFieldsValue(obj)
    }
  }
}
</script>

<style lang="less">
.menu-form {
}
</style>
