export default [
  {
    title: '用户编号',
    dataIndex: 'userId',
    align: 'center'
  },
  {
    title: '用户名称',
    dataIndex: 'realname',
    align: 'center'
  },
  {
    title: '会员编号',
    dataIndex: 'memberId',
    align: 'center'
  },
  {
    title: '会员名称',
    dataIndex: 'nickname',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    customRender: text => (text ? '服务中' : '已失效')
  },
  {
    title: '订阅金币',
    dataIndex: 'amount',
    align: 'center'
  },
  {
    title: '订阅时间',
    dataIndex: 'subTime',
    align: 'center'
  },
  {
    title: '开始时间',
    dataIndex: 'beginTime',
    align: 'center'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    align: 'center'
  }
  // {
  //   title: '操作',
  //   key: 'options',
  //   align: 'center',
  //   scopedSlots: { customRender: 'options' }
  // }
]
