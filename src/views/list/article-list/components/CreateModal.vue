<template>
  <a-modal
    :visible="visible"
    title="添加文章"
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
      <a-form-item label="购买金币数">
        <a-input
          v-decorator="['amount', { initialValue: '', rules: rules.amount }]"
          placeholder="请输入文章购买金币数"
        ></a-input>
      </a-form-item>
      <a-form-item label="折扣规则">
        <a-input
          v-decorator="['discount', { initialValue: '' }]"
          placeholder="折扣规则，如没折扣请留空"
        ></a-input>
      </a-form-item>
      <a-form-item label="发布时间">
        <a-date-picker
          v-decorator="[
            'publicationTime',
            { initialValue: '', rules: rules.publicationTime }
          ]"
          :showTime="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
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
        ></a-date-picker>
      </a-form-item>
      <a-form-item label="文章内容">
        <!-- <Editor
          v-decorator="[
            'articleURL',
            { initialValue: '', rules: rules.articleURL }
          ]"
          @recommend-picker-submit="onRecommendPickerSubmit"
        /> -->
        <Editor
          v-decorator="[
            'articleURL',
            { initialValue: '', rules: rules.articleURL }
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

// const recommendParams = [
//   'proposal',
//   'amount',
//   'visitingTeam',
//   'publicationTime'
// ]

const recommendParams = ['proposal', 'amount']

export default {
  name: 'CreateModal',
  components: {
    Editor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
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
        columnId: [{ required: true, message: '请选择栏目' }],
        userId: [{ required: true, message: '请选择作者' }],
        amount: [{ required: true, message: '请输入购买金币数' }],
        publicationTime: [{ required: true, message: '请选择发布时间' }],
        disclosureTime: [{ required: true, message: '请选择公开时间' }],
        articleURL: [{ required: true, message: '请输入文章内容' }]
      },
      showTime: {
        format: 'HH:mm'
      },
      keyword: ''
      // articleMarketingList: []
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
    }
    // articleMarketingMap() {
    //   const obj = {}
    //   this.articleMarketingList.forEach((item, index) => {
    //     const { competition, homeTeam, visitingTeam, publicationTime } = item
    //     obj[
    //       `${competition}-${homeTeam}-${visitingTeam}-${publicationTime}`
    //     ] = index
    //   })
    //   return obj
    // }
  },
  methods: {
    hasAuth,

    onReset() {
      // this.articleMarketingList = []
      this.form.resetFields()
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
    //     div.innerHTML = values.articleURL
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
    //       articleMarketingList: arr
    //     }
    //     // if (!values.userId) {
    //     //   args.userId = ''
    //     // }
    //     console.log('article', args)
    //     this.$emit('submit', args)
    //   })
    // },

    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) return
        // const values = this.form.getFieldsValue()
        const div = document.createElement('div')
        div.innerHTML = values.articleURL
        const recommendEl = div.querySelectorAll('.recommend-button')
        const arr = []
        recommendEl.forEach((el, index) => {
          const keys = el.getAttributeNames()
          const obj = { sortNum: index + 1 }
          keys.forEach(key => {
            const name = key.replace('data-', '')
            if (recommendParams.includes(name)) {
              const value = el.getAttribute(key)
              obj[name] = value
            }
          })
          arr.push(obj)
        })
        const articleURL = values.articleURL.replace(/\sdata-\w+?=".+?"/g, '')
        const args = {
          ...values,
          articleURL,
          articleMarketingList: arr
        }
        // if (!values.userId) {
        //   args.userId = ''
        // }
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
