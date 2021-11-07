<template>
  <a-modal
    :visible="visible"
    title="添加至尊推介"
    :width="700"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form :form="form" autocomplete="off">
      <!-- <a-form-item
        label="赛事名称"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
            'competition',
            { initialValue: '', rules: rules.competition }
          ]"
          placeholder="请输入赛事名称"
        ></a-input>
      </a-form-item>
      <a-form-item
        label="主队"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
            'homeTeam',
            { initialValue: '', rules: rules.homeTeam }
          ]"
          placeholder="请输入主队"
        ></a-input>
      </a-form-item>
      <a-form-item
        label="客队"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
            'visitingTeam',
            { initialValue: '', rules: rules.visitingTeam }
          ]"
          placeholder="请输入客队"
        ></a-input>
      </a-form-item>
      <a-form-item
        label="推荐"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
            'proposal',
            { initialValue: '', rules: rules.proposal }
          ]"
          placeholder="请输入推荐"
        ></a-input>
      </a-form-item>
      <a-form-item
        label="比赛时间"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-date-picker
          v-decorator="[
            'publicationTime',
            { initialValue: '', rules: rules.publicationTime }
          ]"
          :showTime="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
        ></a-date-picker>
      </a-form-item> -->
      <!-- <div class="update-result-modal-layout">
        <a-form-item class="update-result-modal-form-item-score" label="比分">
          <a-input
            v-decorator="[
              'homeTeam',
              { initialValue: '', rules: rules.homeTeam }
            ]"
            placeholder="主队分数"
          ></a-input>
        </a-form-item>
        <div class="update-result-modal-divider">:</div>
        <a-form-item>
          <a-input
            v-decorator="[
              'visitingTeam',
              { initialValue: '', rules: rules.visitingTeam }
            ]"
            placeholder="客队分数"
          ></a-input>
        </a-form-item>
      </div>
      <a-form-item
        label="成绩"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-select
          v-decorator="[
            'result',
            { initialValue: undefined, rules: rules.result }
          ]"
          placeholder="请选择成绩"
        >
          <a-select-option :value="-2">输</a-select-option>
          <a-select-option :value="-1">输半</a-select-option>
          <a-select-option :value="0">走</a-select-option>
          <a-select-option :value="1">赢半</a-select-option>
          <a-select-option :value="2">赢</a-select-option>
        </a-select>
      </a-form-item> -->
      <!-- <a-form-item
        label="推介"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-select
          v-decorator="[
            'recommendId',
            { initialValue: '', rules: rules.recommendId }
          ]"
          placeholder="请输入推介"
          show-search
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="loading ? undefined : null"
          @search="handleSearch"
        >
          <a-select-option
            :value="item.id"
            label="China"
            v-for="item in recommendList"
            :key="item.id"
          >
            {{ `${item.competition} ${item.homeTeam} vs ${item.visitingTeam} 【 ${item.realname} 】` }}
          </a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item
        label="推介"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
            'proposal',
            { initialValue: '', rules: rules.proposal }
          ]"
          placeholder="请输入推介"
        ></a-input>
      </a-form-item>
      <a-form-item
        label="金额"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="['amount', { initialValue: '', rules: rules.amount }]"
          placeholder="请输入金额"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
// const amountRegExp = /^([0-9]+)|([0-9]+\.{1}[0-9]+)$/
// import debounce from 'lodash/debounce'
// import * as api from '@/api'

export default {
  name: 'RecommendPickerModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // const validateAmount = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入金额'))
    //   }
    //   // else if (value && !amountRegExp.test(value)) {
    //   //   callback(new Error('金额格式错误'))
    //   // }
    //   else {
    //     callback()
    //   }
    // }
    // this.lastFetchId = 0
    // this.handleSearch = debounce(this.handleSearch, 800)

    return {
      form: this.$form.createForm(this),
      rules: {
        // recommendId: [{ required: true, message: '请选择推介' }],
        // homeTeam: [{ required: true, message: '请输入主队' }],
        // visitingTeam: [{ required: true, message: '请输入客队' }],
        // proposal: [{ required: true, message: '请输入推荐' }],
        // publicationTime: [{ required: true, message: '请选择发布时间' }],
        // homeTeamScore: [{ required: true, message: '请输入主队分数' }],
        // visitingTeamScore: [{ required: true, message: '请输入客队分数' }],
        // result: [{ required: true, message: '请输入成绩' }],
        // amount: [
        //   { required: true, message: '请输入金额', validator: validateAmount }
        // ],
        proposal: [{ required: true, message: '请输入推介' }],
        amount: [{ required: true, message: '请输入金额' }]
      }
      // showTime: {
      //   format: 'HH:mm'
      // }
      // recommendList: [],
      // loading: false
    }
  },
  methods: {
    // handleSearch(value) {
    //   if (!value) {
    //     return
    //   }

    //   this.lastFetchId += 1
    //   const fetchId = this.lastFetchId
    //   this.recommendList = []
    //   this.loading = true
    //   const params = {
    //     competition: value,
    //     pageNo: 1,
    //     pageSize: 10
    //   }
    //   api
    //     .getRecommendList(params)
    //     .then(res => {
    //       if (fetchId !== this.lastFetchId) {
    //         return
    //       }

    //       if (res.code === 0) {
    //         const recommendList = res.result.records
    //         this.recommendList = recommendList
    //       }
    //     })
    //     .finally(() => {
    //       this.loading = false
    //     })
    // },

    onReset() {
      this.form.resetFields()
      this.recommendList = []
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
        // const args = {
        //   ...values,
        //   publicationTime: values.publicationTime + ':00'
        // }
        this.$emit('submit', { ...values })
      })
    },

    // 取消
    onCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
// .update-result-modal-layout {
//   display: flex;

//   .update-result-modal-form-item-score {
//     display: flex;
//   }

//   .ant-form-item-label {
//     width: 92px;
//   }

//   .update-result-modal-divider {
//     margin: 0 10px;
//     line-height: 40px;
//   }
// }
</style>
