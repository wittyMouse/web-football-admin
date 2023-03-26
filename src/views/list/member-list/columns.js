const statusMap = {
  0: '停用',
  1: '限制',
  2: '正常'
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
    title: '会员编号',
    dataIndex: 'memberId',
    width: 180,
    align: 'center'
  },
  {
    title: '会员账户',
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
    title: '会员头像',
    dataIndex: 'imageUrl',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'imageUrl' }
  },
  // {
  //   title: '手机号码',
  //   dataIndex: 'mobile',
  //   width: 120,
  //   align: 'center',
  //   scopedSlots: { customRender: 'mobile' }
  // },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    width: 170,
    align: 'center'
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginTime',
    width: 170,
    align: 'center'
  },
  // {
  //   title: '金币余额',
  //   dataIndex: 'balance',
  //   width: 120,
  //   align: 'center'
  // },
  {
    title: '积分',
    dataIndex: 'integral',
    width: 120,
    align: 'center'
  },
  // {
  //   title: '等级',
  //   dataIndex: 'vipLevel',
  //   width: 80,
  //   align: 'center'
  // },
  // {
  //   title: '经验值',
  //   dataIndex: 'exp',
  //   width: 120,
  //   align: 'center'
  // },
  /**
   * 状态：0: 停用; 1: 限制; 2: 正常
   */
  {
    title: '会员状态',
    dataIndex: 'status',
    width: 80,
    align: 'center',
    customRender: text => statusMap[text]
  },
  // {
  //   title: '渠道',
  //   dataIndex: 'channelName',
  //   width: 200,
  //   align: 'center'
  // },
  {
    title: '操作',
    key: 'options',
    fixed: 'right',
    width: 250,
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
