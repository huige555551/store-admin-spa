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
          <el-select v-model="article.navigationId" filterable remote
            placeholder="请输入文章标题搜索">
            <el-option
              v-for="item in columnResults"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择作者">
          <el-select v-model="article.authorId" filterable remote
            placeholder="请输入作者名进行搜索"
            :remote-method="searchAuthor">
            <el-option
              v-for="item in authorResults"
              :key="item.id"
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
          </el-select>
        </el-form-item>
        <el-form-item label="期数">
          <el-input v-model="article.period" @change="ValidateNumber"></el-input>
        </el-form-item>
        <transition name="fade">
          <el-form-item v-show="!isNum" style="margin-bottom: 0;margin-top: -24px;">
            <span style="color:red;font-size-12px;font-weight:300;">请输入大于零的整数</span>
          </el-form-item>
        </transition>
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
          <simditor  @change="change" :content="article.content" :options="options2" v-model="article.content"></simditor>
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
      isNum: true,
      columnResults: [],
      authorResults: [],
      article: {
        labels: [],
        publicationDate: null,
        navigationId: null,
        authorId: null,
        content: ''
      },
      options2: {
        placeHolder: '输入文章内容',
        toolbarFloat: false,
        upload: true,
        toolBar: ['title', 'italic', 'underline'],
        cleanPaste: true
      }
    }
  },
  components: {
    Simditor,
    UploadSingle
  },
  watch: {
    /* eslint-disable */
    '$route'() {
      console.log('########')
      this.fetchData()
    /* eslint-enable */
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    async fetchData() {
      const getAuthor = await api.get('/api/system/author/listAuthor')
      if (getAuthor.code === 200) {
        this.authorResults = getAuthor.data.array
        console.log(this.authorResults.length)
      }
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/article/getArticle?', { articleId: this.$route.params.id })
        if (code === 200) {
          this.article = data
        }
      } else {
        this.editing = false
        this.article = {
          labels: [],
          publicationDate: '',
          navigationId: '',
          authorId: '',
          content: ''
        }
      }
      // 拿回所有栏目
      const { code, data } = await api.get('/api/system/article/listNavigation')
      if (code === 200) {
        this.columnResults = data
      }
    },
    handlearticleSuccess(response) {
      // TODO response.key是什么
      this.$notify.success({ title: '成功', message: '上传成功' })
      // this.$set(this.audio, 'imgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.article, 'imgKey', response.key)
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
    ValidateNumber(val) {
      if (val !== '') {
        if (/^[1-9]\d*$/.test(val) === false) {
          console.log('不是数字')
          this.isNum = false
        } else {
          this.isNum = true
        }
      } else {
        this.isNum = true
      }
    },
    change(html) {
      this.article.content = html
    },
    // async searchColumn(val) {
    //   const { code, data } = await api.get('/api/system/article/listNavigation', { name: val })
    //   if (code === 200) {
    //     this.columnResults = data
    //     if (this.columnResults.length > 10) {
    //       this.columnResults.length = 10
    //     }
    //   }
    // },
    async searchAuthor(val) {
      const { code, data } = await api.get('/api/system/author/listAuthor', { authorName: val })
      if (code === 200) {
        console.log(data)
        this.authorResults = data.array
        if (this.columnResults.length > 10) {
          this.columnResults.length = 10
        }
      }
    },
    async save() {
      if (!this.article.coverUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      }
      if (!this.article.title || !this.article.navigationId || !this.article.period || !this.article.authorId || !this.article.publicationDate || !this.article.coverKey || !this.article.content || !this.article.introduction) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
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
