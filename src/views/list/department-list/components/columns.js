export default [
  {
    title: '用户编号',
    dataIndex: 'userId',
    align: 'center'
  },
  {
    title: '用户名称',
    dataIndex: 'username',
    align: 'center'
  },
  {
    title: '用户角色',
    dataIndex: 'realname',
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'sortNum',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
