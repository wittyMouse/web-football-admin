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
    dataIndex: 'channelId',
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'channelName',
    align: 'center'
  },
  {
    title: '添加时间',
    dataIndex: 'createDate',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
