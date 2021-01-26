<template>
  <a-modal
    :visible="visible"
    title="编辑广告"
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
      <a-form-item label="名称">
        <a-input
          v-decorator="['name', { initialValue: '', rules: rules.name }]"
          placeholder="请输入名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="位置">
        <a-select
          v-decorator="[
            'location',
            { initialValue: undefined, rules: rules.location }
          ]"
          placeholder="请选择位置"
        >
          <a-select-option v-for="(item, index) in positionList" :key="index">{{
            item
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="system-advertisement-form-item" label="图片">
        <a-upload
          class="system-advertisement-form-item-upload"
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
            class="system-advertisement-upload-image"
            :src="imageUrl"
            alt="avatar"
            v-if="imageUrl"
          />
          <div v-else>
            <a-icon :type="uploading ? 'loading' : 'plus'" />
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="链接">
        <a-textarea
          v-decorator="['pageUrl', { initialValue: '' }]"
          placeholder="请输入链接"
        ></a-textarea>
      </a-form-item>
      <a-form-item label="权重">
        <a-input
          v-decorator="['weight', { initialValue: '', rules: rules.weight }]"
          placeholder="请输入权重"
          addon-after="%"
        ></a-input>
      </a-form-item>
      <a-form-item label="到期时间">
        <a-date-picker
          v-decorator="[
            'expiryDate',
            { initialValue: '', rules: rules.expiryDate }
          ]"
          :show-time="showTime"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          placeholder="请选择到期时间"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'

const formFields = [
  'name',
  'location',
  'imageUrl',
  'pageUrl',
  'weight',
  'expiryDate'
]

export default {
  name: 'UpdateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    advertisementDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    positionList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        name: [{ required: true, message: '请输入名称' }],
        location: [{ required: true, message: '请选择位置' }],
        imageUrl: [{ required: true, message: '请上传图片' }],
        pageUrl: [{ required: true, message: '请输入链接' }],
        weight: [{ required: true, message: '请输入权重' }],
        expiryDate: [{ required: true, message: '请选择到期时间' }]
      },
      uploadHeaders: {
        'X-Access-Token': window.sessionStorage.getItem('token')
      },
      fileList: [],
      uploading: false,
      imageUrl: '',
      showTime: {
        format: 'HH:mm',
        defaultValue: moment('00:00', 'HH:mm')
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const values = {}
          for (let key in this.advertisementDetail) {
            if (formFields.includes(key)) {
              values[key] = this.advertisementDetail[key]
            }
          }
          if (values.location) {
            values.location = parseInt(values.location)
          }
          if (values.imageUrl) {
            this.imageUrl = values.imageUrl
            values.imageUrl = [
              {
                uid: '-1',
                name: values.imageUrl.slice(
                  values.imageUrl.lastIndexOf('/') + 1
                ),
                status: 'done',
                url: values.imageUrl
              }
            ]
          } else {
            values.imageUrl = []
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
      this.$emit('update:advertisementDetail', {})
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
        // console.log(values)
        const args = {
          ...values,
          imageUrl: this.imageUrl,
          id: this.advertisementDetail.id
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
.system-advertisement-form-item {
  .ant-form-item-children {
    display: flex;
  }
}

.system-advertisement-form-item-upload {
  margin-bottom: 4px;
  .ant-upload {
    margin: 0;
  }
}

.system-advertisement-upload-image {
  max-width: 86px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
</style>
