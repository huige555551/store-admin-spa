<template>
  <div>
  <!-- TODO content部分 -->
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>栏目文章</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>添加文章</span>
      </el-form-item>
    </el-form>

    <!-- 表单 -->
    <div class="form-box">
      <el-form ref="form" :model="article" label-width="100px" style="width: 500px;">
        <el-form-item label="封面上传">
          <UploadSingle
            :imgUrl="article.coverUrl"
            :imgKey="article.coverKey"
            :size=1 dimension="240x240"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
          <div slot="tip" class="el-upload__tip">建议尺寸790x400，只能上传jpg/png文件，且不超过1MB</div>
        </el-form-item>
        <el-form-item label="选择栏目">
          <el-select v-model="article.navigationId" filterable placeholder="请输入栏目进行搜索">
            <el-option label="选项一" value="1">选项一</el-option>
            <el-option label="选项二" value="2">选项二</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择作者">
          <el-select v-model="article.authorId" filterable placeholder="请输入作者进行搜索">
            <el-option label="选项一" value="1">选项一</el-option>
            <el-option label="选项二" value="2">选项二</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-select v-model="article.tags" multiple filterable allow-create placeholder="请输入文章标签">
            <el-option label="选项一" value="ofo">选项一</el-option>
            <el-option label="选项二" value="uc">选项二</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期数">
          <el-input v-model="article.period"></el-input>
        </el-form-item>
        <el-form-item label="发表时间">
          <el-date-picker
            v-model="article.publicationDate"
            format="yyyy-MM-dd"
            @change="handleDatePick"
            type="date"
            :clearable="false"
            placeholder="选择日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input type="textarea" :rows="4" v-model="article.introduction"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" style="width: 800px">
          <simditor  :content="content" :options="options2" v-model="article.content"></simditor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Simditor from '@/components/util/Simditor'
import api from '@/api'
import UploadSingle from '@/components/util/UploadSingle'

export default {
  data() {
    return {
      editing: false,
      searchKey: {},
      article: {
        tags: [],
        publicationDate: '',
        navigationId: '',
        authorId: '',
        content: '<p>123456</p>'
      },
      options2: {
        placeHolder: '输入文章内容',
        toolbarFloat: false,
        upload: true,
        // toolbar: ['title', 'image'],
        cleanPaste: true
      }
    }
  },
  components: {
    Simditor,
    UploadSingle
  },
  async created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/article/getArticle?', { articleId: this.$route.params.id })
        if (code === 200) {
          this.article = data
        }
      } else {
        this.editing = false
        this.article = {
          tags: [],
          publicationDate: '',
          navigationId: '',
          authorId: '',
          content: '123'
        }
      }
    },
    handlearticleSuccess(response) {
      // TODO response.key是什么
      this.$notify.success({ title: '成功', message: '上传成功' })
      this.$set(this.article, 'fileKey', response.key)
    },
    handlearticleError(err, file, fileList) {
      console.log(err, file, fileList)
    },
    // 删除封面图片
    handleRemove() {
      this.article.imgKey = null
      this.article.imgUrl = null
    },
    // 封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.article, 'coverUrl', `${bucketPort}/${response.key}`)
      this.$set(this.article, 'coverKey', response.key)
    },
    handleDatePick(val) {
      this.article.publicationDate = val
    },
    async save() {
      console.log(this.article)
      if (!this.article.title || !this.article.navigationId || !this.article.period || !this.article.authorId || !this.article.publicationDate || !this.article.coverKey || !this.article.content || !this.article.introduction) {
        return this.$notify.error({ title: '错误', message: '表单信息或图片信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/article/updateArticle', this.article)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/article/list')
        }
      } else {
        const { code } = await api.post('/api/system/article/addArticle', this.article)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/article/list')
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // TODO 突然离开未保存，提示管理员
    console.log('leave')
    next()
  }
}
</script>
