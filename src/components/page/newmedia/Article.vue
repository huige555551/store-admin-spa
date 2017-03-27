<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchKey.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="searchKey.author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item label="栏目">
        <el-select v-model="searchKey" filterable placeholder="请输入栏目进行搜索">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="navigationName" label="栏目" width="100"></el-table-column>
      <el-table-column prop="author" label="作者" width="100"></el-table-column>
      <el-table-column prop="publicationDate" label="时间" width="160"></el-table-column>
      <el-table-column label="封面" width="200">
        <template scope="scope">
          <img :src="scope.row.coverUrl" width="200" max-height="200" @click="openImg(scope.row.coverUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="预览" width="80">
        <template scope="scope">
          <el-button type="default" @click.native.prevent = "articleDialog = true" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="评论管理" width="120">
        <template scope="scope">
          <el-button type="default" size="small">评论管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="default" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button type="default" size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>

    <!-- 预览dialog -->
    <el-dialog title="文章信息" v-model="articleDialog">
      <el-form :model="rowObj" label-width="80px">
        <el-form-item label="封面">
          <img src="http://om4r3bojb.bkt.clouddn.com/index-banner.jpg" style="max-width: 200px; max-height: 200px">
        </el-form-item>
        <el-form-item label="标题">
          <span>{{rowObj.title}}</span>
        </el-form-item>
        <el-form-item label="栏目">
          <span>{{rowObj.navigationName}}</span>
        </el-form-item>
        <el-form-item label="期数">
          <span>{{rowObj.period}}</span>
        </el-form-item>
        <el-form-item label="作者">
          <span>{{rowObj.author}}</span>
        </el-form-item>
        <el-form-item label="发布时间">
          <span>{{rowObj.publicationDate}}</span>
        </el-form-item>
        <el-form-item label="内容">
          <p v-html="content"></p>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'

const _ = require('lodash')

export default {
  data() {
    return {
      articleDialog: false,
      content: '<p>123456</p><p>123456</p>',
      editing: false,
      editingIndex: null,
      // { id: 1, title: '这是标题1', coverUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', navigationName: '栏目', author: '新周刊', period: '480', publicationDate: '2017-02-02 12:30' },
      tableData: [],
      rowObj: {
        id: null,
        title: null,
        coverUrl: null,
        navigationName: null,
        author: null,
        period: null,
        publicationDate: null
      },
      options: [
        { id: '1', value: '选项1', label: '选项1' },
        { id: '2', value: '选项2', label: '选项2' },
        { id: '3', value: '选项3', label: '选项3' },
        { id: '4', value: '选项4', label: '选项4' },
        { id: '5', value: '选项5', label: '选项5' }
      ],
      // 搜索
      searchInput: {
        title: null,
        author: null,
        column: null
      },
      searchKey: {
        title: null,
        author: null,
        column: null
      },
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    emptySearch() {
      this.searchInput.title = null
      this.searchInput.author = null
      this.searchInput.column = null
      this.searchKey.title = null
      this.searchKey.author = null
      this.searchKey.column = null
      this.currentPage = 1
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchKey.title = this.searchInput.title
      this.searchKey.author = this.searchInput.author
      this.searchKey.column = this.searchInput.column
      this.currentPage = 1
      this.fetchData()
    },
    // 获取文章列表数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/wechat/listArticle', { currentPage: this.currentPage, perPage: this.perPage })
      if (code === 200) {
        this.tableData = data.array
        this.total = data.total
      }
    },
    // 编辑行
    editRow(index) {
      console.log(this.tableData[index])
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.title = this.tableData[index].title
      this.rowObj.author = this.tableData[index].author
      this.rowObj.navigationName = this.tableData[index].navigationName
      this.rowObj.period = this.tableData[index].period
      this.rowObj.publicationDate = this.tableData[index].publicationDate
      this.articleDialog = true
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该分类数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/wechat/deleteNavigation', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (this.editing) {
        const { code } = await api.post('/api/system/wechat/updateNavigation', this.newColumn)
        if (code === 200) {
          this.tableData.splice(this.this.editingIndex, 1, this.newColumn)
          this.tableData.splice(this.this.editingIndex, 1, _.clone(this.newColumn))
          this.dialogFormVisible = false
        }
      } else {
        const { code } = await api.post('/api/system/wechat/addNavigation', this.newColumn)
        if (code === 200) {
          this.fetchData()
          this.dialogFormVisible = false
        }
      }
    }
  }
}
</script>
