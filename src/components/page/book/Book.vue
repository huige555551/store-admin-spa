<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>图书管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>图书列表</span>
        </el-form-item>
    </el-form>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchInput.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="publisher" label="出版社" min-width="100"></el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="author" label="作者" width="120"></el-table-column>
      <el-table-column prop="publicationDate" label="出版时间" width="120"></el-table-column>
      <el-table-column label="封面" width="120">
        <template scope="scope">
          <img :src="scope.row.coverUrl" height="80" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="预览" width="80">
        <template scope="scope">
          <el-button type="default" @click.native.prevent = "checkBook(scope.$index)" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="发布时间" width="120"></el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="default" size="small" @click.native.prevent="$router.push('/book/edit/'+scope.row.id)">编辑</el-button>
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
        :total=total>
      </el-pagination>
    </div>

    <!--BookDialog -->
    <el-dialog title="图书信息" v-model="bookDialog">
      <el-form label-width="80px">
        <el-form-item label="封面">
          <img style="max-width:150px; max-height:200px" :src=dialogObj.coverUrl>
        </el-form-item>
        <el-form-item label="标题">
          <span>{{ dialogObj.name }}</span>
        </el-form-item>
        <el-form-item label="作者">
          <span>{{ dialogObj.author }}</span>
        </el-form-item>
        <el-form-item label="出版社">
          <span>{{ dialogObj.publisher }}</span>
        </el-form-item>
        <el-form-item label="价格">
          <span>{{ dialogObj.price }}</span>
        </el-form-item>
        <el-form-item label="出版时间">
          <span>{{ dialogObj.name }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      total: 0,
      searchKey: {
        title: ''
      },
      searchInput: {
        title: ''
      },
      dialogObj: [],
      bookDialog: false,
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/book/listBook', {
        currentPage: this.currentPage,
        perPage: this.perPage,
        title: this.searchKey.title
      })
      if (code === 200) {
        this.tableData = data.array
        this.total = data.total
      }
    },
    search() {
      this.searchKey.title = this.searchInput.title
      console.log(this.searchKey)
      this.fetchData()
    },
    emptySearch() {
      this.searchInput.title = null
      this.searchKey.title = null
      this.currentPage = 1
      this.tableData = []
      this.fetchData()
    },
    // 查看图书详情
    checkBook(index) {
      this.bookDialog = true
      this.dialogObj = this.tableData[index]
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该图书，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/book/deleteBook', { bookId: this.tableData[index].id })
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

<style>
.plugins-tips .el-form-item {
  margin-bottom: 0px;
}
</style>
