<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>固定栏目</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>漫画列表</span>
      </el-form-item>
    </el-form>

    <!-- 搜索 -->
    <el-form :inline="true">
      <el-form-item label="标题">
        <el-input v-model="searchInput.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
            v-model="searchInput.date"
            format="yyyy-MM-dd"
            @change="handleDatePick"
            type="date"
            :clearable="false"
            placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="search">搜索</el-button>
        <el-button @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="publicationDate" label="日期" width="120"></el-table-column>
      <el-table-column prop="authorName" label="作者" min-width="60"></el-table-column>
      <el-table-column prop="period" label="期数" width="80"></el-table-column>
      <el-table-column label="封面" width="80">
        <template scope="scope">
          <img :src="scope.row.imgUrl" height="80" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="$router.push('/comics/edit/'+scope.row.id)">编辑</el-button>
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
        title: null,
        date: null
      },
      searchKey: {
        title: null,
        date: null
      },
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
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
      this.searchInput.date = null
      this.searchKey.title = null
      this.searchKey.date = null
      this.currentPage = 1
      this.fetchData()
    },
    // 日期更改
    handleDatePick(val) {
      this.searchInput.date = val
    },
    // 搜索
    search() {
      this.searchKey.title = this.searchInput.title
      this.searchKey.date = this.searchInput.date
      console.log(this.searchKey)
      this.currentPage = 1
      this.fetchData()
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/comicIllustration/getList', {
        currentPage: this.currentPage,
        perPage: this.perPage,
        title: this.searchKey.title,
        date: this.searchKey.date,
        type: 1
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
    deleteRow(index) {
      this.$confirm('此操作将该删除该漫画，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/comicIllustration/deleteComicIllustrations', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.fetchData()
        }
      }).catch(() => {})
    }
  }
}
</script>
