<template>
  <div class="">
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>商品管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>运费管理</span>
      </el-form-item>
    </el-form>

    <!-- 创建规格 -->
    <div class="form-box">
       <el-form label-width="140px" style="width: 400px" label-position="left">
      <el-form-item label="邮费策略">
        <span>免邮</span>
      </el-form-item>
        <el-button type="primary" @click.native.prevent="edit">修改</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="邮费设置" v-model="formDialog">
      <!--运费-->
      <el-form>
        <el-form-item>
          <el-radio v-model="product.deliveryFeeStrategy" :label="1">
            <span>包邮</span>
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="product.deliveryFeeStrategy" :label="2">
            <span>每单固定收取运费：</span>
            <el-input style="width: 100px;" v-model="feePerOrder2" type="number"></el-input> 元
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="product.deliveryFeeStrategy" :label="3">
            <span>订单每消费满 </span><el-input style="width: 100px;" v-model="threshold3" type="number"></el-input><span> 元免运费，未达到条件每订单收取 </span><el-input style="width: 100px;" v-model="feePerOrder3" type="number"></el-input><span> 元运费</span>
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="product.deliveryFeeStrategy" :label="4">
            <span>每订单购满 <el-input style="width: 100px;" v-model="threshold4" type="number"></el-input> 件商品免运费，未达到条件每订单收取 <el-input style="width: 100px;" v-model="feePerOrder4" type="number"></el-input> 元运费</span>
          </el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="save">保 存</el-button>
        <el-button @click.native.prevent="formDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      formDialog: false,
      product: {
        deliveryFeeStrategy: 1
      },
      freeExpress: 'true'
    }
  },
  async created() {
    this.fetchData()
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
    // 编辑邮费
    edit() {
      this.formDialog = true
       // 将feePerOrder和threshold取出
      switch (this.product.deliveryFeeStrategy) {
      case 2:
        this.product.feePerOrder = this.feePerOrder2
        break
      case 3:
        this.product.threshold = this.threshold3
        this.product.feePerOrder = this.feePerOrder3
        break
      case 4:
        this.product.threshold = this.threshold4
        this.product.feePerOrder = this.feePerOrder4
        break
      default:
        console.log('免邮')
      }
    },
    async fetchData() {
      const { code, data } = await api.get('/api/deliveryFeeStrategy/getGlobalStrategyText')
      if (code === 200) {
        this.product = data
      }
    }
  }
}
</script>
<style lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .simditor-body {
    max-height: 600px;
    overflow: scroll;
  }

  .simditor-body img {
    display: block;
    width: 100%!important;
    height: auto;
  }

  .simditor-body h1 {
    font-size: 22px;
  }

  .simditor-body h2 {
    font-size: 20px;
  }

  .simditor-body h3 {
    font-size: 18px
  }

   .el-select-dropdown__wrap {
    max-height: 180px;
  }
  .el-form .category-item {
    margin-bottom: 22px;
    .el-button {
      margin-bottom: 22px;
      display: block;
    }
  }
  .el-form-item .el-form-item {
    margin-bottom: 22px;
  }
  .productType {
    .el-radio {
      margin-left: 0;
      margin-right: 20px;
    }
  }
  .avatar-uploader {
    margin-top: 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
