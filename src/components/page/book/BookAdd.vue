<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>图书管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加图书</span>
      </el-form-item>
      <el-form-item label="菜单："v-if="editing">
        <span>编辑图书</span>
      </el-form-item>
      <el-form-item label="图书：" v-if="editing">
        <span>{{book.name}}</span>
      </el-form-item>
    </el-form>

    <el-form ref="form" :model="book" label-width="100px" style="width: 500px;">
      <el-form-item label="封面上传">
        <UploadSingle
          :imgUrl="book.coverUrl"
          :imgKey="book.coverKey"
          :size=1 dimension="560x440" name="cover"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
        <div slot="tip" class="el-upload__tip">建议尺寸520x676，只能上传jpg/png文件，且不超过1MB</div>
      </el-form-item>
      <el-form-item label="封面标题">
        <el-input v-model="book.name"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="book.author"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="book.price"></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="book.publisher"></el-input>
      </el-form-item>
      <el-form-item label="出版时间">
        <el-date-picker
          v-model="book.publicationDate"
          format="yyyy-MM-dd"
          @change="handleDatePick"
          type="date"
          :clearable="false"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="购买链接">
        <el-input v-model="book.buyUrl"></el-input>
      </el-form-item>
      <el-form-item label="豆瓣链接">
        <el-input v-model="book.douban"></el-input>
      </el-form-item>
      <el-form-item label="图书介绍">
        <el-input type="textarea" :rows="4" v-model="book.introduction"></el-input>
      </el-form-item>
      <el-form-item label="介绍图片">
        <UploadSingle
          :imgUrl="book.introductionImgUrl"
          :imgKey="book.introductionImgKey"
          :size=1 dimension="560x440" name="introduction"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
        <div slot="tip" class="el-upload__tip">建议尺寸560x440，只能上传jpg/png文件，且不超过1MB</div>
      </el-form-item>
      <el-form-item label="图书目录">
        <el-input type="textarea" :rows="4" v-model="book.directory"></el-input>
      </el-form-item>
      <el-form-item label="目录图片">
        <UploadSingle
          :imgUrl="book.directoryImgUrl"
          :imgKey="book.directoryImgKey"
          :size=1 dimension="560x440" name="directory"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
        <div slot="tip" class="el-upload__tip">建议尺寸560x440，只能上传jpg/png文件，且不超过1MB</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">提交</el-button>
        <el-button @click="$router.push('/book/list')">取消</el-button>
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
      book: { publicationDate: '' },
      uploadParams: {},
      value: ''
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
    console.log(this.editing)
    this.fetchData()
  },
  methods: {
    // 获取数据
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/book/getBook?', { bookId: this.$route.params.id })
        if (code === 200) {
          this.book = data
        }
      } else {
        this.editing = false
        this.book = { publicationDate: null }
      }
    },
    // 删除封面图片
    handleRemove(name) {
      if (name === 'cover') {
        this.book.coverUrl = null
        this.book.coverKey = null
      } else if (name === 'introduction') {
        this.book.storyImgUrl = null
        this.book.storyImgKey = null
      } else if (name === 'directory') {
        this.book.directoryImgUrl = null
        this.book.directoryImgKey = null
      }
    },
    handleSuccess(response, bucketPort, name) {
      if (name === 'cover') {
        this.$set(this.book, 'coverUrl', `${bucketPort}/${response.key}`)
        this.$set(this.book, 'coverKey', response.key)
      } else if (name === 'introduction') {
        this.$set(this.book, 'introductionImgUrl', `${bucketPort}/${response.key}`)
        this.$set(this.book, 'introductionImgKey', response.key)
      } else if (name === 'directory') {
        this.$set(this.book, 'directoryImgUrl', `${bucketPort}/${response.key}`)
        this.$set(this.book, 'directoryImgKey', response.key)
      }
    },
    handleDatePick(val) {
      this.book.publicationDate = val
    },
    async save() {
      console.log(this.book)
      if (!this.book.coverUrl || !this.book.introductionImgUrl || !this.book.directoryImgUrl || !this.book.name || !this.book.author || !this.book.publisher || !this.book.publicationDate || !this.book.introduction || !this.book.buyUrl || !this.book.douban) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/book/updateBook', this.book)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/book/list')
        }
      } else {
        const { code } = await api.post('/api/system/book/addBook', this.book)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/book/list')
        }
      }
    }
  }
}
</script>
