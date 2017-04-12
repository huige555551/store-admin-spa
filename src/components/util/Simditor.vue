<template>
  <textarea id="editor"></textarea>
</template>

<script>
import $ from 'jquery'
import api from '@/api'
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
      token: null,
      editor: null,
      fileKey: '',
      uploadParams: null,
      bucketPort: null
    }
  },
  async mounted() {
    const { code, data } = await api.get('/api/system/upload/getToken')
    if (code === 200) {
      this.token = data.token
    }
    const getToken = this.token
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
        placeHolder: '输入文章内容',
        toolbarFloat: false,
        url: 'http://up-z2.qiniu.com',
        params: {
          unique_names: true,
          save_key: false,
          token: getToken
        },
        fileKey: 'file', // 服务器端获取文件数据的参数名
        connectionCount: 3,
        leaveConfirm: '正在上传文件,你确定要离开这个页面吗？',
        fileSize: 2097152
      }
    }, this.options))
  }
}
</script>
