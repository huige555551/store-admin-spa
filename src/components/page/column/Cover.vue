<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>固定栏目</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>封面列表</span>
      </el-form-item>
    </el-form>

    <!-- 搜索 -->
    <el-form :inline="true">
      <el-form-item label="年份">
        <el-input v-model="searchInput.year" placeholder="年份"></el-input>
      </el-form-item>
      <el-form-item label="期号">
        <el-input v-model="searchInput.period" placeholder="期号"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="searchInput.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="search">搜索</el-button>
        <el-button @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="period" label="期号" width="80"></el-table-column>
      <el-table-column prop="publicationDate" label="日期" width="120"></el-table-column>
      <el-table-column label="封面" width="80">
        <template scope="scope">
          <img :src="scope.row.coverUrl + '?imageView2/2/w/80'" height="80" @click="openImg(scope.row.coverUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="$router.push('/cover/edit/'+scope.row.id)">编辑</el-button>
          <el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
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
        :page-size="perPage"
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
      // 搜索
      searchInput: {
        year: null,
        period: null,
        title: null
      },
      searchKey: {
        year: null,
        period: null,
        title: null
      },
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
      // 表格
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
      this.searchInput.title = null
      this.searchInput.period = null
      this.searchInput.year = null
      this.searchKey.title = null
      this.searchKey.period = null
      this.searchKey.year = null
      this.currentPage = 1
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchKey.title = this.searchInput.title
      this.searchKey.period = this.searchInput.period
      this.searchKey.year = this.searchInput.year
      this.currentPage = 1
      this.fetchData()
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/cover/searchCover', {
        currentPage: this.currentPage,
        perPage: this.perPage,
        title: this.searchKey.title,
        period: this.searchKey.period,
        year: this.searchKey.year
      })
      if (code === 200) {
        this.tableData = data.array
        this.total = data.total
      }
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
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该封面，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/cover/deleteCover', { coverId: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.fetchData()
        }
      }).catch(() => {})
    }
  }
}
</script>
