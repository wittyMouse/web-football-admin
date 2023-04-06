<template>
  <a-modal
    :visible="visible"
    title="添加至尊推介"
    :width="700"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      :form="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      autocomplete="off"
    >
      <a-form-item label="赛事名称">
        <a-input
          v-decorator="[
            'competition',
            { initialValue: '', rules: rules.competition }
          ]"
          placeholder="请输入赛事名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="主队">
        <a-input
          v-decorator="[
            'homeTeam',
            { initialValue: '', rules: rules.homeTeam }
          ]"
          placeholder="请输入主队"
        ></a-input>
      </a-form-item>
      <a-form-item label="客队">
        <a-input
          v-decorator="[
            'visitingTeam',
            { initialValue: '', rules: rules.visitingTeam }
          ]"
          placeholder="请输入客队"
        ></a-input>
      </a-form-item>
      <a-form-item label="推荐">
        <a-input
          v-decorator="[
            'proposal',
            { initialValue: '', rules: rules.proposal }
          ]"
          placeholder="请输入推荐"
        ></a-input>
      </a-form-item>
      <a-row>
        <a-col :span="12">
          <a-form-item
            label="发布时间"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
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
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="作者"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
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
    </a-form>
  </a-modal>
</template>

<script>
import { hasAuth } from '@/utils'
import debounce from 'lodash/debounce'

export default {
  name: 'CreateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
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
        competition: [{ required: true, message: '请输入赛事名称' }],
        homeTeam: [{ required: true, message: '请输入主队' }],
        visitingTeam: [{ required: true, message: '请输入客队' }],
        proposal: [{ required: true, message: '请输入推荐' }],
        publicationTime: [{ required: true, message: '请选择发布时间' }],
        userId: [{ required: true, message: '请选择作者' }]
      },
      showTime: {
        format: 'HH:mm'
      },
      keyword: ''
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
  },
  methods: {
    hasAuth,

    onReset() {
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

    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) return
        const args = {
          ...values
        }
        // if (!values.userId) {
        //   args.userId = ''
        // }
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
