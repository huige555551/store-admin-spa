<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>评论管理</span>
      </el-form-item>
      <el-form-item :label="title">
        <span></span>
      </el-form-item>
    </el-form>

    <!-- 搜索 -->
    <el-form :inline="true" :model="searchInput">
      <el-form-item label="内容">
        <el-input v-model="searchInput.content" placeholder="内容"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="searchInput.date" type="date" @change="changeDate" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column label="头像" width="80">
        <template scope="scope">
          <img :src="scope.row.headImgUrl" width="48" height="48" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户" min-width="100"></el-table-column>
      <el-table-column prop="content" label="内容" min-width="140"></el-table-column>
      <el-table-column prop="publicationDate" label="时间" width="160"></el-table-column>
      <el-table-column label="操作" width="100">
        <template scope="scope">
          <el-button type="default" size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      total: null,
      title: null,
      currentPage: 1,
      searchKey: {
        date: null,
        content: null
      },
      searchInput: {
        date: null,
        content: null
      },
      tableData: []
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
    // 清空搜索
    emptySearch() {
      this.searchInput.content = null
      this.searchInput.date = null
      this.searchKey.content = null
      this.searchKey.date = null
      this.currentPage = 1
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchKey.content = this.searchInput.content
      this.searchKey.date = this.searchInput.date
      this.currentPage = 1
      this.fetchData()
    },
    changeDate(val) {
      this.searchInput.date = val
      console.log(val)
    },
    async fetchData() {
      if (this.$route.params.type === 'article') {
        this.title = '文章'
        const { code, data } = await api.get('/api/system/comment/listArticleComment?', { articleId: this.$route.params.id, currentPage: this.currentPage, content: this.searchKey.content, date: this.searchKey.date })
        if (code === 200) {
          this.tableData = data.array
          this.total = data.total
        }
      } else if (this.$route.params.type === 'video') {
        this.title = '视频'
        const { code, data } = await api.get('/api/system/comment/listVideoComment?', { videoId: this.$route.params.id, currentPage: this.currentPage, content: this.searchKey.content, date: this.searchKey.date })
        if (code === 200) {
          this.tableData = data.array
          this.total = data.total
        }
      } else {
        this.title = '活动'
        const { code, data } = await api.get('/api/system/comment/listArticleComment?', { videoId: this.$route.params.id, currentPage: this.currentPage, content: this.searchKey.content, date: this.searchKey.date })
        if (code === 200) {
          this.tableData = data.array
          this.total = data.total
        }
      }
    },
    // 删除评论
    async deleteRow(index) {
      this.$confirm('此操作将该删除该评论，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/comment/deleteArticleComment', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 分页
    handleSizeChange(val) {
      this.perPage = val
      this.currentPage = 1
      this.fetchData()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
</script>
