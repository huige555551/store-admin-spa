<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>固定栏目</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>新增封面</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="editing">
        <span>编辑封面</span>
      </el-form-item>
      <el-form-item label="封面：" v-if="editing">
        <span>{{cover.title}}</span>
      </el-form-item>
    </el-form>

    <!-- 表单 -->
    <el-form ref="form" :model="cover" label-position="left" label-width="100px" style="width: 500px;">
      <el-form-item label="封面上传">
        <UploadSingle
          :imgUrl="cover.coverUrl"
          :imgKey="cover.coverKey"
          :size=1 dimension="520x676" name="cover"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="cover.publicationDate"
          format="yyyy-MM-dd"
          @change="handleDatePick"
          type="date"
          :clearable="false"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="封面标题">
        <el-input v-model="cover.title"></el-input>
      </el-form-item>
      <el-form-item label="期数">
        <el-input v-model="cover.period"></el-input>
      </el-form-item>
      <el-form-item label="购买链接">
        <el-input v-model="cover.buyUrl"></el-input>
      </el-form-item>
      <el-form-item label="杂志故事">
        <el-input type="textarea" :rows="4" v-model="cover.story"></el-input>
      </el-form-item>
      <el-form-item label="故事图片">
        <UploadSingle
          :imgUrl="cover.storyImgUrl"
          :imgKey="cover.storyImgKey"
          :size=1 dimension="560x440" name="story"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
      </el-form-item>
      <el-form-item label="杂志目录">
        <el-input type="textarea" :rows="4" v-model="cover.story"></el-input>
        <el-button style="margin-top: 10px;">编辑</el-button>
      </el-form-item>
      <el-form-item label="目录图片">
        <UploadSingle
          :imgUrl="cover.directoryImgUrl"
          :imgKey="cover.directoryImgKey"
          :size=1 dimension="560x440" name="directory"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="save">保存</el-button>
        <el-button @click.native.prevent="$router.push('/cover/list')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api'
import UploadSingle from '@/components/util/UploadSingle'

export default {
  data() {
    return {
      editing: false,
      cover: {}
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
  methods: {
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/cover/getCover', { coverId: this.$route.params.id })
        if (code === 200) {
          this.cover = data
        }
      } else {
        this.editing = false
        this.cover = {}
        this.cover.publicationDate = null
      }
    },
    handleDatePick(val) {
      console.log(val)
      // this.cover.publicationDate = val
    },
    handleRemove(name) {
      if (name === 'cover') {
        this.cover.coverUrl = null
        this.cover.coverKey = null
      } else if (name === 'story') {
        this.cover.storyImgUrl = null
        this.cover.storyImgKey = null
      } else if (name === 'directory') {
        this.cover.directoryImgUrl = null
        this.cover.directoryImgKey = null
      }
    },
    handleSuccess(response, bucketPort, name) {
      if (name === 'cover') {
        this.$set(this.cover, 'coverUrl', `${bucketPort}/${response.key}`)
        this.$set(this.cover, 'coverKey', response.key)
      } else if (name === 'story') {
        this.$set(this.cover, 'storyImgUrl', `${bucketPort}/${response.key}`)
        this.$set(this.cover, 'storyImgKey', response.key)
      } else if (name === 'directory') {
        this.$set(this.cover, 'directoryImgUrl', `${bucketPort}/${response.key}`)
        this.$set(this.cover, 'directoryImgKey', response.key)
      }
    },
    async save() {
      if (!this.cover.coverUrl || !this.cover.storyImgUrl || !this.cover.directoryImgUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      } else if (!this.cover.publicationDate || !this.cover.title || !this.cover.period || !this.cover.buyUrl || !this.cover.story || !this.cover.directory) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/cover/updateCover', this.cover)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/cover/list')
        }
      } else {
        const { code } = await api.post('/api/system/cover/addCover', this.cover)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/cover/list')
        }
      }
    }
  }
}
</script>
