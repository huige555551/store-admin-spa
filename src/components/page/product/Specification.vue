<template>
  <div>
  <!-- TODO搜索功能未完成 -->
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>商品管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>规格列表</span>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column label="规格名称" min-width="100">
        <template scope="scope">
          <span>{{scope.row.name + '【' + scope.row.remark + '】'}}</span>
        </template>
      </el-table-column>
     <el-table-column prop="specification" label="显示方式" width="100">
       <template scope="scope">
        <span v-if="scope.row.displayType === 1">文字</span>
        <span v-if="scope.row.displayType === 2">图片</span>
       </template>
     </el-table-column>
     <el-table-column label="规格数据" width="400">
       <template scope="scope">
        <span v-for="item in scope.row.valueArray">
          {{'【' + item.value + '】'}}
        </span>
        
       </template>
     </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="$router.push('/product/specification/edit/'+scope.row.id)">编辑</el-button>
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
      tableData: [{
        name: '颜色',
        displayType: '图片',
        specification: '红色 紫色 绿色'
      }]
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
      const { code, data } = await api.get('/api/sku/layeredListByPaging')
      if (code === 200) {
        this.tableData = data.pagingData
        this.total = data.totalRecords
        this.currentPage = data.page
      }
      // const getNavigation = await api.get('/api/system/article/listNavigation')
      // if (getNavigation.code === 200) {
      //   this.column = getNavigation.data
      // }
      // const { code, data } = await api.get('/api/system/article/listArticle', {
      //   currentPage: this.currentPage,
      //   perPage: this.perPage,
      //   title: this.searchKey.title,
      //   period: this.searchKey.period,
      //   author: this.searchKey.author,
      //   navigationId: this.searchKey.column
      // })
      // if (code === 200) {
      //   this.tableData = data.array
      //   this.total = data.total
      //   this.currentPage = data.currentPage
      // }
    },
    // 删除行
    deleteRow(index) {
      console.log(this.tableData)
      this.$confirm('此操作将该删除该规格，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await api.post('/api/sku/deleteSku', { skuId: this.tableData[index].id })
        if (code === 200) {
          // this.tableData.splice(index, 1)
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
