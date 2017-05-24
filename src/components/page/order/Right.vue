<template>
  <div>
  <!-- TODO搜索功能未完成 -->
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>订单管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>维权信息</span>
      </el-form-item>
    </el-form>

    
    <!-- 表格 -->
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="orderNum" label="订单号" min-width="100"></el-table-column>
      <el-table-column prop="receivePerson" label="收货人" min-width="100"></el-table-column>
      <el-table-column class="payStatus" label="支付状态" width="150">
        <template scope="scope">
          <el-tag type="gray">{{ scope.row.payStatus }}</el-tag>
          <el-button @click="deliverDialog = true">发货</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="deliverStatus" label="发货状态" width="100"></el-table-column>
      <el-table-column prop="distribution" label="配送方式" width="100"></el-table-column>
      <el-table-column prop="payType" label="支付方式" width="200"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" min-width="200"></el-table-column>
      <el-table-column label="操作" width="250">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="$router.push('/order/' + scope.row.id)">查看详情</el-button>
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
    <!--发货-->
    <el-dialog title="发货" v-model="deliverDialog">
      <el-table :data="deliverData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品" min-width="100" prop="product"></el-table-column>
        <el-table-column label="数量" width="100" prop="product"></el-table-column>
        <el-table-column label="物流" width="100" prop="product"></el-table-column>
        <el-table-column label="单号" width="100" prop="product"></el-table-column>
        <el-table-column label="状态" width="100" prop="product"></el-table-column>
      </el-table>
      <el-form>
        <el-form-item label="发货方式：">
          <el-radio>物流发货</el-radio>
          <el-radio>无需物流</el-radio>
        </el-form-item>
        <el-form-item label="物流公司：">
          <el-select>
            <el-option>
              申通
            </el-option>
            <el-option>
              顺丰
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号：">
          <el-input></el-input>
        </el-form-item>
        <span>*请仔细填写物流公司及快递单号，发货后24小时内仅支持做一次更正，逾期不可修改</span>
        <el-form-item label="收货信息：广东省 广州市 海珠区 阅江东路(保利天悦旁) 保利叁悦广场, 林生, 13430321224">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRow">确 定</el-button>
        <el-button @click="formDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 订单详情 -->
    <el-dialog title="订单详情" v-model="orderDialog" size="large" top="5%">
      <keep-alive>
        <OrderDetail :orderObj="rowObj"></OrderDetail>
      </keep-alive>
    </el-dialog>
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
import OrderDetail from './OrderDetail'

export default {
  components: {
    OrderDetail
  },
  data() {
    return {
      orderDialog: false,
      rowObj: {},
      deliverData: [
        {
          product: '衣服'
        }
      ],
      deliverDialog: false,
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
        productImg: 'https://img.yzcdn.cn/upload_files/2015/05/14/Fh1ZR74CpUm0s85svgQuU-MQ3oQd.png?imageView2/2/w/120/h/0/q/75/format/webp',
        username: '日森',
        stock: '100',
        totalSales: '100',
        price: '¥100',
        createdTime: '2017-05-10',
        orderNum: '100',
        id: '1',
        batchOnload: true,
        receivePerson: '刘继辉',
        status: '已售罄',
        orderTime: '2017-05-19 15:45:50',
        deliverStatus: '已发货',
        payType: '微信公众账号支付',
        distribution: '快递',
        payStatus: '等待商家发货'
      }]
    }
  },
  created() {
    // this.fetchData()
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
      const getNavigation = await api.get('/api/system/article/listNavigation')
      if (getNavigation.code === 200) {
        this.column = getNavigation.data
      }
      const { code, data } = await api.get('/api/system/article/listArticle', {
        currentPage: this.currentPage,
        perPage: this.perPage,
        title: this.searchKey.title,
        period: this.searchKey.period,
        author: this.searchKey.author,
        navigationId: this.searchKey.column
      })
      if (code === 200) {
        this.tableData = data.array
        this.total = data.total
        this.currentPage = data.currentPage
      }
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该文章，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/article/deleteArticle', { articleId: this.tableData[index].id })
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
<style lang="scss" scoped>
.demo-box {
  margin-bottom: 24px;
}
.demo-block {
  border: 1px solid #eaeefb;
  border-radius: 4px;
  transition: .2s;
}
.demo-block .source {
  padding: 24px;
}
.payStatus el-button {
  margin-top: 10px;
}
</style>
