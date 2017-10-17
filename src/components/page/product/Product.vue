<template>
  <div>
  <!-- TODO搜索功能未完成 -->
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>商品管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>商品列表</span>
      </el-form-item>
    </el-form>

    <!-- 搜索 -->
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="searchInput.name" placeholder="请输入名称"></el-input>
      </el-form-item>
     <el-form-item label="上/下架">
        <el-select  v-model="searchInput.onSale" clearable filterable placeholder="请选择上下架">
          <el-option v-for="(item, index) in optionBatch" :label="item.name" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存">
        <el-select  v-model="searchInput.stock" clearable filterable placeholder="清选择库存">
          <el-option v-for="(item, index) in optionStock" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select  v-model="searchInput.itemRecommendType" clearable filterable placeholder="请选择商品标签">
          <el-option v-for="(item, index) in optionStatus" :label="item.name" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="search">搜索</el-button>
        <el-button @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="100"></el-table-column>
      <el-table-column label="商品" width="200">
        <template scope="scope">
          <img class="articleImg" :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.coverUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="80"></el-table-column>
      <el-table-column prop="sales" label="总销量" min-width="90"></el-table-column>
      <el-table-column prop="create_at" label="创建时间" min-width="150"></el-table-column>
      <el-table-column prop="order" label="序号" width="160"></el-table-column>
      <el-table-column  label="上/下架" width="160">
        <template scope="scope">
          <el-tag type="success" v-if="scope.row.onSale">上架</el-tag>
          <el-tag v-if="!scope.row.onSale">下架</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="状态" width="160">
        <template scope="scope">
          <el-tag>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button v-if="$isAllowUser('商品修改')" size="small" @click.native.prevent="$router.push('/product/edit/'+scope.row._id)">编辑</el-button>
          <el-button v-if="$isAllowUser('商品删除')" size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
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
import moment from 'moment'

export default {
  data() {
    return {
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
        name: '最新商品',
        value: 1
      },
      {
        name: '特价商品',
        value: 2
      },
      {
        name: '热卖商品',
        value: 3
      },
      {
        name: '推荐商品',
        value: 4
      }],
      optionBatch: [{
        name: '上架',
        value: true
      },
      {
        name: '下架',
        value: false
      }],
      column: [],
      // 搜索
      searchInput: {
        name: '',
        stock: '',
        onSale: '',
        itemRecommendType: ''
      },
      searchKey: {
        name: '',
        stock: '',
        onSale: '',
        itemRecommendType: ''
      },
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
      // 预览
      tableData: [{
        productImg: 'https://img.yzcdn.cn/upload_files/2015/05/14/Fh1ZR74CpUm0s85svgQuU-MQ3oQd.png?imageView2/2/w/120/h/0/q/75/format/webp',
        name: '衣服',
        stock: '100',
        totalSales: '100',
        price: '¥100',
        createdTime: '2017-05-10',
        orderNum: '100',
        id: '1',
        batchOnload: true,
        status: '已售罄'
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
      this.searchInput.name = null
      this.searchInput.onSale = null
      this.searchInput.stock = null
      this.searchInput.itemRecommendType = null
      this.searchKey.name = null
      this.searchKey.onSale = null
      this.searchKey.stock = null
      this.searchKey.itemRecommendType = null
      this.currentPage = 1
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchKey.name = this.searchInput.name
      this.searchKey.onSale = this.searchInput.onSale
      this.searchKey.stock = this.searchInput.stock
      this.searchKey.itemRecommendType = this.searchInput.itemRecommendType
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
      const { code, data } = await api.get('/api/product/list', {
        page: this.currentPage,
        perPage: this.perPage,
        name: this.searchKey.name,
        onSale: this.searchKey.onSale,
        stock: this.searchKey.stock,
        itemRecommendType: this.searchKey.itemRecommendType
      })
      if (code === 200) {
        for (let i = 0, len = data.pagingData.length; i < len; i += 1) {
          data.pagingData[i].create_at = moment(data.pagingData[i].create_at).format('YYYY/MM/DD HH:MM:SS')
        }
        this.tableData = data.pagingData
        this.total = data.total
        this.currentPage = data.page
      }
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该商品，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/item/delete', { itemId: this.tableData[index].id })
        if (code === 200) {
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
