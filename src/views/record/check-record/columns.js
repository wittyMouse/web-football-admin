export default [
  {
    title: '序号',
    key: 'sort',
    width: 50,
    align: 'center',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '会员编号',
    dataIndex: 'memberId',
    align: 'center'
  },
  {
    title: '会员账户',
    dataIndex: 'account',
    align: 'center'
  },
  {
    title: '会员昵称',
    dataIndex: 'nickname',
    align: 'center'
  },
  {
    title: '签到日期',
    dataIndex: 'signInDay',
    align: 'center'
  },
  {
    title: '签到时间',
    dataIndex: 'signInTime',
    align: 'center'
  },
  {
    title: '连续签到天数',
    dataIndex: 'dayNum',
    align: 'center'
  },
  {
    title: '奖励金币',
    dataIndex: 'amount',
    align: 'center'
  }
  // {
  //   title: '操作',
  //   key: 'options',
  //   align: 'center',
  //   scopedSlots: { customRender: 'options' }
  // }
]
