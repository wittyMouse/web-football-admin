const typeList = ['充值', '购买文章', '至尊推荐']

export default [
  {
    // （0:充值,1:购买文章,2:至尊推荐）
    title: '变更类型',
    dataIndex: 'type',
    align: 'center',
    customRender: text => typeList[text]
  },
  {
    title: '记录编号',
    dataIndex: 'recordId',
    align: 'center'
  },
  {
    title: '会员账号',
    dataIndex: 'account',
    align: 'center'
  },
  {
    title: '变更前余额',
    dataIndex: 'beforeAmount',
    align: 'center'
  },
  {
    title: '变更金额',
    dataIndex: 'amount',
    align: 'center'
  },
  {
    title: '变更后余额',
    dataIndex: 'afterAmount',
    align: 'center'
  },
  {
    title: '备注说明',
    dataIndex: 'description',
    align: 'center'
  },
  {
    title: '变更时间',
    dataIndex: 'buyTime',
    align: 'center'
  }
  // {
  //   title: '操作',
  //   key: 'options',
  //   align: 'center',
  //   scopedSlots: { customRender: 'options' }
  // }
]
