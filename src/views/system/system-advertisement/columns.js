const positionList = [
  '首页轮换',
  '首页底部',
  '王牌推介顶部',
  '王牌推介底部',
  '贴士专区顶部',
  '贴士专区底部',
  '节目回放顶部',
  '节目回放底部',
  '重大利好顶部',
  '重大利好底部',
  '本周放榜顶部',
  '本周放榜底部'
]

export default [
  {
    title: '序号',
    key: 'sort',
    width: 50,
    align: 'center',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '位置',
    dataIndex: 'location',
    align: 'center',
    customRender: text => positionList[text]
  },
  {
    title: '图片',
    dataIndex: 'imageUrl',
    align: 'center',
    scopedSlots: { customRender: 'imageUrl' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '链接',
    dataIndex: 'pageUrl',
    align: 'center'
  },
  {
    title: '权重',
    dataIndex: 'weight',
    width: 60,
    align: 'center',
    customRender: text => `${text}%`
  },
  {
    title: '有效期',
    dataIndex: 'expiryDate',
    width: 160,
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
