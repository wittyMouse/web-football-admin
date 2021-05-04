const statusMap = {
  0: '已失效',
  1: '服务中'
}
const typeMap = {
  0: '单日',
  1: '包周',
  3: '积分'
}

export default [
  {
    title: '订单号',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '会员账号',
    dataIndex: 'account',
    align: 'center'
  },
  {
    title: '作者',
    dataIndex: 'realname',
    align: 'center'
  },
  {
    title: '购买时间',
    dataIndex: 'subTime',
    width: 160,
    align: 'center'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 160,
    align: 'center'
  },
  {
    title: '订阅金币',
    dataIndex: 'amount',
    align: 'center'
  },
  {
    title: '积分',
    dataIndex: 'integral',
    align: 'center'
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    align: 'center',
    customRender: text => statusMap[text]
  },
  {
    title: '订购方式',
    dataIndex: 'type',
    align: 'center',
    customRender: text => typeMap[text]
  },
  {
    title: '成绩',
    dataIndex: 'score',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    width: 60,
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
