<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>音频管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加音频</span>
      </el-form-item>
      <el-form-item label="菜单："v-if="editing">
        <span>编辑音频</span>
      </el-form-item>
      <el-form-item label="音频：" v-if="editing">
        <span>{{audio.title}}</span>
      </el-form-item>
    </el-form>
    <!-- 创建表单 -->
    <div class="form-box">
      <el-form label-width="100px" label-position="left" style="width: 500px;">
        <el-form-item label="封面上传">
          <UploadSingle
            :imgUrl="audio.imgUrl"
            :imgKey="audio.imgKey"
            :size=1 dimension="268x150"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-select v-model="audio.navigationId" filterable remote
            placeholder="请输入栏目进行搜索">
            <el-option
              v-for="item in columnResults"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="音频标题">
          <el-input v-model="audio.title"></el-input>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="audio.time"></el-input>
        </el-form-item>
        <el-form-item label="音频链接">
          <div v-show="uploading" style="font-size: 14px;color: #48576a;">上传中,请稍候……</div>
          <div v-show="audioName">
            <p>{{ audioName }}</p>
            <el-button @click="changeAudio">替换</el-button>
          </div>
          <el-upload
            v-show="uploadEnable"
            action="//up-z2.qiniu.com"
            name = "file"
            accept="audio/*"
            :show-file-list="false"
            :multiple="false"
            :on-progress="handleAudioUploading"
            :on-success="handleAudioSuccess"
            :on-error="handleAudioError"
            :before-upload="beforeAudioUpload"
            :data="uploadParams">
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传mp3文件</div> -->
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

export default {
  data() {
    return {
      uploadEnable: true,
      uploading: false,
      columnResults: [],
      editing: false,
      audio: { navigationId: '', audioName: null },
      uploadParams: { token: null },
      audioName: '',
      value: ''
    }
  },
  components: {
    UploadSingle
  },
  async created() {
    console.log('audioadd created')
    this.fetchData()
    return api.get('/api/system/upload/getToken').then(response => {
      this.bucketPort = response.data.bucketPort
      this.uploadParams = {
        token: response.data.token
      }
    })
  },
  mounted() {
    console.log('audioadd mounted')
    document.querySelectorAll('.el-upload__input')[1].setAttribute('name', 'file')
  },
  // 组件复用，路由数据刷新
  watch: {
    /* eslint-disable */
    '$route'() {
      this.fetchData()
    /* eslint-enable */
    }
  },
  methods: {
    // 获取数据
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/audio/getAudio?', { id: this.$route.params.id })
        if (code === 200) {
          this.audio = data
          this.audioName = data.fileKey
        }
      } else {
        this.editing = false
        this.audio = { navigationId: null }
      }
      // 拿回所有栏目
      const { code, data } = await api.get('/api/system/audio/listNavigation')
      if (code === 200) {
        this.columnResults = data
      }
    },
    // async searchColumn(val) {
    //   const { code, data } = await api.get('/api/system/audio/listNavigation', { name: val })
    //   if (code === 200) {
    //     this.columnResults = data
    //     if (this.columnResults.length > 10) {
    //       this.columnResults.length = 10
    //     }
    //   }
    // },
    // 音频上传
    beforeAudioUpload() {
      // if (file.type.indexOf('mp3') === -1) {
      //   this.$notify.error({ title: '错误', message: '只能上传mp3格式文件' })
      //   return false
      // }
      // return api.get('/api/system/upload/getToken').then(response => {
      //   this.bucketPort = response.data.bucketPort
      //   this.uploadParams = {
      //     token: response.data.token
      //   }
      // })
      console.log('we in')
    },
    handleAudioUploading() {
      this.audioName = null
      this.uploading = true
      this.uploadEnable = false
    },
    handleAudioSuccess(response, file) {
      this.uploading = false
      this.audioName = file.name
      this.$notify.success({ title: '成功', message: '上传成功' })
      this.$set(this.audio, 'fileKey', response.key)
    },
    handleAudioError(err) {
      console.log(err)
      this.uploading = false
      this.uploadEnable = true
    },
    // 更换音频
    changeAudio() {
      this.audioName = null
      this.uploadEnable = true
    },
    // 删除封面图片
    handleRemove() {
      this.audio.imgKey = null
      this.audio.imgUrl = null
    },
    // 封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.audio, 'imgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.audio, 'imgKey', response.key)
    },
    async save() {
      if (!this.audio.imgUrl || !this.audio.navigationId || !this.audio.time || !this.audio.title || !this.audio.introduction || !this.audio.fileKey) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
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
