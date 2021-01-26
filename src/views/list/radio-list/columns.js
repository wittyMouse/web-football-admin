export default [
  {
    title: '节目编号',
    dataIndex: 'recordId',
    align: 'center'
  },
  {
    title: '节目类型',
    dataIndex: 'itemId',
    align: 'center',
    scopedSlots: { customRender: 'itemId' }
  },
  {
    title: '节目录音',
    dataIndex: 'filePath',
    align: 'center',
    scopedSlots: { customRender: 'filePath' }
  },
  // {
  //   title: '录音日期',
  //   dataIndex: 'recordDay',
  //   align: 'center'
  // },
  {
    title: '节目录音时间',
    dataIndex: 'recordTime',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
