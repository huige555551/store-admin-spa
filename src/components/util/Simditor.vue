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
      editor: ''
    }
  },
  watch: {
    content(val) {
      this.editor.setValue(val)
    }
  },
  mounted() {
    /* eslint-disable no-new */
    console.log('options', this.options)
    this.editor = new Simditor(Object.assign({}, {
      textarea: $('#editor'),
      toolbar: [
        'title',
        'bold',
        'italic',
        'underline',
        'link',
        'image']// 自定义工具栏
    }, this.options))
    this.editor.on('valuechanged', (e, src) => {
      this.valueChange(e, src)
    })
    this.editor.setValue(this.content)
  },
  methods: {
    valueChange() {
      this.$emit('change', this.editor.getValue())
    }
  }
}
</script>
