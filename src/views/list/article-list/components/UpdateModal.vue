<template>
  <a-modal
    :visible="visible"
    title="编辑文章"
    :width="1200"
    :afterClose="afterClose"
    force-render
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      :form="form"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 22 }"
      autocomplete="off"
    >
      <a-form-item label="文章标题">
        <a-input
          v-decorator="[
            'articleTitle',
            { initialValue: '', rules: rules.articleTitle }
          ]"
          placeholder="请输入文章标题"
        ></a-input>
      </a-form-item>
      <a-form-item label="分类">
        <a-select
          v-decorator="[
            'channelId',
            {
              initialValue: undefined,
              rules: rules.channelId
            }
          ]"
          placeholder="请选择分类"
        >
          <a-select-option v-for="item in channelList" :key="item.channelId">{{
            item.channelName
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-row>
        <a-col :span="12">
          <a-form-item
            label="栏目"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-select
              v-decorator="[
                'columnId',
                {
                  initialValue: undefined,
                  rules: rules.columnId
                }
              ]"
              placeholder="请选择栏目"
            >
              <a-select-option
                v-for="item in columnList"
                :key="item.columnId"
                >{{ item.columnName }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="作者"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            v-show="hasAuth(userPermissionMap, $route.name, 'all')"
          >
            <a-select
              v-decorator="[
                'userId',
                {
                  initialValue: undefined,
                  rules: hasAuth(userPermissionMap, $route.name, 'all')
                    ? rules.userId
                    : []
                }
              ]"
              placeholder="请选择作者"
              show-search
              :filter-option="false"
              @search="onSelectSearch"
            >
              <a-select-option v-for="item in filterUserList" :key="item.id">{{
                item.realname
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="购买积分数">
        <a-input
          v-decorator="[
            'integral',
            { initialValue: '', rules: rules.integral }
          ]"
          placeholder="请输入文章购买积分数"
        ></a-input>
      </a-form-item>
      <!-- <a-form-item label="折扣规则">
        <a-input
          v-decorator="['discount', { initialValue: '' }]"
          placeholder="折扣规则，如没折扣请留空"
        ></a-input>
      </a-form-item> -->
      <a-form-item label="发布时间">
        <a-date-picker
          v-decorator="[
            'publicationTime',
            { initialValue: '', rules: rules.publicationTime }
          ]"
          :showTime="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          placeholder="请选择发布时间"
        ></a-date-picker>
      </a-form-item>
      <a-form-item label="公开时间">
        <a-date-picker
          v-decorator="[
            'disclosureTime',
            { initialValue: '', rules: rules.disclosureTime }
          ]"
          :showTime="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          placeholder="请选择公开时间"
        ></a-date-picker>
      </a-form-item>
      <a-form-item label="文章内容">
        <!-- <Editor
          v-decorator="[
            'articleContent',
            { initialValue: '', rules: rules.articleContent }
          ]"
          @recommend-picker-submit="onRecommendPickerSubmit"
        /> -->
        <Editor
          v-decorator="[
            'articleContent',
            { initialValue: '', rules: rules.articleContent }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { hasAuth } from '@/utils'
import Editor from './CKEditor'
import debounce from 'lodash/debounce'
import { channelList } from '../config'

const formFields = [
  'articleTitle',
  'channelId',
  'columnId',
  'integral',
  'discount',
  'publicationTime',
  'disclosureTime',
  'articleContent',
  'userId'
]

// const recommendParams = [
//   'competition',
//   'homeTeam',
//   'visitingTeam',
//   'publicationTime'
// ]
const recommendParams = ['proposal', 'integral']

export default {
  name: 'UpdateModal',
  components: {
    Editor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    articleDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    columnList: {
      type: Array,
      default() {
        return []
      }
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    },
    userPermissionMap: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    this.onSelectSearch = debounce(this.onSelectSearch, 500)

    return {
      form: this.$form.createForm(this),
      rules: {
        articleTitle: [{ required: true, message: '请输入文章标题' }],
        channelId: [{ required: true, message: '请选择分类' }],
        columnId: [{ required: true, message: '请选择栏目' }],
        userId: [{ required: true, message: '请选择作者' }],
        integral: [{ required: true, message: '请输入购买积分数' }],
        publicationTime: [{ required: true, message: '请选择发布时间' }],
        disclosureTime: [{ required: true, message: '请选择公开时间' }],
        articleContent: [{ required: true, message: '请输入文章内容' }]
      },
      showTime: {
        format: 'HH:mm'
      },
      channelList,
      keyword: '',
      articleMarketingList: []
    }
  },
  computed: {
    filterUserList() {
      if (this.keyword) {
        const filterUserList = this.userList.filter(
          item => item.realname.indexOf(this.keyword) > -1
        )
        // console.log('filterUserList', filterUserList)
        return filterUserList
      }
      return this.userList
    },
    articleMarketingMap() {
      const obj = {}
      this.articleMarketingList.forEach((item, index) => {
        const { proposal, integral } = item
        obj[`${proposal}-${integral}`] = index
      })
      return obj
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.articleDetail) {
            if (formFields.includes(key)) {
              values[key] = this.articleDetail[key]
            }
          }
          const articleMarketingList = this.articleDetail.articleMarketingList
          let index = 0
          values.articleContent = values.articleContent.replace(
            /class="recommend-button"/g,
            item => {
              const { proposal, integral } = articleMarketingList[index]
              index += 1
              return `${item} data-proposal="${proposal}" data-integral="${integral}"`
            }
          )
          this.form.setFieldsValue(values)
          this.articleMarketingList = articleMarketingList
        })
      }
    }
  },
  methods: {
    hasAuth,

    onReset() {
      this.articleMarketingList = []
      this.form.resetFields()
      this.$emit('update:articleDetail', {})
    },

    // 完全关闭后
    afterClose() {
      this.keyword = ''
      this.onReset()
      this.$emit('afterClose')
    },

    // 下拉框搜索
    onSelectSearch(value) {
      this.keyword = value
    },

    // 添加推介表单提交
    // onRecommendPickerSubmit(value) {
    //   this.articleMarketingList.push(value)
    // },

    // 确定
    // onOk() {
    //   this.form.validateFields((errors, values) => {
    //     if (errors) return
    //     const div = document.createElement('div')
    //     div.innerHTML = values.articleContent
    //     const recommendEl = div.querySelectorAll('.recommend')
    //     const arr = []
    //     recommendEl.forEach(el => {
    //       const keys = el.getAttributeNames()
    //       const obj = {}
    //       keys.forEach(key => {
    //         const name = key.replace('data-', '').replace('-t', 'T')
    //         if (recommendParams.includes(name)) {
    //           const value = el.getAttribute(key)
    //           obj[name] = value
    //         }
    //       })
    //       const { competition, homeTeam, visitingTeam, publicationTime } = obj
    //       const keyName = `${competition}-${homeTeam}-${visitingTeam}-${publicationTime}`
    //       if (typeof this.articleMarketingMap[keyName] !== 'undefined') {
    //         arr.push(
    //           this.articleMarketingList[this.articleMarketingMap[keyName]]
    //         )
    //       }
    //     })
    //     const args = {
    //       ...values,
    //       id: this.articleDetail.id,
    //       articleMarketingList: arr
    //     }
    //     console.log('article', args)
    //     this.$emit('submit', args)
    //   })
    // },

    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) return

        const args = {
          ...values,
          id: this.articleDetail.id,
          articleMarketingList: []
        }

        const div = document.createElement('div')
        div.innerHTML = values.articleContent
        const recommendEl = div.querySelectorAll('.recommend-button')
        if (recommendEl.length > 0) {
          const arr = []
          recommendEl.forEach((el, index) => {
            const keys = el.getAttributeNames()
            let obj = { sortNum: index + 1 }
            keys.forEach(key => {
              const name = key.replace('data-', '')
              if (recommendParams.includes(name)) {
                const value = el.getAttribute(key)
                obj[name] = value
              }
            })
            const i = this.articleMarketingMap[
              `${obj.proposal}-${obj.integral}`
            ]
            if (typeof i !== 'undefined') {
              obj = { ...this.articleMarketingList[i], ...obj }
            }
            arr.push(obj)
          })
          args.articleContent = values.articleContent.replace(
            /\sdata-\w+?=".+?"/g,
            ''
          )
          args.articleMarketingList = arr
        }

        console.log('article', args)
        this.$emit('submit', args)
      })
    },

    // 取消
    onCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped></style>
