import { typeMap } from './config'

export default [
  {
    title: '会员发布编号',
    dataIndex: 'memberPublicationId',
    align: 'center'
  },
  {
    title: '会员编号',
    dataIndex: 'memberId',
    align: 'center'
  },
  {
    title: '会员昵称',
    dataIndex: 'nickname',
    align: 'center'
  },
  {
    title: '发布类型',
    dataIndex: 'type',
    align: 'center',
    customRender: text => typeMap[text]
  },
  {
    title: '图片路径',
    dataIndex: 'imageUrl',
    align: 'center',
    scopedSlots: { customRender: 'imageUrl' }
  },
  {
    title: '中奖金额',
    dataIndex: 'amount',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
