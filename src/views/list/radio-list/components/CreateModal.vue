<template>
  <a-modal
    :visible="visible"
    title="添加节目"
    :width="600"
    :afterClose="afterClose"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      autocomplete="off"
    >
      <a-form-item label="节目类型">
        <a-select
          v-decorator="[
            'itemId',
            {
              initialValue: undefined,
              rules: rules.itemId
            }
          ]"
          placeholder="请选择节目类型"
        >
          <a-select-option v-for="item in radioGroupList" :key="item.itemId">{{
            item.itemName
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="节目录音">
        <a-upload
          v-decorator="[
            'filePath',
            {
              valuePropName: 'fileList',
              getValueFromEvent: handleUploadChange,
              rules: rules.filePath
            }
          ]"
          name="files"
          action="/df/sys/upload/uploadFile"
          :headers="uploadHeaders"
        >
          <a-button icon="upload">{{ fileUrl ? '更换' : '上传' }}录音</a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="节目录音时间">
        <a-date-picker
          v-decorator="[
            'recordTime',
            { initialValue: '', rules: rules.recordTime }
          ]"
          placeholder="请选择节目录音时间"
          :showTime="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
        ></a-date-picker>
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
    },
    radioGroupList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      uploadHeaders: {
        'X-Access-Token': window.sessionStorage.getItem('token')
      },
      fileUrl: '',
      rules: {
        itemId: [{ required: true, message: '请选择节目类型' }],
        filePath: [{ required: true, message: '请上传节目录音' }],
        recordTime: [{ required: true, message: '请选择节目录音时间' }]
      },
      showTime: {
        format: 'HH:mm'
      }
    }
  },
  methods: {
    // 上传状态变更事件
    handleUploadChange(info) {
      console.log(info)
      if (info.fileList.length > 0) {
        let fileList = [...info.fileList]

        fileList = fileList.slice(-1)

        fileList = fileList.map(file => {
          if (file.status === 'done') {
            const { code, result } = file.response
            if (code === 0) {
              file.url = result[0].fileSrc
              this.fileUrl = result[0].fileSrc
            }
          }
          return file
        })

        return fileList
      } else {
        this.fileUrl = ''
        return info.fileList
      }
    },

    onReset() {
      this.fileUrl = ''
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

        this.$emit('submit', { ...values, filePath: this.fileUrl })
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
