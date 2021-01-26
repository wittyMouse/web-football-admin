<template>
  <a-tree
    class="role-auth-tree"
    v-bind="authTreeData"
    checkable
    :selectable="false"
    check-strictly
    @check="onCheck"
    @expand="onExpand"
  >
    <span slot="hasDatarule" slot-scope="{ slotTitle, ruleFlag }">
      {{ slotTitle
      }}<a-icon
        v-if="ruleFlag"
        type="align-left"
        style="margin-left:5px; color: red;"
      ></a-icon>
    </span>
  </a-tree>
</template>

<script>
export default {
  name: 'RoleAuthTree',
  props: {
    authTreeData: {
      type: Object,
      require: true
    }
  },
  methods: {
    onCheck(checkedKeys) {
      this.$emit('check', checkedKeys.checked)
    },
    onExpand(expandedKeys) {
      this.$emit('expand', expandedKeys)
    }
  }
}
</script>

<style lang="less">
.role-auth-tree {
  user-select: none;
}
</style>
