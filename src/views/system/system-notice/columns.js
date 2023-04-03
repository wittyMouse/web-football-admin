export default [
  {
    title: '序号',
    key: 'sort',
    width: 50,
    align: 'center',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '编号',
    dataIndex: 'noticeId',
    align: 'center'
  },
  {
    title: '内容',
    dataIndex: 'content',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '过期时间',
    dataIndex: 'expiryDate',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
