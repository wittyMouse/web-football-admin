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
    title: '文章编号',
    dataIndex: 'articleId',
    align: 'center'
  },
  {
    title: '作者',
    dataIndex: 'realname',
    align: 'center'
  },
  {
    title: '分类',
    dataIndex: 'channelId',
    align: 'center',
    customRender: text => channelMap[text]
  },
  {
    title: '栏目',
    dataIndex: 'columnName',
    align: 'center'
  },
  {
    title: '文章标题',
    dataIndex: 'articleTitle',
    align: 'center'
  },
  // {
  //   title: '文章路径',
  //   dataIndex: 'articleContent',
  //   align: 'center'
  // },
  // {
  //   title: '置顶',
  //   dataIndex: 'isTop',
  //   align: 'center',
  //   customRender: text => (text ? '置顶' : '非置顶')
  // },
  {
    title: '购买积分',
    dataIndex: 'integral',
    align: 'center'
  },
  // 折扣规则，从发布时间开始每个时间节点的折扣,例如{60:0.8,90:0.6,120:0.3},发布时间60分钟后8折，90分钟后6折，120后3折
  // {
  //   title: '折扣规则',
  //   dataIndex: 'discount',
  //   align: 'center'
  // },
  // {
  //   title: '是否推荐',
  //   dataIndex: 'isRecommend',
  //   align: 'center',
  //   customRender: text => (text ? '推荐' : '正常')
  // },
  {
    title: '发布时间',
    dataIndex: 'publicationTime',
    align: 'center'
  },
  {
    title: '公开时间',
    dataIndex: 'disclosureTime',
    align: 'center'
  },
  // {
  //   title: '购买人数',
  //   dataIndex: 'purchaseQuantity',
  //   align: 'center'
  // },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
