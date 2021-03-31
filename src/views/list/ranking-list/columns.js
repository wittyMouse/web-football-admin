export default [
  {
    title: '榜单名称',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '作者',
    dataIndex: 'userId',
    align: 'center',
    scopedSlots: { customRender: 'userId' }
  },
  {
    title: '排序',
    dataIndex: 'sortNum',
    align: 'center'
  },
  {
    title: '推',
    dataIndex: 'tui',
    align: 'center'
  },
  {
    title: '中',
    dataIndex: 'zhong',
    align: 'center'
  },
  {
    title: '走',
    dataIndex: 'zou',
    align: 'center'
  },
  {
    title: '负',
    dataIndex: 'fu',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
