<template>
  <a-modal
    :visible="visible"
    title="添加会员发布"
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
      <a-form-item label="会员">
        <a-select
          v-decorator="[
            'memberId',
            {
              initialValue: undefined,
              rules: rules.memberId
            }
          ]"
          placeholder="请选择会员"
          show-search
          :filter-option="false"
          @search="onSelectSearch"
        >
          <a-select-option
            v-for="item in filterMemberList"
            :key="item.memberId"
            >{{ item.nickname }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="类型">
        <a-select
          v-decorator="['type', { initialValue: undefined, rules: rules.type }]"
          placeholder="请选择类型"
        >
          <a-select-option v-for="item in typeList" :key="item.typeId">
            {{ item.typeName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="member-share-form-item" label="图片">
        <a-upload
          class="member-share-form-item-upload"
          v-decorator="[
            'imageUrl',
            {
              valuePropName: 'fileList',
              getValueFromEvent: handleUploadChange,
              rules: rules.imageUrl
            }
          ]"
          name="files"
          list-type="picture-card"
          :show-upload-list="false"
          action="/df/sys/upload/uploadFile"
          :headers="uploadHeaders"
        >
          <img
            class="member-share-upload-image"
            :src="imageUrl"
            alt="avatar"
            v-if="imageUrl"
          />
          <div v-else>
            <a-icon :type="uploading ? 'loading' : 'plus'" />
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="中奖金额">
        <a-input
          v-decorator="['amount', { initialValue: '', rules: rules.amount }]"
          placeholder="请输入中奖金额"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import debounce from 'lodash/debounce'
import { typeList } from '../config'

export default {
  name: 'CreateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    memberList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    this.onSelectSearch = debounce(this.onSelectSearch, 500)

    return {
      form: this.$form.createForm(this),
      rules: {
        memberId: [{ required: true, message: '请选择会员' }],
        type: [{ required: true, message: '请选择类型' }],
        imageUrl: [{ required: true, message: '请上传图片' }],
        amount: [{ required: true, message: '请输入中奖金额' }]
      },
      uploadHeaders: {
        'X-Access-Token': window.sessionStorage.getItem('token')
      },
      fileList: [],
      uploading: false,
      imageUrl: '',
      typeList,
      keyword: ''
    }
  },
  computed: {
    filterMemberList() {
      if (this.keyword) {
        const filterMemberList = this.memberList.filter(
          item => item.nickname.indexOf(this.keyword) > -1
        )
        // console.log('filterMemberList', filterMemberList)
        return filterMemberList
      }
      return this.memberList
    }
  },
  methods: {
    // 上传状态变更事件
    handleUploadChange(info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        this.uploading = true
      }
      if (info.file.status === 'done') {
        const { code, result } = info.file.response
        if (code === 0) {
          this.imageUrl = result[0].fileSrc
          this.uploading = false
        }
      }
      return info.fileList
    },

    onReset() {
      this.imageUrl = ''
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
        const fields = { ...values, imageUrl: this.imageUrl }
        const target = this.memberList.find(
          item => item.memberId === values.memberId
        )
        if (target) {
          fields.nickname = target.nickname
        }
        this.$emit('submit', fields)
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

<style lang="less">
.member-share-form-item {
  .ant-form-item-children {
    display: flex;
  }
}

.member-share-form-item-upload {
  margin-bottom: 4px;
  .ant-upload {
    margin: 0;
  }
}

.member-share-upload-image {
  max-width: 86px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
</style>
