<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>视频管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加视频</span>
      </el-form-item>
      <el-form-item label="菜单："v-if="editing">
        <span>编辑视频</span>
      </el-form-item>
      <el-form-item label="音频：" v-if="editing">
        <span>{{video.title}}</span>
      </el-form-item>
    </el-form>
    <!-- 添加表单 -->
    <div class="form-box">
      <el-form ref="form" abel-position="left" label-width="100px" style="width: 500px;">
        <el-form-item label="封面上传">
          <UploadSingle
            :imgUrl="video.coverUrl"
            :imgKey="video.coverKey"
            :size=1 dimension="240x240"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-select v-model="video.navigationId" :filterable="true" :remote="true"
            placeholder="请输入视频分类搜索">
            <el-option
              v-for="item in columnResults"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频标题">
          <el-input v-model="video.title"></el-input>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="video.time"></el-input>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="video.url"></el-input>
        </el-form-item>
        <el-form-item label="视频摘要">
          <el-input type="textarea" :rows="4" v-model="video.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/video/list')">取消</el-button>
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
      columnResults: [],
      editing: false,
      video: { navigationId: '' },
      uploadParams: {}
    }
  },
  components: {
    UploadSingle
  },
  async created() {
    this.fetchData()
  },
  // 组件复用，路由数据刷新
  async beforeRouteUpdate() {
    this.fetchData()
  },
  watch: {
    /* eslint-disable */
    '$route'() {
      console.log('########')
      this.fetchData()
    /* eslint-enable */
    }
  },
  methods: {
    // 获取数据
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/video/getVideo?', { id: this.$route.params.id })
        if (code === 200) {
          this.video = data
        }
      } else {
        this.editing = false
        this.video = { navigationId: null }
      }
      // 拿回所有栏目
      const { code, data } = await api.get('/api/system/video/listNavigation')
      if (code === 200) {
        this.columnResults = data
      }
    },
    async searchColumn() {
      // console.log('12345')
      // const { code, data } = await api.get('/api/system/video/listNavigation', { name: val })
      // if (code === 200) {
      //   this.columnResults = data
      //   if (this.columnResults.length > 10) {
      //     this.columnResults.length = 10
      //   }
      // }
    },
    // 删除封面图片
    handleRemove() {
      this.video.coverKey = null
      this.video.coverUrl = null
    },
    // 封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.video, 'coverUrl', `${bucketPort}/${response.key}`)
      this.$set(this.video, 'coverKey', response.key)
    },
    async save() {
      console.log(this.video)
      if (!this.video.coverUrl || !this.video.navigationId || !this.video.time || !this.video.title || !this.video.remark || !this.video.url) {
        return this.$notify.error({ title: '错误', message: '表单信息或图片信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/video/updateVideo', this.video)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/video/list')
        }
      } else {
        const { code } = await api.post('/api/system/video/addVideo', this.video)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/video/list')
        }
      }
    }
  }
}
</script>
