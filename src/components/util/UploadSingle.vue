<template>
  <div>
    <img class="thumb" v-show="imgUrl" :src="`${imgUrl}`" style="display: block; margin-bottom: 10px;">
    <el-button v-show="imgUrl" @click="handleRemove">删除</el-button>
    <el-upload
      v-show="!imgUrl"
      accept="image/*"
      action="//up-z2.qiniu.com"
      :name="file"
      :show-file-list="false"
      :multiple="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :data="uploadParams">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">建议尺寸{{ dimension }}，可上传jpg/png/gif文件，且不超过{{ size }}MB</div>
    </el-upload>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'UploadSingle',
  props: {
    dimension: {
      type: String,
      default: '1440x520'
    },
    size: {
      type: Number,
      default: 1 // 默认1MB
    },
    imgUrl: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      bucketPort: null,
      uploadParams: {
        unique_names: true,
        save_key: false,
        token: null
      },
      file: 'file'
    }
  },
  created() {
    return api.get('/api/pic/getUploadToken').then(response => {
      // this.bucketPort = response.data.bucketPort
      this.uploadParams = {
        unique_names: true,
        save_key: false,
        token: response.data.uploadToken
      }
    })
  },
  mounted() {
    console.log('uploadsingle mounted')
    document.querySelectorAll('input[type=file]').forEach((item) => {
      item.setAttribute('name', 'file')
    })
  },
  methods: {
    // 删除按钮
    handleRemove() {
      this.$emit('handleRemove', this.name)
    },
    // 文件上传
    beforeUpload(file) {
      console.log('before upload')
      if (file.size / 1024 / 1024 > this.size) {
        return this.$notify.error({ title: '错误', message: `建议尺寸${this.dimension}，只能上传jpg/png文件，且不超过${this.size}MB` })
      }
    },
    // 上传成功
    handleSuccess(response) {
      this.$emit('handleSuccess', response)
    }
  }
}
</script>
