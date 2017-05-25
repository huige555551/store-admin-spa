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
    
    <div class="app-inner clearfix">
      <div class="demo-block demo-box timelines">
        <div class="source">
          <el-steps :space="200" :active="3">
            <el-step title="买家下单" description="2017-05-20 14:03:36"></el-step>
            <el-step title="买家付款" description="2017-05-20 14:03:49"></el-step>
            <el-step title="商家发货" description="2017-05-20 15:26:31"></el-step>
            <el-step title="交易完成"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="demo-block demo-box clearfix content-region">
        <div class="source info-region">
          <h4>售后维权</h4>
          <el-form ref="form" label-width="100px" style="width: 400px" label-position="left">
            <el-form-item label="期望结果">仅退款</el-form-item>
            <el-form-item label="退款金额">	0.02 元 (含运费0.00元）</el-form-item>
            <el-form-item label="维权原因">假货</el-form-item>
            <el-form-item label="维权编号">W1705241742463260</el-form-item>
            <el-form-item label="订单编号">E20170524174122085227790</el-form-item>
            <div class="dash-line"></div>
            <el-form-item label="付款时间">2017-05-24 17:41:31</el-form-item>
            <el-form-item label="物流信息">物流信息  查看</el-form-item>
            <el-form-item label="买 家">18988836325</el-form-item>
            <el-form-item label="合计优惠">0.00 元</el-form-item>
            <el-form-item label="实收总计">0.02 元</el-form-item>
          </el-form>
        </div>
        <div class="source state-region">
          <div style="padding: 0px 0px 30px 40px;">
            <h3 class="state-title">
              <span class="icon info">!</span>
            等待商家处理退款申请
            </h3>
            <div class="state-desc">
              <div>
                <div><!-- react-text: 94 -->收到买家仅退款申请，请尽快处理。<!-- /react-text -->
                  <p><!-- react-text: 96 -->请在<!-- /react-text -->
                  <span class="color-orange">
                    <em>6天2小时49分钟48秒</em>
                  </span><!-- react-text: 99 -->处理本次退款，如逾期未处理，将自动同意退款。<!-- /react-text -->
                  </p>
                </div>
              </div>
            </div>
            <div class="state-action">
              <el-button class="zent-btn zent-btn-primary">同意买家退款</el-button>
              <el-button class="zent-btn">拒绝退款申请</el-button>
            </div>
            <div class="state-remind-region">
              <div class="dashed-line"></div>
              <div class="state-remind">
                <h4>提醒：</h4>
                <ul>
                  <li>如果你同意，将直接退款给买家。</li>
                  <li>如果你拒绝，买家可以要求有赞介入处理。</li>
                  <li>如果你逾期未处理，视作同意买家申请，系统将自动退款给买家。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="safeguard-log">
        <div class="demo-block demo-box clearfix content-region">
          <div class="source">
            <h2>协商记录</h2>
            <span>买家 </span><span>2017-05-24 17:42:46</span>
            <el-form ref="form" label-width="100px" style="width: 400px" label-position="left">
              <div class="dash-line"></div>
              <div>发起了退款申请,等待商家处理</div>
              <el-form-item label="退款原因">假货</el-form-item>
              <el-form-item label="处理方式">仅退款</el-form-item>
              <el-form-item label="货物状态">已收到货</el-form-item>
              <el-form-item label="退款金额">0.02</el-form-item>
              <el-form-item label="退款说明">454</el-form-item>
              <el-form-item label="联系电话">15989066480</el-form-item>
            </el-form>
          </div>
        </div>
      </div>
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
.timelines {
  text-align: center;
}
.clearfix:after {
  content: "";
  clear: both;
  display: block;
  height: 0;
}
.info-region, .state-region {
  float: left;
}
.info-region {
  border-right: 1px solid #eaeefb;
  width: 400px;
}
.content-region {
  color: #48576a;
}
.state-region {
  width: 400px;
}
.app-inner {
  margin: 10px;
  padding: 15px;
  min-width: 750px;
  min-height: 500px;
  -webkit-box-shadow: 0 0 1px 0 rgba(0,0,0,0.2);
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.2);
}
.dash-line {
  border-top: 1px dashed #e5e5e5;
}
</style>
