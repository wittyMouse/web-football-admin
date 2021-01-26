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
            >
              <a-select-option v-for="item in userList" :key="item.id">{{
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

const formFields = [
  'articleTitle',
  'columnId',
  'amount',
  'discount',
  'publicationTime',
  'disclosureTime',
  'articleURL',
  'userId'
]

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
      }
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
          this.form.setFieldsValue(values)
        })
      }
    }
  },
  methods: {
    hasAuth,

    onReset() {
      this.form.resetFields()
      this.$emit('update:articleDetail', {})
    },

    // 完全关闭后
    afterClose() {
      this.onReset()
      this.$emit('afterClose')
    },

    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) return
        this.$emit('submit', {
          ...values,
          id: this.articleDetail.id
        })
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
