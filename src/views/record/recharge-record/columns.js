const typeMap = ['系统充值', '微信支付']
export default [
  {
    title: '序号',
    key: 'sort',
    width: 50,
    align: 'center',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '订单号',
    dataIndex: 'rechargeRecordId',
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
    title: '充值金额',
    dataIndex: 'amount',
    align: 'center'
  },
  {
    title: '充值时间',
    dataIndex: 'rechargeTime',
    align: 'center'
  },
  {
    title: '充值方式',
    dataIndex: 'type',
    align: 'center',
    customRender: text => typeMap[text]
  }
  // {
  //   title: '操作',
  //   key: 'options',
  //   align: 'center',
  //   scopedSlots: { customRender: 'options' }
  // }
]
