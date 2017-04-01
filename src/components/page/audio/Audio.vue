<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>音频管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>音频列表</span>
      </el-form-item>
    </el-form>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchInput.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="栏目">
        <el-select v-model="searchInput.navigationId" filterable remote
            placeholder="请输入栏目进行搜索">
            <el-option
              v-for="item in columnResults"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="search">搜索</el-button>
        <el-button  @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="navigationName" label="分类" width="100"></el-table-column>
      <el-table-column prop="time" label="时长" width="120"></el-table-column>
      <el-table-column label="封面" width="200">
        <template scope="scope">
          <img :src="scope.row.coverUrl" width="200" max-height="200" @click="openImg(scope.row.coverUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="publicationDate" label="时间" width="200"></el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="default" size="small" @click.native.prevent="$router.push('/audio/edit/'+scope.row.id)">编辑</el-button>
          <el-button type="default" size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
      columnResults: [],
      searchInput: {
        id: 1,
        title: null,
        navigationId: null
      },
      searchKey: {
        id: null,
        title: null,
        navigationId: null
      },
      // 分页
      currentPage: 1,
      total: 0,
      perPage: 10,
      // 表格
      tableData: []
    }
  },
  async created() {
    this.fetchData()
    // 拿回所有栏目
    const { code, data } = await api.get('/api/system/audio/listNavigation')
    if (code === 200) {
      this.columnResults = data
    }
  },
  methods: {
    openImg(url) {
      window.open(url)
    },
    search() {
      this.searchKey.title = this.searchInput.title
      this.searchKey.navigationId = this.searchInput.navigationId
      this.fetchData()
    },
    emptySearch() {
      this.searchInput.title = null
      this.searchInput.navigationId = null
      this.searchKey.title = null
      this.searchKey.navigationId = null
      this.currentPage = 1
      this.tableData = []
      this.fetchData()
    },
    // async searchColumn(val) {
    //   const { code, data } = await api.get('/api/system/audio/listNavigation', { name: val })
    //   if (code === 200) {
    //     this.columnResults = data
    //     if (this.columnResults.length > 10) {
    //       this.columnResults.length = 10
    //     }
    //   }
    // },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/audio/searchAudio', {
        currentPage: this.currentPage,
        perPage: this.perPage,
        title: this.searchKey.title,
        navigationId: this.searchKey.navigationId
      })
      if (code === 200) {
        this.tableData = data.array
        this.total = data.total
      }
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该音频，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/audio/deleteAudio', { id: this.tableData[index].id })
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
