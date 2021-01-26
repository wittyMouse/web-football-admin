import moment from 'moment'

export default [
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    align: 'center'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    customRender: text => {
      return moment(text).format('YYYY-MM-DD')
    }
  },
  {
    title: '描述',
    dataIndex: 'description',
    align: 'center',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
