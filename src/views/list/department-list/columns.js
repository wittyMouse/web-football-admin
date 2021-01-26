export default [
  {
    title: '父部门编号',
    dataIndex: 'parentId',
    align: 'center'
  },
  {
    title: '部门名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '描述',
    dataIndex: 'description',
    align: 'center'
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '更新人',
    dataIndex: 'updateBy',
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
