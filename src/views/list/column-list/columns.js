const statusList = ['隐藏', '正常', '关闭']

export default [
  {
    title: '栏目编号',
    dataIndex: 'columnId',
    align: 'center'
  },
  {
    title: '栏目名称',
    dataIndex: 'columnName',
    align: 'center'
  },
  // {
  //   title: '父级栏目',
  //   dataIndex: 'parentId',
  //   align: 'center'
  // },
  {
    title: '栏目提示',
    dataIndex: 'prompt',
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    align: 'center'
  },
  {
    title: '栏目状态',
    dataIndex: 'columnStatus',
    align: 'center',
    customRender: text => statusList[text]
  }
  // {
  //   title: '页面模板',
  //   dataIndex: 'template',
  //   align: 'center'
  // },
  // {
  //   title: '操作',
  //   key: 'options',
  //   align: 'center',
  //   scopedSlots: { customRender: 'options' }
  // }
]
