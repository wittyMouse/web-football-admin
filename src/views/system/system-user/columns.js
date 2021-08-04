export default [
  {
    title: '用户头像',
    dataIndex: 'avatar',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'avatar' }
  },
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 140,
    align: 'center'
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
    width: 140,
    align: 'center'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 140,
    align: 'center'
  },
  {
    title: '限时特价',
    dataIndex: 'sale',
    width: 100,
    align: 'center',
    customRender: text => ({ 0: '否', 1: '是' }[text])
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 140,
    align: 'center',
    customRender: text => {
      let str = ''
      switch (text) {
        case 1:
          str = '正常'
          break
        case 2:
          str = '冻结'
          break
      }
      return str
    }
  },
  {
    title: '描述',
    dataIndex: 'description',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
