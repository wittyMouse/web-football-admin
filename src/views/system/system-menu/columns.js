export default [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    key: 'menuType',
    customRender: text => {
      let str = ''
      switch (text) {
        case 0:
          str = '一级菜单'
          break
        case 1:
          str = '子菜单'
          break
        case 2:
          str = '按钮/权限'
          break
      }
      return str
    }
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    key: 'icon'
  },
  {
    title: '路径',
    dataIndex: 'url',
    key: 'url',
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '排序',
    dataIndex: 'sortNo',
    key: 'sortNo'
  },
  // {
  //   title: '权限编码',
  //   dataIndex: 'perms',
  //   key: 'perms'
  // },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
