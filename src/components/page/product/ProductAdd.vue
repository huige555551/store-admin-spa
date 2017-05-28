<template>
  <div class="">
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>商品管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加商品</span>
      </el-form-item>
    </el-form>

    <!-- 创建商品 -->
    <div class="form-box">
      <el-form ref="form" label-width="100px" label-position="left">
        <el-form-item label="商品名称" style="width: 400px;">
          <el-input v-model="product.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
         <el-tree
          :data="classifyList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio class="radio" v-model="product.onSale" :label="true">是</el-radio>
          <el-radio class="radio" v-model="product.onSale" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="运费" >
            <!--<el-radio class="radio" v-model="product.freeDelivery" :label="true">是</el-radio>
            <el-radio class="radio" v-model="product.freeDelivery" :label="false">否</el-radio>-->
            <!--<el-form v-if="!product.freeDelivery">-->
            <el-form>
              <el-form-item>
                <el-radio v-model="product.deliveryFeeStrategy" :label="1">
                  <span>包邮</span>
                </el-radio>
              </el-form-item>
              <el-form-item>
                <el-radio v-model="product.deliveryFeeStrategy" :label="1">
                  <span>每单固定收取运费：</span>
                  <el-input style="width: 100px;" v-model="fixedFeePerOrder" type="number"></el-input>元
                </el-radio>
              </el-form-item>
              <el-form-item>
                <el-radio v-model="product.deliveryFeeStrategy" :label="2">
                  <span>订单每消费满</span><el-input style="width: 100px;" v-model="freeOnPriceThreshold" type="number"></el-input><span>元免运费，未达到条件每订单收取</span><el-input style="width: 100px;" v-model="freeOnPriceFeePerOrder" type="number"></el-input><span>元运费</span>
                </el-radio>
              </el-form-item>
              <el-form-item>
                <el-radio v-model="product.deliveryFeeStrategy" :label="3">
                  <span>每订单购满<el-input style="width: 100px;" v-model="freeOnCountThreshold" type="number"></el-input>件商品免运费，未达到条件每订单收取<el-input style="width: 100px;" v-model="freeOnCountFeePerOrder" type="number"></el-input>元运费：</span>
                </el-radio>
              </el-form-item>
            </el-form>
        </el-form-item>
         <el-form-item label="商品推荐类型">
            <el-checkbox class="radio" v-model="product.itemRecommendType" :label="1">最新商品</el-checkbox>
            <el-checkbox class="radio" v-model="product.itemRecommendType" :label="2">特价商品</el-checkbox>
            <el-checkbox class="radio" v-model="product.itemRecommendType" :label="3">热卖商品</el-checkbox>
            <el-checkbox class="radio" v-model="product.itemRecommendType" :label="4">推荐商品</el-checkbox>
        </el-form-item>
        <el-form-item label="商品库存">
         <el-table :data="itemSkus">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="款式" min-width="100">
            </el-table-column>
            <el-table-column prop="name" label="尺码" min-width="100"></el-table-column>
            <el-table-column label="价格" min-width="100">
              <template scope="scope">
                <el-input v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="库存" min-width="100">
              <template scope="scope">
                <el-input v-model="scope.row.stock"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="商品货号" min-width="100">
               <template scope="scope">
                <el-input v-model="scope.row.itemNo"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template scope="scope">
                <el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!--商品规格-->
        <el-form-item label="商品规格">
          <el-form>
            <el-button @click.prevent="addSpecificationItems" class="addSpecificationBtn">添加规格项目</el-button>
            <template v-for="(standard, index) in standards">
              <el-form-item label="" class="category-item">
                <el-select v-model="standard.addItemValue" placeholder="添加规格项目">
                  <el-option
                    v-for="specification in specificationColumn"
                    :key="specification.id"
                    :label="`${specification.name}【${specification.remark}】`"
                    :value="specification.id">
                  </el-option>
                </el-select>
                <i class="el-icon-delete" @click.prevent="deleteSpecification(index)"></i>
                <el-checkbox-group class="specification-checkbox-group" v-model="standard.checkboxList">
                  <el-checkbox v-for="item in standard.addItemValue" label="item.value"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </template>
          </el-form>
        </el-form-item>
        <el-form-item label="商品类型" class="productType">
          <el-radio class="radio" v-model="product.itemType" :label="1">实物商品(物流发货)</el-radio>
          <el-radio class="radio" v-model="product.itemType" :label="2">虚拟商品(无需物流)</el-radio>
          <el-radio class="radio" v-model="product.itemType" :label="3">电子卡券(无需物流)</el-radio>
        </el-form-item>
        <el-form-item label="预售商品">
          <el-radio v-model="product.preSale" :label="true">是</el-radio>
          <el-radio v-model="product.preSale" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="产品相册" style="width:800px">
          <el-upload
            action="//up-z2.qiniu.com" accept="image/*" multiple list-type="picture-card" :file-list="product.imagesArray" :data="uploadParams" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload"
            :on-remove="handleComicsRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
         <el-form-item label="描述" style="width: 800px">
          <simditor :content="product.details" :options="options2" @change="change"></simditor>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/product/list')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import api from '@/api'
import Simditor from '../../util/Simditor'
import UploadSingle from '../../util/UploadSingle'

const _ = require('lodash')

let id = 1000
export default {
  data() {
    return {
      specificationColumn: {},
      uploadParams: {},
      classifyList: [],
      defaultProps: {
        children: 'sonCategories',
        label: 'name'
      },
      product: {
        imagesArray: []
      },
      radio: false,
      standards: [
        {
          checkboxList: [],
          addItemValue: null,
          item: [{
            value: '1',
            label: '尺码'
          },
          {
            value: '2',
            label: '颜色'
          },
          {
            value: '3',
            label: '规格'
          }],
          subItem: [{
            value: '1',
            label: '大'
          },
          {
            value: '2',
            label: '中'
          },
          {
            value: '3',
            label: '小'
          }]
        }
      ],
      stockList: [{
        name: '衣服',
        size: 'S',
        quantity: '100'
      }],
      freeExpress: 'true',
      onBatch: 'true',
      share: 'true',
      preSales: false,
      typeColumn: [{
        name: '数码',
        id: 0
      },
      {
        name: '食品',
        id: 1
      },
      {
        name: '美妆',
        id: 2
      }],
      editing: false,
      article: {
        publicationDate: ''
      },
      // 图片上传七牛参考: https://my.oschina.net/u/1760791/blog/643768
      // http://blog.csdn.net/jiangtianhao13269230/article/details/50699737
      options2: {},
      optionColumn: [],
      optionAuthor: [],
      optionTag: []
    }
  },
  components: {
    Simditor,
    UploadSingle
  },
  async created() {
    // 获取所属分类
    const { code, data } = await api.get('/api/category/layeredListAll')
    if (code === 200) {
      this.classifyList = data
    }
    // 获取规格
    const specification = await api.get('/api/sku/layeredListAll')
    if (specification.code === 200) {
      this.specificationColumn = specification.data
    }
    // 获取token
    api.get('/api/pic/getUploadToken').then(response => {
      console.log(response)
      this.uploadParams = {
        unique_names: true,
        save_key: false,
        token: response.data.uploadToken
      }
    })
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
  /* eslint-disable */
  methods: {
    deleteSpecification(index) {
      this.standards.splice(index, 1)
    },
    async handleAvatarScucess(response, file, fileList) {
      const { code, data } = await api.get('/api/pic/getPrivateDownloadUrl', { key: response.key })
      if (code === 200) {
      }
      this.$set(this.product, 'productUrl', `${this.bucketPort}/${response.key}`)
      this.$set(this.product, 'productKey', response.key)
      this.product.imagesArray = fileList
      /* eslint-enable */
    },
    beforeAvatarUpload() {
      console.log('beforeAvatarUploadt')
    },
    append(store, data) {
      store.append({ id: id += 1, label: 'testtest', children: [] }, data)
    },
    remove(store, data) {
      store.remove(data)
    },
    renderContent(h, { node }) {
      return (
        <span>
          <span>
            <span>{ node.label }</span>
          </span>
          <span style="float: right; margin-right: 20px">
            <el-radio v-model="radio">选择</el-radio>
          </span>
        </span>)
    },
    add(index) {
      this.standards[index].subItem.push()
    },
    addSpecificationItems() {
      this.standards.push({
        addItemValue: null,
        item: [
          {
            value: '1',
            label: '尺码'
          },
          {
            value: '2',
            label: '颜色'
          },
          {
            value: '3',
            label: '规格'
          }]
      })
    },
    change(html) {
      this.article.content = html
    },
    async fetchData() {
      // const getNavigation = await api.get('/api/system/wechat/listNavigation')
      // if (getNavigation.code === 200) {
      //   this.optionColumn = getNavigation.data
      // }
      // this.optionTag = []
      // const getAuthor = await api.get('/api/system/author/listAuthor', { perPage: 1000 })
      // if (getAuthor.code === 200) {
      //   this.optionAuthor = getAuthor.data.array
      // }
      // editing
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/item/getItemDtails', { itemId: this.$route.params.id })
        if (code === 200) {
          this.product = data
          $('.simditor-body').html(this.product.details)
        }
      } else {
      // new
        this.editing = false
        this.product = { name: '', onSale: true, freeDelivery: true, preSale: false, deliveryFeeStrategy: null, threshold: null, feePerOrder: null, itemType: 1, itemRecommendType: [], categories: [], images: [], itemSkuMappings: [] }
      }
    },
    handleRemove(name) {
      if (name === 'article') {
        this.article.coverUrl = null
        this.article.coverKey = null
      }
    },
    handleSuccess(response, bucketPort, name) {
      if (name === 'article') {
        this.$set(this.article, 'coverUrl', `${bucketPort}/${response.key}`)
        this.$set(this.article, 'coverKey', response.key)
      }
    },
    async save() {
      // this.$set(this.article, 'content', $('.simditor-body').html())
      // if (!this.article.coverUrl) {
      //   return this.$notify.error({ title: '错误', message: '图片不能为空' })
      // } else if (!this.article.navigationId || !this.article.authorId || !this.article.title || !this.article.labels || !this.article.publicationDate || !this.article.introduction || !this.article.content) {
      //   return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      // }
      // // 对上post的key
      // this.article.labelList = JSON.stringify((_.clone(this.article.labels)))
      if (this.editing) {
        this.product.images = JSON.stringify((_.clone(this.product.images)))
        this.product.itemSkuMappings = JSON.stringify((_.clone(this.product.itemSkuMappings)))
        const { code } = await api.post('/api/item/update', this.product)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/product/list')
        } else {
          return this.$notify.error({ title: '失败', message: code + '保存失败' })
        }
      } else {
        this.product.images = JSON.stringify((_.clone(this.product.images)))
        this.product.itemSkuMappings = JSON.stringify((_.clone(this.product.itemSkuMappings)))
        const { code } = await api.post('/api/item/add', this.product)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/product/list')
        }
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
  .addSpecificationBtn {
    margin-bottom: 20px;
  }
  .specification-checkbox-group{
    display: inline-block;
    margin-left: 50px;
  }
</style>
