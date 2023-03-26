<template>
  <a-modal
    :visible="visible"
    title="编辑会员"
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
      <a-form-item class="member-form-item" label="头像">
        <a-upload
          class="member-form-item-upload"
          v-decorator="[
            'avatar',
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
            class="member-upload-image"
            :src="imageUrl"
            alt="avatar"
            v-if="imageUrl"
          />
          <div v-else>
            <a-icon :type="uploading ? 'loading' : 'plus'" />
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="编号">
        <a-input
          v-decorator="['memberId', { initialValue: '' }]"
          placeholder="请输入编号"
          disabled
        ></a-input>
      </a-form-item>
      <a-form-item label="账号">
        <a-input
          v-decorator="['account', { initialValue: '', rules: rules.account }]"
          placeholder="请输入账号"
        ></a-input>
      </a-form-item>
      <a-form-item label="昵称">
        <a-input
          v-decorator="[
            'nickname',
            { initialValue: '', rules: rules.nickname }
          ]"
          placeholder="请输入昵称"
        ></a-input>
      </a-form-item>
      <!-- <a-form-item label="密码">
        <a-input-password
          v-decorator="['pwd', { initialValue: '' }]"
          placeholder="请输入密码"
        ></a-input-password>
      </a-form-item> -->
      <a-form-item label="状态">
        <a-select
          v-decorator="[
            'status',
            { initialValue: undefined, rules: rules.status }
          ]"
          placeholder="请选择状态"
        >
          <a-select-option :value="0">停用</a-select-option>
          <a-select-option :value="1">限制</a-select-option>
          <a-select-option :value="2">正常</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="积分">
        <a-input
          v-decorator="['integral', { initialValue: '' }]"
          placeholder="请输入积分"
          disabled
        ></a-input>
      </a-form-item>
      <a-form-item label="注册时间">
        <a-date-picker
          :style="{ width: '100%' }"
          v-decorator="['registerTime', { initialValue: null }]"
          placeholder="请选择注册时间"
          :show-time="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          disabled
        ></a-date-picker>
      </a-form-item>
      <a-form-item label="更新时间">
        <a-date-picker
          :style="{ width: '100%' }"
          v-decorator="['upgradeTime', { initialValue: null }]"
          placeholder="请选择更新时间"
          :show-time="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          disabled
        ></a-date-picker>
      </a-form-item>
      <a-form-item label="最后登录时间">
        <a-date-picker
          :style="{ width: '100%' }"
          v-decorator="['lastLoginTime', { initialValue: null }]"
          placeholder="请选择最后登录时间"
          :show-time="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          disabled
        ></a-date-picker>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const formFields = [
  // 'mobile',
  'avatar',
  'memberId',
  'account',
  'nickname',
  // 'pwd',
  'status',
  'integral',
  'registerTime',
  'upgradeTime',
  'lastLoginTime'
]

export default {
  name: 'UpdateModal',
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
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        account: [{ required: true, message: '请输入账号' }],
        nickname: [{ required: true, message: '请输入昵称' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      showTime: {
        format: 'HH:mm'
      },
      uploadHeaders: {
        'X-Access-Token': window.sessionStorage.getItem('token')
      },
      fileList: [],
      uploading: false,
      imageUrl: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.memberDetail) {
            if (formFields.includes(key)) {
              values[key] = this.memberDetail[key]
            }
          }
          // if (
          //   values.mobile &&
          //   !hasAuth(this.userPermissionMap, this.$route.name, 'fullPhone')
          // ) {
          //   values.mobile = this.phoneNumberFilter(values.mobile)
          // }
          if (values.avatar) {
            this.imageUrl = values.avatar
            values.avatar = [
              {
                uid: '-1',
                name: values.avatar.slice(values.avatar.lastIndexOf('/') + 1),
                status: 'done',
                url: values.avatar
              }
            ]
          } else {
            values.avatar = []
          }
          this.form.setFieldsValue(values)
        })
      }
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
      this.$emit('update:memberDetail', {})
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
        // const { mobile } = values
        const args = {
          ...values,
          imageUrl: this.imageUrl,
          id: this.memberDetail.id
        }
        // if (mobile.indexOf('*') > -1) {
        //   args.mobile = this.memberDetail.mobile
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

<style lang="less">
.member-form-item {
  .ant-form-item-children {
    display: flex;
  }
}

.member-form-item-upload {
  margin-bottom: 4px;
  .ant-upload {
    margin: 0;
  }
}

.member-upload-image {
  max-width: 86px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
</style>
