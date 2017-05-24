<template>
  <div>
    <el-tabs value="first">
      <!-- 订单信息 -->
      <el-tab-pane label="订单信息" name="first">
        <el-form label-width="100px" style="width: 400px" label-position="left">
          <el-form-item label="订单编号">
            <span>E20170520140336085240367</span>
          </el-form-item>
          <el-form-item label="订单类型">
            <span>普通订单</span>
          </el-form-item>
          <el-form-item label="付款方式">
            <span>微信安全支付－代销</span>
          </el-form-item>
          <el-form-item label="买家">
            <span>18988836325</span>
          </el-form-item>
          <el-form-item label="配送方式">
            <span>快递配送</span>
          </el-form-item>
          <el-form-item label="收货信息">
            <span>广东省 广州市 海珠区 阅江东路(保利天悦旁) 保利叁悦广场, 林生, 13430321224</span>
          </el-form-item>
           <el-form-item label="买家留言">
            <span>-</span>
          </el-form-item>
<!--         
          <el-form-item label="结算状态">
            <el-tag v-if="orderObj.accountStatus === 1" type="gray">{{ orderObj.accountStatusDesc }}</el-tag>
            <el-tag v-if="orderObj.accountStatus === 2" type="danger">{{ orderObj.accountStatusDesc }}</el-tag>
          </el-form-item>
          <el-form-item label="结算备注">
            <span>{{ orderObj.accountRemark }}</span>
          </el-form-item>-->
        </el-form>
      </el-tab-pane>

      <!-- 车辆信息 -->
      <el-tab-pane label="订单状态" name="second">
        <el-form label-width="100px" style="width: 700px" label-position="left">
          <el-form-item label="订单状态：">
            <span>商家已发货，等待交易成功。</span><span>买家如在 7天内 没有申请退款，交易将自动完成；</span>
            <span>订单状态：买家已付款，等待商家发货。</span><span>买家已付款至有赞待结算账户，请尽快发货，否则买家有权申请退款。</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">修改物流</el-button>
            <el-button type="primary">延长收货</el-button>
            <el-button type="primary">发货</el-button>
            <el-button type="text" @click="">备注</el-button>
          </el-form-item>
         <el-form-item>
          <i class="el-icon-warning"></i>交易成功后，有赞将把货款结算至你的店铺账户余额，你可申请提现；
        <i class="el-icon-warning"></i>请及时关注你发出的包裹状态，确保能配送至买家手中；
          如果买家表示未收到货或者货物有问题，请及时联系买家积极处理，友好协商；
          <span @click.prevent="$router.push('/order/right')">查看退款维权</span>
         </el-form-item>
        </el-form>
      </el-tab-pane>

      <!--包裹-->
      <el-tab-pane label="包裹" name="third">
        <el-table :data="expresses" @selection-change="handleSelectionChange">
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="product" label="商品" min-width="100"></el-table-column>
          <el-table-column prop="price" label="价格（元）" min-width="100"></el-table-column>
          <el-table-column prop="number" label="数量" min-width="100"></el-table-column>
          <el-table-column  label="小计（元）" min-width="100">
            <template scope="scope">
              <span>{{ scope.row.total }}</span>
              <el-button>主动退款</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="receivePerson" label="状态" min-width="100"></el-table-column>
          <el-table-column label="快递" min-width="100">
            <template scope="scope">
              <el-button @click.prevent.native="expressDialog = true;">查看快递</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 时间轴 -->
      <el-tab-pane label="时间轴" name="fifth">
        <el-steps :space="200" :active="3">
          <el-step title="买家下单" description="2017-05-20 14:03:36"></el-step>
          <el-step title="买家付款" description="2017-05-20 14:03:49"></el-step>
          <el-step title="商家发货" description="2017-05-20 15:26:31"></el-step>
          <el-step title="交易完成"></el-step>
        </el-steps>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="物流" v-model="expressDialog">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="orderNum" label="时间" min-width="100"></el-table-column>
        <el-table-column prop="receivePerson" label="内容" min-width="100"></el-table-column>
        <el-table-column prop="orderNum" label="状态" min-width="100"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expresses: [
        {
          price: '20.00'
        }
      ],
      expressDialog: false,
      tableData: [{
        orderNum: '1'
      }],
      orderObj: {
        orderNum: '123456',
        payableAmount: 240.00,
        orderStatusDesc: '等待付款',
        createdAtDateTime: '2017-02-02 12:30',
        accountStatus: 1,
        accountStatusDesc: '未结算',
        accountRemark: '无备注',
        customer: {
          username: '李先森',
          phone: '138-0088-0088'
        },
        carNums: ['粤A88888', '粤A88889'],
        timelines: [
          { title: '用户提交订单', remark: '用户提交订单', createdAtDateTime: '2017-02-02 12:30' },
          { title: '商家报价', remark: '商家报价', createdAtDateTime: '2017-02-02 12:30' },
          { title: '用户付款', remark: '用户付款', createdAtDateTime: '2017-02-02 12:30' },
          { title: '用户申请退款', remark: '用户申请退款', createdAtDateTime: '2017-02-02 12:30' },
          { title: '商家同意退款申请', remark: '商家同意退款申请', createdAtDateTime: '2017-02-02 12:30' }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-step__line {
  color: #20a0ff;
}
.el-icon-warning {
  color: #07d;
}
</style>
