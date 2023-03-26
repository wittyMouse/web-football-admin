<template>
  <a-modal
    :visible="visible"
    title="修改至尊推介结果"
    :width="600"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form :form="form" autocomplete="off">
      <div class="update-result-modal-layout">
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
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const formFields = ['score', 'result']

export default {
  name: 'UpdateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    recommendDetail: {
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
        homeTeam: [{ required: true, message: '请输入主队分数' }],
        visitingTeam: [{ required: true, message: '请输入客队分数' }],
        result: [{ required: true, message: '请选择成绩' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.recommendDetail) {
            if (formFields.includes(key)) {
              if (key === 'score') {
                const [homeTeam, visitingTeam] = this.recommendDetail[key]
                  ? this.recommendDetail[key].split(':')
                  : ['', '']
                values.homeTeam = homeTeam
                values.visitingTeam = visitingTeam
              } else {
                values[key] = this.recommendDetail[key]
              }
            }
          }
          if (!values.result) {
            values.result = undefined
          }
          this.form.setFieldsValue(values)
        })
      }
    }
  },
  methods: {
    onReset() {
      this.form.resetFields()
      this.$emit('update:recommendDetail', {})
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
        const { homeTeam, visitingTeam, result } = values
        const args = {
          score: [homeTeam, visitingTeam].join(':'),
          result,
          id: this.recommendDetail.id
        }
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

<style lang="less">
.update-result-modal-layout {
  display: flex;

  .update-result-modal-form-item-score {
    display: flex;
  }

  .ant-form-item-label {
    width: 92px;
  }

  .update-result-modal-divider {
    margin: 0 10px;
    line-height: 40px;
  }
}
</style>
