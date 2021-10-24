<template>
  <a-modal
    :visible="visible"
    title="选择推介"
    :width="600"
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
      <a-form-item
        label="推介"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-select
          v-decorator="['id', { initialValue: undefined, rules: rules.id }]"
          placeholder="请选择推介"
          allow-clear
          show-search
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="recommendListLoading ? undefined : null"
          @search="onSearch"
        >
          <a-select-option v-for="item in recommendList" :key="item.id">
            <span>{{ item.competition }}</span>
            <span>（{{ item.homeTeam }} vs {{ item.visitingTeam }}）</span>
            <span>【{{ item.realname }}】</span>
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import * as api from '@/api'
import debounce from 'lodash/debounce'

export default {
  name: 'RecommendPickerModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.lastFetchId = 0
    this.onSearch = debounce(this.onSearch, 800)

    return {
      form: this.$form.createForm(this),
      rules: {
        id: [{ required: true, message: '请选择推介' }]
      },
      recommendListLoading: false,
      recommendList: []
    }
  },
  methods: {
    // 获取至尊推介列表
    getRecommendList(fetchId, params) {
      this.recommendListLoading = true
      api
        .getRecommendList(params)
        .then(res => {
          if (fetchId !== this.lastFetchId) {
            return
          }

          if (res.code === 0) {
            this.recommendList = res.result.records
          }
        })
        .finally(() => {
          this.recommendListLoading = false
        })
    },

    onSearch(value) {
      if (!value) {
        return
      }
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.recommendList = []
      const params = {
        competition: value,
        pageNo: 1,
        pageSize: 9999
      }
      this.getRecommendList(fetchId, params)
    },

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

<style lang="less" scoped></style>
