const resultMap = {
  '-2': '输',
  '-1': '输半',
  0: '走',
  1: '赢半',
  2: '赢'
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
    title: '推介编号',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: '作者',
    dataIndex: 'realname',
    align: 'center'
  },
  {
    title: '比赛时间',
    dataIndex: 'publicationTime',
    align: 'center'
  },
  {
    title: '赛事名称',
    dataIndex: 'competition',
    align: 'center'
  },
  {
    title: '主队',
    dataIndex: 'homeTeam',
    align: 'center'
  },
  {
    title: '客队',
    dataIndex: 'visitingTeam',
    align: 'center'
  },
  {
    title: '推荐',
    dataIndex: 'proposal',
    align: 'center'
  },
  {
    title: '比分',
    dataIndex: 'score',
    align: 'center'
  },
  // 成绩（-2：输，-1：输半，0：走，1：赢半，2：赢）
  {
    title: '成绩',
    dataIndex: 'result',
    align: 'center',
    customRender: text => resultMap[text]
  },

  // {
  //   title: '公开时间',
  //   dataIndex: 'disclosureTime',
  //   align: 'center'
  // },
  {
    title: '操作',
    key: 'options',
    align: 'center',
    scopedSlots: { customRender: 'options' }
  }
]
