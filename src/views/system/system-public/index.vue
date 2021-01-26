<template>
  <div class="system-public container">
    <a-card title="公共配置">
      <a-form :form="form">
        <a-form-item label="上传付款码" :style="{ margin: 0 }">
          <a-upload
            v-decorator="[
              'avatar',
              {
                valuePropName: 'fileList',
                getValueFromEvent: handleUploadChange
              }
            ]"
            name="files"
            list-type="picture-card"
            :show-upload-list="false"
            action="/df/sys/upload/uploadQRCode"
            :headers="uploadHeaders"
          >
            <img
              class="avatar-image"
              :src="imageUrl"
              alt="avatar"
              v-if="imageUrl"
            />
            <div v-else>
              <a-icon :type="uploading ? 'loading' : 'plus'" />
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import mixin from '@/mixins'

export default {
  name: 'system-public',
  data() {
    return {
      form: this.$form.createForm(this),
      uploadHeaders: {
        'X-Access-Token': window.sessionStorage.getItem('token')
      },
      fileList: [],
      uploading: false,
      imageUrl: `https://www.df1668.com/upload/image/QR/QR.jpg?timestamp=${Date.now()}`
    }
  },
  mixins: [mixin],
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
          this.imageUrl = `${result[0].fileSrc}?timestamp=${Date.now()}`
          this.uploading = false
        }
      }
      return info.fileList
    }
  }
}
</script>

<style lang="less">
.system-public .avatar-image {
  max-width: 300px;
}

.system-public .ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
</style>
