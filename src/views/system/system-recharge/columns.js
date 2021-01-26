const typeMap = ['积分', '金币']

export default [
  {
    title: '序号',
    key: 'sort',
    width: 50,
    align: 'center',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '充值数量',
    dataIndex: 'rechargeAmount',
    align: 'center'
  },
  {
    title: '赠送',
    dataIndex: 'donateIntegral',
    align: 'center',
    customRender: (text, record) => text + typeMap[record.type]
  },
  {
    title: '配置时间',
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
