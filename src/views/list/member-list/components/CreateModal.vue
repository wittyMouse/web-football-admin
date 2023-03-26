<template>
  <a-modal
    :visible="visible"
    title="添加会员"
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
      <a-form-item label="密码">
        <a-input-password
          v-decorator="['pwd', { initialValue: '', rules: rules.pwd }]"
          placeholder="请输入密码"
        ></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'CreateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        imageUrl: [{ required: true, message: '请上传头像' }],
        account: [{ required: true, message: '请输入账号' }],
        nickname: [{ required: true, message: '请输入昵称' }],
        pwd: [{ required: true, message: '请输入密码' }]
      },
      uploadHeaders: {
        'X-Access-Token': window.sessionStorage.getItem('token')
      },
      fileList: [],
      uploading: false,
      imageUrl: ''
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
      this.onReset()
      this.$emit('afterClose')
    },

    // 确定
    onOk() {
      this.form.validateFields((errors, values) => {
        if (errors) return
        this.$emit('submit', { ...values, imageUrl: this.imageUrl })
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
