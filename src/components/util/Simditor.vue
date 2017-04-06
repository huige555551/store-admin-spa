<template>
  <textarea id="editor"></textarea>
</template>

<script>
import api from '@/api'
import $ from 'jquery'
import Simditor from 'simditor'
import 'simditor/styles/simditor.css'

export default {
  name: 'simditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      editor: null,
      fileKey: '',
      uploadParams: null,
      bucketPort: null
    }
  },
  watch: {
    content(val) {
      this.editor.setValue(val)
    }
  },
  mounted() {
    /* eslint-disable no-new */
    this.editor = new Simditor(Object.assign({}, {
      textarea: $('#editor'),
      // 自定义工具栏
      toolbar: [
        'title',
        'bold',
        'italic',
        'underline',
        'link',
        'image'],
      upload: {
        url: '//up.qiniu.com', // 文件上传的接口地址
        fileKey: 'file', // 服务器端获取文件数据的参数名
        params: null,
        connectionCount: 3,
        leaveConfirm: '正在上传文件,你确定要离开这个页面吗？'
      }
    }, this.options))
    this.editor.on('valuechanged', (e, src) => {
      this.valueChange(e, src)
    })
    this.editor.uploader.on('uploadsuccess', (_this) => {
      console.log('uploadsuccess', _this)
    })
    this.editor.uploader.on('beforeupload', () => {
      api.get('/api/system/upload/getToken').then(response => {
        this.$set(this.uploadParams, 'unique_names', true)
        this.$set(this.uploadParams, 'save_key', false)
        this.$set(this.uploadParams, 'token', response.data.token)
      })
    })
    this.$set(this.editor.opts, 'params', this.uploadParams)
    console.log('opts', this.editor.opts, this.uploadParams)
    this.editor.setValue(this.content)
  },
  methods: {
    valueChange() {
      this.$emit('change', this.editor.getValue())
    }
  }
}
</script>
