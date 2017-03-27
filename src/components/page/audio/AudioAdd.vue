<template>
  <div>
    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" :model="audio" label-width="100px" style="width: 500px;">
        <el-form-item label="封面上传">
          <UploadSingle
            :imgUrl="audio.imgUrl"
            :imgKey="audio.imgKey"
            :size=1 dimension="240x240"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>

        </el-form-item>
        <el-form-item label="选择分类">
          <el-select v-model="audio.navigationId" filterable placeholder="请输入分类进行搜索">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音频标题">
          <el-input v-model="audio.title"></el-input>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="audio.length"></el-input>
        </el-form-item>
        <el-form-item label="音频链接">
          <template v-show="audio.fileUrl">
            <p>还哭的声音.mp3</p>
            <el-button>替换</el-button>
          </template>
          <el-upload 
            v-show="!audio.fileUrl"
            action="//up-z2.qiniu.com" 
            accept="audio/*"
            :show-file-list="false"
            :multiple="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp3文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="音频摘要">
          <el-input type="textarea" :rows="4" v-model="audio.introduction"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/audio/list')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import UploadSingle from '@/components/util/UploadSingle'
// const _ = require('lodash')

export default {
  data() {
    return {
      editing: false,
      audio: {
        navigationId: null,
        length: null,
        title: null,
        time: null,
        introduction: null,
        fileKey: null,
        fileUrl: null,
        imgKey: null, // data内声明，允许子组件跟踪值变化
        imgUrl: null  // data内声明，允许子组件跟踪值变化
      },
      options: [
        { id: '1', value: '1', label: '1' },
        { id: '2', value: '2', label: '2' },
        { id: '3', value: '3', label: '3' },
        { id: '4', value: '4', label: '4' },
        { id: '5', value: '5', label: '5' }
      ]
    }
  },
  components: {
    UploadSingle
  },
  async created() {
    if (this.$route.params.id) {
      this.editing = true
      const { code, data } = await api.get('/api/system/audio/getAudio?', { id: this.$route.params.id })
      if (code === 200) {
        console.log(data)
        this.audio = data
      }
    }
  },
  methods: {
    // 删除封面图片
    handleRemove() {
      this.audio.imgKey = null
      this.audio.imgUrl = null
    },
    // 封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.audio.imgKey = response.key
      this.audio.imgUrl = `${bucketPort}/${response.key}`
    },
    async save() {
      if (!this.audio.imgUrl || !this.audio.navigationId || !this.audio.length || !this.audio.title || !this.audio.introduction) {
        console.log(!this.audio.introduction)
        return this.$notify.error({ title: '错误', message: '表单信息或图片信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/audio/updateAudio', this.audio)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/audio/list')
        }
      } else {
        const { code } = await api.post('/api/system/audio/addAudio', this.audio)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/audio/list')
        }
      }
    }
  }
}
</script>
