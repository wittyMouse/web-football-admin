const typeMap = {
  '1': '收入',
  '2': '使用'
}

export default [
  {
    title: '序号',
    key: 'sort',
    width: 50,
    align: 'center',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '变更编号',
    dataIndex: 'integralChangeId',
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
    title: '变更类型',
    dataIndex: 'type',
    align: 'center',
    customRender: text => typeMap[text]
  },
  {
    title: '变更时间',
    dataIndex: 'changeTime',
    align: 'center'
  },
  {
    title: '变更前积分',
    dataIndex: 'beforeIntegral',
    align: 'center'
  },
  {
    title: '变更积分',
    dataIndex: 'integral',
    align: 'center'
  },
  {
    title: '变更后积分',
    dataIndex: 'afterIntegral',
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'description',
    align: 'center'
  }
  // {
  //   title: '操作',
  //   key: 'options',
  //   align: 'center',
  //   scopedSlots: { customRender: 'options' }
  // }
]
