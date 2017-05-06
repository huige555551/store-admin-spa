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
        <el-input v-model="book.price" type="number"></el-input>
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
        <el-tree :data="directory" :props="defaultProps"></el-tree>
        <el-button style="margin-top: 10px;" @click="editCatergory">编辑</el-button>
      </el-form-item>
      <el-form-item label="目录图片">
        <UploadSingle
          :imgUrl="book.directoryUrl"
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

    <!-- 录入目录 -->
    <el-dialog title="编辑目录" v-model="catergoryDialog" size="small">
      <el-form ref="form" label-position="left" label-width="100px" style="width: 600px;">
        <!-- 一级目录 -->
        <el-form-item label="一级目录" v-for="(item, index) in directory" :key="index">
          <el-input v-model="item.name" placeholder="一级目录名" class="inline"></el-input>
          <el-input v-model="item.page" placeholder="页码" class="inline pages"></el-input>
          <el-button type="text" style="margin-left:20px" @click="deleteFirstDir(index)">删除一级</el-button>
          <!-- 二级目录 -->
            <el-form-item  v-for="(subItem, index1) in item.children" :key="index1">
              <el-input v-model="subItem.name" size="small" class="secondCatergory inline" placeholder="二级目录名"></el-input>
              <el-input v-model="subItem.page" size="small"  placeholder="页码" class="inline pages secondCatergory"></el-input>
              <el-button type="text" style="margin-left:20px" @click="deleteSecondDir(index,index1)">删除</el-button>
            </el-form-item>
          <el-button type="text" class="inline" @click="addSecond(index)">添加二级目录</el-button>
        </el-form-item>

      </el-form>
      <el-button class="add" @click="addFirst">新增一级目录</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDirectory">确 定</el-button>
        <el-button @click="catergoryDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style type="text/css">
  .inline {
    display: inline-block;
  }

  .pages {
    width: 50px!important;
    height: 36px;
    margin-left: 20px;
  }

  .add {
    position: relative;
    top: 77px;
  }

  .secondCatergory {
    position: relative;
    margin-top: 10px;
  }
</style>


<script>
import api from '@/api'
import UploadSingle from '@/components/util/UploadSingle'

const _ = require('lodash')

export default {
  data() {
    return {
      catergoryDialog: false,
      editing: false,
      book: { publicationDate: '' },
      uploadParams: {},
      value: '',
      directoryString: '',
      firstDir: {
        name: '',
        page: '',
        children: []
      },
      secondDir: {
        name: '',
        page: ''
      },
      directory: [{
        name: '',
        page: '',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
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
    // 获取数据
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/book/getBook?', { bookId: this.$route.params.id })
        if (code === 200) {
          this.book = data
          this.directory = this.book.directory
        }
      } else {
        this.editing = false
        this.book = { publicationDate: null, directory: [] }
      }
    },
    // 删除封面图片
    handleRemove(name) {
      if (name === 'cover') {
        this.book.coverUrl = null
        this.book.coverKey = null
      } else if (name === 'introduction') {
        this.book.introductionImgUrl = null
        this.book.introductionImgKey = null
      } else if (name === 'directory') {
        this.book.directoryUrl = null
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
        this.$set(this.book, 'directoryUrl', `${bucketPort}/${response.key}`)
        this.$set(this.book, 'directoryImgKey', response.key)
      }
    },
    handleDatePick(val) {
      this.book.publicationDate = val
    },
    async save() {
      if (!this.book.coverUrl || !this.book.introductionImgUrl || !this.book.directoryUrl || !this.book.name || !this.book.author || !this.book.publisher || !this.book.publicationDate || !this.book.introduction || !this.book.buyUrl || !this.book.douban) {
        this.$notify.error({ title: '错误', message: '表单信息不完整' })
        return false
      }
      if (typeof this.book.directory === 'object') {
        this.book.directory = JSON.stringify(this.book.directory)
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
    },
    addSecond(index) {
      this.directory[index].children.push(_.cloneDeep(this.secondDir))
    },
    addFirst() {
      this.directory.push(_.cloneDeep(this.firstDir))
    },
    deleteFirstDir(index) {
      this.$confirm('此操作将删除此一级栏目及其下所有二级栏目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.directory.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSecondDir(parentIndex, index) {
      this.directory[parentIndex].children.splice(index, 1)
    },
    editCatergory() {
      this.catergoryDialog = true
      this.directory = _.cloneDeep(this.book.directory)
    },
    saveDirectory() {
      this.catergoryDialog = false
      this.book.directory = _.cloneDeep(this.directory)
    }
  }
}
</script>
