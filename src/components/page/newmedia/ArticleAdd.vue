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
          <el-select v-model="article.navigationName" filterable placeholder="请输入栏目进行搜索">
            <el-option v-for="item in optionColumn" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="选择作者">
          <el-select v-model="article.authorId" filterable placeholder="请输入作者进行搜索">
            <el-option v-for="item in optionAuthor" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="选择作者">
          <el-select v-model="article.authorName" filterable placeholder="请输入作者进行搜索">
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
          <el-select v-model="article.labelList" multiple filterable allow-create placeholder="请选择/输入文章标签">
            <el-option v-for="item in optionTag" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" v-model="article.publicationDate">
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
        <el-form-item label="文章内容" style="width: 800px" v-model="article.content">
          <simditor :content="article.content" :options="options2" @change="change"></simditor>
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

// export default {
//   data() {
//     return {
//       searchKey: '',
//       article: {
//         tags: []
//       },
//       options: [
//         { id: '1', value: '选项1', label: '选项1' },
//         { id: '2', value: '选项2', label: '选项2' },
//         { id: '3', value: '选项3', label: '选项3' },
//         { id: '4', value: '选项4', label: '选项4' },
//         { id: '5', value: '选项5', label: '选项5' }
//       ],
//       initContent: '<p>123456</p>',
//       options2: {
//         placeHolder: '输入文章内容',
//         toolbarFloat: false,
//         upload: true,
//         // toolbar: ['title', 'image'],
//         cleanPaste: true
//       }
//     }
//   },
//   components: {
//     Simditor
//   },
//   methods: {
//     onSubmit() {
//       this.$message.success('提交成功！')
//     },
//     change(val) {
//       console.log(val)
//     }
//   },
//   beforeRouteLeave(to, from, next) {
//     // TODO 突然离开未保存，提示管理员
//     console.log('leave')
//     next()
//   }
// }


export default {
  data() {
    return {
      editing: false,
      article: {
        content: '<p>123456</p>'
      },
      options2: {
        placeHolder: '输入文章内容',
        toolbarFloat: false,
        upload: true,
        // toolbar: ['title', 'image'],
        cleanPaste: true
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
  watch: {
    '$route'() {
      this.fetchData()
    }
  },
  methods: {
    change() {
    },
    async fetchData() {
      const getNavigation = await api.get('/api/system/article/listNavigation')
      if (getNavigation.code === 200) {
        this.optionColumn = getNavigation.data
      }
      const getTag = await api.get('/api/system/author/listAuthor')
      if (getTag.code === 200) {
        this.optionTag = getTag.data.array
      }
      const getAuthor = await api.get('/api/system/author/listAuthor')
      if (getAuthor.code === 200) {
        this.optionAuthor = getAuthor.data.array
      }
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/wechat/getArticle', { articleId: this.$route.params.id })
        if (code === 200) {
          this.article = data
        }
      } else {
        console.log('add new')
        this.editing = false
        this.article = {}
      }
    },
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
    async save() {
      if (!this.article.coverUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      } else if (!this.article.searchKeyColumn || !this.article.searchKeyAuthor || !this.article.title || !this.article.tags || !this.article.introduction || !this.article.content) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      // this.publicationDate = new Moment(this.publicationDate).format('yyyy-MM-dd')
      // console.log(this.publicationDate)
      if (this.editing) {
        // this.$set(this.cover, 'publicationDate', this.article.publicationDate.slice(0, 16))
        const { code } = await api.post('/api/system/wechat/updateArticle', this.article)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/newmedia/list')
        }
      } else {
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
