<template>
  <div>
  <!-- TODO搜索功能未完成 -->
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>订单管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>所有订单</span>
      </el-form-item>
    </el-form>

    <!-- 搜索 -->
    <el-form :inline="true">
      <el-form>
       <el-form-item label="订单号">
        <el-input placeholder="请输入订单号" v-model="searchInput.orderNo"></el-input>
       </el-form-item>
       <el-form-item label="下单时间">
          <el-date-picker v-model="searchInput.startTime" type="date" placeholder="选择开始日期" :picker-options="pickerOptions0"></el-date-picker>至
          <el-date-picker v-model="searchInput.endTime" type="date" placeholder="选择结束日期" :picker-options="pickerOptions0"></el-date-picker>
       </el-form-item>
       <el-form-item label="订单类型">
        <el-select  v-model="searchInput.orderType" filterable clearable placeholder="选择订单类型">
          <el-option :value="1" label="普通订单">普通订单</el-option>
          <el-option :value="2" label="维权订单">维权订单</el-option>
        </el-select>
       </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="支付状态">
          <el-select  v-model="searchInput.payStatus" filterable placeholder="选择支付状态">
            <el-option :value="1" label="已支付">已支付</el-option>
            <el-option :value="2" label="未支付">未支付</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select  v-model="searchInput.orderStatus" filterable placeholder="选择发货状态">
            <el-option :value="1" label="待支付">待支付</el-option>
            <el-option :value="2" label="待发货">待发货</el-option>
            <el-option :value="3" label="已收货">已收货</el-option>
            <el-option :value="4" label="已完成">已完成</el-option>
            <el-option :value="5" label="已关闭">已关闭</el-option>
            <el-option :value="6" label="退款中">退款中</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-select v-model="searchInput.deliveryWay" placeholder="选择物流方式">
              <el-option :value="1" label="快递发货">快递发货</el-option>
              <el-option :value="2" label="上门自提">上门自提</el-option>
              <el-option :value="3" label="货到付款">货到付款</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维权状态">
          <el-select v-model="searchInput.refundStatus" placeholder="选择维权状态">
            <el-option :value="1" label="退款处理中">退款处理中</el-option>
            <el-option :value="2" label="退款结束">退款结束</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="search">搜索</el-button>
          <el-button @click.native.prevent="emptySearch">清空</el-button>
        </el-form-item>
      </el-form>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" min-width="100"></el-table-column>
      <el-table-column prop="recipient" label="收货人" min-width="100"></el-table-column>
      <el-table-column label="支付状态" width="150">
        <template scope="scope">
          <el-tag type="gray">{{ scope.row.payStatus }}</el-tag>
          <el-button @click="deliverDialog = true">发货</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="consignStatus" label="发货状态" width="100"></el-table-column>
      <el-table-column prop="deliverytWay" label="配送方式" width="100"></el-table-column>
      <el-table-column prop="paymentWay" label="支付方式" width="200"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="createdAt" label="下单时间" min-width="200"></el-table-column>
      <el-table-column label="操作" width="250">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="orderDialog = true">查看详情</el-button>
          <!--<el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>-->
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
      rowObj: {
        orderNo: '111',
        orderType: 1,
        paymentWay: 1,
        shipmentWay: 1
      },
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
        orderNo: null,
        startTime: null,
        endTime: null,
        orderType: null,
        payStatus: null,
        orderStatus: null,
        deliveryWay: null,
        refundStatu: null
      },
      searchKey: {
        orderNo: null,
        startTime: null,
        endTime: null,
        orderType: null,
        payStatus: null,
        orderStatus: null,
        deliveryWay: null,
        refundStatu: null
      },
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
      // 预览
      previewDialog: false,
      previewObj: {},
      tableData: [{
        orderNo: '111',
        recipient: '刘继辉'
      }]
    }
  },
  created() {
    // this.fetchData()
  },
  // 组件复用，路由数据刷新
  /* eslint-disable */
  watch: {
    '$route'() {
      this.fetchData()
    }
  },
  /* eslint-enable */
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    // 清空搜索
    emptySearch() {
      this.searchKey.orderNo = null
      this.searchKey.startTime = null
      this.searchKey.endTime = null
      this.searchKey.orderType = null
      this.searchKey.payStatus = null
      this.searchKey.orderStatus = null
      this.searchKey.deliveryWay = null
      this.searchKey.refundStatu = null
      this.searchinput.orderNo = null
      this.searchinput.startTime = null
      this.searchinput.endTime = null
      this.searchinput.orderType = null
      this.searchinput.payStatus = null
      this.searchinput.orderStatus = null
      this.searchinput.deliveryWay = null
      this.searchinput.refundStatus = null
      this.currentPage = 1
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchKey.orderNo = this.searchKey.orderNo
      this.searchKey.startTime = this.searchKey.startTime
      this.searchKey.endTime = this.searchKey.endTime
      this.searchKey.orderType = this.searchKey.orderType
      this.searchKey.payStatus = this.searchKey.payStatus
      this.searchKey.orderStatus = this.searchKey.orderStatus
      this.searchKey.deliveryWay = this.searchKey.deliveryWay
      this.searchKey.refundStatus = this.searchKey.refundStatus
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
      const { code, data } = await api.get('/api/order/listByPaging', {
        orderNo: this.searchKey.orderNo,
        startTime: this.searchKey.startTime,
        endTime: this.searchKey.endTime,
        orderType: this.searchKey.orderType,
        payStatus: this.searchKey.payStatus,
        orderStatus: this.searchKey.orderStatus,
        deliveryWay: this.searchKey.deliveryWay,
        refundStatus: this.searchKey.refundStatus
      })
      if (code === 200) {
        this.tableData = data.pagingData
        this.total = data.totalPages
        this.currentPage = data.page
      }
      if (this.$route.query.type) {
        this.searchInput.orderType = parseInt(this.$route.query.type, 10)
      } else {
        this.searchInput.orderType = ''
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
