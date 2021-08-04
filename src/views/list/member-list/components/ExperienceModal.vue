<template>
  <a-modal
    :visible="visible"
    title="经验值修改"
    :width="600"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      :form="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-form-item label="会员编号">
        {{ memberDetail.memberId }}
      </a-form-item>
      <a-form-item label="会员账户">
        {{ memberDetail.account }}
      </a-form-item>
      <a-form-item label="会员昵称">
        {{ memberDetail.nickname }}
      </a-form-item>
      <a-form-item label="当前等级">
        {{ memberDetail.vipLevel }}
      </a-form-item>
      <a-form-item label="当前经验值">
        {{ memberDetail.exp }}
      </a-form-item>
      <a-form-item label="经验值">
        <a-input
          v-decorator="['exp', { initialValue: '', rules: rules.exp }]"
          placeholder="请输入经验值"
        >
          <a-tooltip slot="suffix" overlayClassName="custom-tooltip">
            <template slot="title">
              <a-table
                class="custom-table"
                :rowClassName="() => 'custom-table-row'"
                rowKey="id"
                :columns="columns"
                :data-source="levelList"
                :pagination="false"
                size="small"
              ></a-table>
            </template>

            <a-icon type="question-circle" />
          </a-tooltip>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'ExperienceModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    memberDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    levelList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        exp: [{ required: true, message: '请输入经验值' }]
      },
      columns: [
        {
          title: '等级',
          dataIndex: 'level',
          align: 'center',
          width: 60
        },
        {
          title: '经验值',
          dataIndex: 'exp',
          align: 'center',
          width: 100
        }
      ]
    }
  },
  methods: {
    onReset() {
      this.form.resetFields()
      this.$emit('update:memberDetail', {})
      this.$emit('update:levelList', [])
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
        const args = {
          ...values,
          id: this.memberDetail.id
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
.custom-tooltip {
  .ant-tooltip-arrow::before,
  .ant-tooltip-inner {
    background-color: #fff;
  }
}

.custom-table {
  .ant-table-small {
    border: 0;
  }
}

.custom-table-row {
  td {
    background-color: #fff !important;
  }
}
</style>
