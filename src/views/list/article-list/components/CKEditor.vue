<template>
  <div>
    <textarea ref="textareaRef"></textarea>

    <RecommendPickerModal
      :visible.sync="recommendPickerModalVisible"
      @submit="onRecommendPickerSubmit"
    />
  </div>
</template>

<script>
import ClassicEditor from '@/utils/ckeditor'
import RecommendPickerModal from './RecommendPickerModal'
import debounce from 'lodash/debounce'
import UploadAdapter from './UploadAdapter'

const INPUT_EVENT_DEBOUNCE_WAIT = 300

function uploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    // Configure the URL to the upload script in your back-end here!
    const token = window.sessionStorage.getItem('token')
    return new UploadAdapter(loader, '/df/sys/upload/uploadFile', token)
  }
}

const editorConfig = {
  extraPlugins: [uploadAdapterPlugin],
  toolbar: {
    items: [
      'heading',
      '|',
      'fontSize',
      'fontFamily',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      'alignment',
      '|',
      'indent',
      'outdent',
      '|',
      'link',
      'imageInsert',
      'insertTable',
      'mediaEmbed',
      '|',
      'customButton',
      '|',
      'undo',
      'redo'
    ]
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      '|',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'linkImage',
      '|',
      'imageResize'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  }
}

export default {
  name: 'Editor',
  components: {
    RecommendPickerModal
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editorConfig,
      $_instance: null,
      $_lastEditorData: {
        type: String,
        default: ''
      },
      recommendPickerModalVisible: false
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== this.$_lastEditorData) {
        this.$_instance.setData(newValue)
      }
    }
  },
  methods: {
    $_setUpEditorEvents() {
      const editor = this.$_instance

      const emitDebouncedInputEvent = debounce(
        evt => {
          const data = (this.$_lastEditorData = editor.getData())

          this.$emit('change', data, evt, editor)
        },
        INPUT_EVENT_DEBOUNCE_WAIT,
        { leading: true }
      )

      editor.model.document.on('change:data', emitDebouncedInputEvent)

      editor.editing.view.document.on('focus', evt => {
        this.$emit('focus', evt, editor)
      })

      editor.editing.view.document.on('blur', evt => {
        this.$emit('blur', evt, editor)
      })
    },

    // 提交选中推介表单
    onRecommendPickerSubmit(values) {
      this.$_instance.execute('insertCustomButton', values.id)
      this.recommendPickerModalVisible = false
    }
  },
  mounted() {
    this.editorConfig.custom = {
      fn: () => {
        this.recommendPickerModalVisible = true
      }
    }

    if (this.value) {
      this.editorConfig.initialData = this.value
    }

    ClassicEditor.create(this.$refs.textareaRef, this.editorConfig)
      .then(editor => {
        this.$_instance = editor
        this.$_setUpEditorEvents()

        this.$emit('ready', editor)
      })
      .catch(error => {
        console.error(error)
      })
  },
  beforeDestroy() {
    if (this.$_instance) {
      this.$_instance.destroy()
      this.$_instance = null
    }

    this.$emit('destroy', this.$_instance)
  }
}
</script>

<style lang="less" scoped></style>
