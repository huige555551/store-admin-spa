<template>
  <div>
    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" :model="article" label-width="100px" style="width: 500px;">
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
            <el-option v-for="item in optionsColumn" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择作者">
          <el-select v-model="article.authorId" filterable placeholder="请输入作者进行搜索">
            <el-option v-for="item in optionsAuthor" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-select v-model="article.labelList" multiple filterable allow-create placeholder="请选择/输入文章标签">
            <el-option v-for="item in optionsTags" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
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
          <simditor :content="initContent" :options="options2" @change="change"></simditor>
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
        tags: [],
        searchKeyColumn: '',
        searchKeyAuthor: '',
        initContent: '<p>123456</p>'
      },
      optionsColumn: [
        { id: '1', value: '栏目', label: '栏目1' },
        { id: '2', value: '栏目2', label: '栏目2' },
        { id: '3', value: '栏目3', label: '栏目3' },
        { id: '4', value: '栏目4', label: '栏目4' },
        { id: '5', value: '栏目5', label: '栏目5' }
      ],
      optionsAuthor: [
        { id: '1', value: '作者1', label: '作者1' },
        { id: '2', value: '作者2', label: '作者2' },
        { id: '3', value: '作者3', label: '作者3' },
        { id: '4', value: '作者4', label: '作者4' },
        { id: '5', value: '作者5', label: '作者5' }
      ],
      optionsTags: [
        { id: '1', value: '标签1', label: '标签1' },
        { id: '2', value: '标签2', label: '标签2' },
        { id: '3', value: '标签3', label: '标签3' },
        { id: '4', value: '标签4', label: '标签4' },
        { id: '5', value: '标签5', label: '标签5' }
      ],
      initContent: '<p>123456</p>',
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
    if (this.$route.params.id) {
      this.editing = true
      const { code, data } = await api.get('/api/system/wechat/getArticle', { articleId: this.$route.params.id })
      if (code === 200) {
        this.article = data
      }
    }
  },
  methods: {
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
      } else if (!this.article.searchKeyColumn || !this.article.searchKeyAuthor || !this.article.title || !this.article.tags || !this.article.description || !this.initContent) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      // this.publicationDate = new Moment(this.publicationDate).format('yyyy-MM-dd')
      // console.log(this.publicationDate)
      if (this.editing) {
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
