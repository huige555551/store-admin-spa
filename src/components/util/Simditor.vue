<template>
  <textarea id="editor"></textarea>
</template>

<script>
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
      defaultImage: '/assets/avatar.jpg',
      upload: {
        url: 'http://up-z2.qiniu.com',
        params: {
          unique_names: true,
          save_key: false,
          token: 'v_d4R_-nzDOrMJUnB5tynyL5IRfTtM9clDKj8Gtr:ZQykCVDMEvDRjMzE6cmOhIN_Y2w=:eyJzY29wZSI6Im5ld3dlZWtseS1maWxlIiwiZGVhZGxpbmUiOjE0OTE3MjYxMzd9'
        },
        fileKey: 'file', // 服务器端获取文件数据的参数名
        connectionCount: 3,
        leaveConfirm: '正在上传文件,你确定要离开这个页面吗？',
        fileSize: 2097152
      }
    }, this.options))
    this.editor.on('valuechanged', (e, src) => {
      this.valueChange(e, src)
    })
  },
  methods: {
    valueChange() {
      this.$emit('change', this.editor.getValue())
    }
  }
}
</script>
