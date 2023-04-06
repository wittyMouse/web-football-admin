import { channelMap } from './config'

export default [
  {
    title: '序号',
    key: 'sort',
    width: 50,
    align: 'center',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '分类',
    dataIndex: 'channelId',
    align: 'center',
    customRender: text => channelMap[text]
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
