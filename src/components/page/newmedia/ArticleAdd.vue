<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>新媒体管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加文章</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="editing">
        <span>编辑文章</span>
      </el-form-item>
      <el-form-item label="封面：" v-if="editing">
        <span>{{article.title}}</span>
      </el-form-item>
    </el-form>

    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" :model="article" label-width="100px" style="width: 500px;" label-position="left">
        <el-form-item label="封面上传">
          <UploadSingle
            :imgUrl="article.coverUrl"
            :imgKey="article.coverKey"
            :size=1 dimension="520x676" name="article"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
        </el-form-item>
        <el-form-item label="选择栏目">
          <el-select v-model="article.navigationId" filterable placeholder="请输入栏目进行搜索">
            <el-option v-for="item in optionColumn" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择作者">
          <el-select v-model="article.authorId" remote filterable :remote-method="searchAuthorName" placeholder="请输入作者进行搜索">
            <el-option
              v-for="item in optionAuthor"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-select v-model="article.labels" multiple filterable allow-create placeholder="请选择/输入文章标签">
            <!--<el-option v-for="item in optionTag" :label="item.name" :value="item.id"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="日期" >
          <el-date-picker
            v-model="article.publicationDate"
            format="yyyy-MM-dd"
            @change="handleDatePick"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input type="textarea" :rows="4" v-model="article.introduction"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" style="width: 800px">
          <simditor :content="article.content" :options="options2" @change="change" @simditorHandleSuccess="simditorHandleSuccess"></simditor>
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
import api from '@/api'
import Simditor from '../../util/Simditor'
import UploadSingle from '../../util/UploadSingle'

const _ = require('lodash')

export default {
  data() {
    return {
      editing: false,
      article: {
        publicationDate: ''
      },
      options2: {
        placeHolder: '输入文章内容',
        toolbarFloat: false,
        upload: {
          url: '//up-z2.qiniu.com',
          params: {
            token: ''
          }
        },
        toolbar: ['title', 'image'],
        cleanPaste: true
        // toolbarFloat: false,
        // cleanPaste: true
      },
      optionColumn: [],
      optionAuthor: [],
      optionTag: []
    }
  },
  components: {
    Simditor,
    UploadSingle
  },
  async created() {
    this.fetchData()
  },
  // 组件复用，路由数据刷新
  /* eslint-disable */
  watch: {
    '$route'() {
      this.fetchData()
    }
  },
  async mounted() {
    const tokenData = await api.get('/api/system/upload/getToken')
    console.log(tokenData)
      if (tokenData.code === 200) {
        this.options2.upload.params.token = tokenData.data.token
        console.log(this.options2)
      }
  },
  /* eslint-enable */
  methods: {
    change(html) {
      this.article.content = html
    },
    async fetchData() {
      const getNavigation = await api.get('/api/system/wechat/listNavigation')
      if (getNavigation.code === 200) {
        this.optionColumn = getNavigation.data
      }
      this.optionTag = []
      const getAuthor = await api.get('/api/system/author/listAuthor')
      if (getAuthor.code === 200) {
        this.optionAuthor = getAuthor.data.array
      }
      // editing
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/wechat/getArticle', { articleId: this.$route.params.id })
        if (code === 200) {
          this.article = data
        }
      } else {
      // new
        this.editing = false
        this.article = { navigationId: null, authorId: null, publicationDate: null, labels: [], content: '' }
      }
    },
    async searchAuthorName(inputAuthorName) {
      const { code, data } = await api.get('/api/system/author/listAuthor', { authorName: inputAuthorName })
      if (code === 200) {
        this.optionAuthor = data.array
      }
    },
    // 日期更改
    handleDatePick(val) {
      this.article.publicationDate = val
    },
    handleRemove(name) {
      if (name === 'article') {
        this.article.coverUrl = null
        this.article.coverKey = null
      }
    },
    handleSuccess(response, bucketPort, name) {
      if (name === 'article') {
        this.$set(this.article, 'coverUrl', `${bucketPort}/${response.key}`)
        this.$set(this.article, 'coverKey', response.key)
      }
    },
    simditorHandleSuccess(response, bucketPort) {
      this.$set(this.article, 'simditorImgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.article, 'simditorImgKey', response.key)
    },
    async save() {
      if (!this.article.coverUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      } else if (!this.article.navigationId || !this.article.authorId || !this.article.title || !this.article.labels || !this.article.publicationDate || !this.article.introduction || !this.article.content) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      // 对上post的key
      this.article.labelList = JSON.stringify((_.clone(this.article.labels)))
      if (this.editing) {
        // this.$set(this.cover, 'publicationDate', this.article.publicationDate.slice(0, 16))
        const { code } = await api.post('/api/system/wechat/updateArticle', this.article)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/newmedia/list')
        } else {
          return this.$notify.error({ title: '失败', message: code + '保存失败' })
        }
      } else {
        this.article.authorId = this.article.authorId
        const { code } = await api.post('/api/system/wechat/addArticle', this.article)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/newmedia/list')
        }
      }
    }
  }
}
</script>
<style type="text/css">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .simditor-body img {
    display: block;
    width: 100%!important;
    height: auto;
  }

  .simditor-body h1 {
    font-size: 22px;
  }

  .simditor-body h2 {
    font-size: 20px;
  }

  .simditor-body h3 {
    font-size: 18px
  }
</style>
