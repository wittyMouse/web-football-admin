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
    width: 180,
    align: 'center'
  },
  {
    title: '会员账号',
    dataIndex: 'account',
    width: 280,
    align: 'center'
  },
  {
    title: '会员昵称',
    dataIndex: 'nickname',
    width: 240,
    align: 'center'
  },
  {
    title: '作者',
    dataIndex: 'realname',
    width: 160,
    align: 'center'
  },
  {
    title: '购买时间',
    dataIndex: 'subTime',
    width: 170,
    align: 'center'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 170,
    align: 'center'
  },
  {
    title: '订阅金币',
    dataIndex: 'amount',
    width: 140,
    align: 'center'
  },
  {
    title: '积分',
    dataIndex: 'integral',
    width: 140,
    align: 'center'
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 80,
    align: 'center',
    customRender: text => statusMap[text]
  },
  {
    title: '订购方式',
    dataIndex: 'type',
    width: 80,
    align: 'center',
    customRender: text => typeMap[text]
  },
  {
    title: '成绩',
    dataIndex: 'score',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    width: 80,
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
