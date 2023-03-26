<template>
  <div class="report-game container">
    <TableBlock title="重大利好配置">
      <template #option>
        <a-button type="primary" icon="plus" @click="onSaveClick"
          >保存</a-button
        >
      </template>

      <Editor :value="editorData" @change="onEditorChange" />
    </TableBlock>
  </div>
</template>

<script>
import * as api from '@/api'
import TableBlock from '@/components/TableBlock'
import Editor from '../../list/article-list/components/CKEditor'

export default {
  name: 'system-activities',
  components: {
    TableBlock,
    Editor
  },
  data() {
    return {
      loading: false,
      updateLoading: false,
      id: '',
      editorData: ''
    }
  },
  methods: {
    // 获取重大利好配置
    getBestNewsConfig() {
      this.loading = true
      api
        .getBestNewsConfig({ id: 1 })
        .then(res => {
          if (res.code === 0) {
            this.id = res.result.id
            this.editorData = res.result.content
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 更新重大利好配置
    updateBestNewsConfig(params, cb) {
      this.updateLoading = true
      api
        .updateBestNewsConfig(params)
        .then(res => {
          if (res.code === 0) {
            cb && cb()
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.updateLoading = false
        })
    },

    // 编辑器输入
    onEditorChange(value) {
      this.editorData = value
    },

    // 保存
    onSaveClick() {
      const params = {
        id: this.id,
        content: this.editorData
      }

      this.updateBestNewsConfig(params, () => {
        this.$success({
          title: '提示',
          content: '保存成功'
        })
      })
    }
  },
  mounted() {
    this.getBestNewsConfig()
  }
}
</script>

<style lang="less"></style>
