<template>
  <div>
  <!-- TODO搜索功能未完成 -->
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>地址管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>发货地址列表</span>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="发货点名称" min-width="100"></el-table-column>
      <el-table-column prop="address" label="地址" width="200">
        <template scope="scope">
          {{`${scope.row.province},${scope.row.city},${scope.row.area},${scope.row.detailArea}`}}
        </template>
      </el-table-column>
     <el-table-column prop="zipCode" label="邮编" width="100"></el-table-column>
      <el-table-column prop="phone" label="电话" width="200"></el-table-column>
      <el-table-column prop="username" label="发货人" min-width="90"></el-table-column>
      <el-table-column prop="defaultUse" label="默认" min-width="150">
        <template scope="scope">
          <span v-if="scope.row.defaultUse">是</span>
          <span v-if="!scope.row.defaultUse">否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button size="small" v-if="$isAllowUser('地址修改')" @click.native.prevent="$router.push('/address/edit/'+scope.row._id)">编辑</el-button>
          <el-button size="small" v-if="$isAllowUser('地址删除')" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
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

    <!-- 预览 -->
    <el-dialog title="文章信息" v-model="previewDialog">
      <el-form label-width="100px">
        <el-form-item label="封面">
          <img :src="previewObj.coverUrl" style="max-width: 200px; max-height: 200px">
        </el-form-item>
        <el-form-item label="标题">
          <span>{{previewObj.title}}</span>
        </el-form-item>
        <el-form-item label="栏目">
          <span>{{previewObj.navigationName}}</span>
        </el-form-item>
        <el-form-item label="期数">
          <span>{{previewObj.period}}</span>
        </el-form-item>
        <el-form-item label="作者">
          <span>{{previewObj.author}}</span>
        </el-form-item>
        <el-form-item label="第二作者">
          <span>{{previewObj.secondAuthor}}</span>
        </el-form-item>
        <el-form-item label="发布时间">
          <span>{{previewObj.publicationDate}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style type="text/css">
  .articleImg {
    display: inline-block;
    width: 200px;
    height: 100px;
  }
</style>

<script>
import api from '@/api'

export default {
  data() {
    return {
      stock: '',
      optionStock: [{
        name: '无货',
        id: 0
      },
      {
        name: '低于10',
        id: 1
      },
      {
        name: '10-100',
        id: 2
      },
      {
        name: '100以上',
        id: 3
      }],
      optionStatus: [{
        name: '已售罄',
        id: 0
      },
      {
        name: '在仓库',
        id: 1
      },
      {
        name: '出售中',
        id: 2
      }],
      optionBatch: [{
        name: '上架',
        id: 0
      },
      {
        name: '下架',
        id: 1
      }],
      column: [],
      // 搜索
      searchInput: {
        stock: '',
        name: '',
        batch: '',
        status: ''
      },
      searchKey: {
        stock: null,
        title: null,
        period: null,
        author: null,
        column: null
      },
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
      // 预览
      previewDialog: false,
      previewObj: {},
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
      this.searchInput.author = null
      this.searchKey.title = null
      this.searchKey.period = null
      this.searchKey.author = null
      this.currentPage = 1
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchKey.title = this.searchInput.title
      this.searchKey.period = this.searchInput.period
      this.searchKey.author = this.searchInput.author
      this.searchKey.column = this.searchInput.column
      this.currentPage = 1
      this.fetchData()
    },
    // 预览
    preview(index) {
      this.previewObj = this.tableData[index]
      this.previewDialog = true
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/address/list', { page: this.currentPage, perPage: this.perPage })
      if (code === 200) {
        this.tableData = data.pagingData
        this.total = data.totalRecords
        this.currentPage = data.page
      }
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该地址，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.delete(`/api/address/delete/${this.tableData[index]._id}`)
        if (code === 204) {
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
