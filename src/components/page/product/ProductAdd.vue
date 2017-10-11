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
      <el-form-item label="菜单：" v-if="editing">
        <span>编辑商品</span>
      </el-form-item>
    </el-form>
    <!-- 创建商品 -->
    <div class="form-box">
      <el-form ref="form" label-width="100px" label-position="left">
        <!--商品名称-->
        <el-form-item label="商品名称" style="width: 400px;">
          <el-input v-model="product.name"></el-input>
        </el-form-item>
        <!--所属分类-->
        <el-form-item label="所属分类">
          <el-tree
          :check-strictly="true"
          :data="classifyList"
          ref="tree"
          :props="defaultProps"
          node-key="_id"
          :show-checkbox="true"
          default-expand-all
          :expand-on-click-node="false">
          </el-tree>
        </el-form-item>
        <!--是否上架-->
        <el-form-item label="是否上架">
          <el-radio class="radio" v-model="product.onSale" :label="true">是</el-radio>
          <el-radio class="radio" v-model="product.onSale" :label="false">否</el-radio>
        </el-form-item>
        <!--排序-->
        <el-form-item label="序号">
          <el-input v-model="product.order" placeholder="序号越大商品越前" style="width: 300px;" type="number"></el-input>
        </el-form-item>
        
         <el-form-item label="商品推荐类型">
            <el-checkbox class="radio" v-model="product.itemRecommendTypeArray" label="1">最新商品</el-checkbox>
            <el-checkbox class="radio" v-model="product.itemRecommendTypeArray" label="2">特价商品</el-checkbox>
            <el-checkbox class="radio" v-model="product.itemRecommendTypeArray" label="3">热卖商品</el-checkbox>
            <el-checkbox class="radio" v-model="product.itemRecommendTypeArray" label="4">推荐商品</el-checkbox>
        </el-form-item>
         <!--商品规格-->
        <el-form-item label="商品规格">
          <el-form>
            <el-button @click.prevent="addSpecificationItems" class="addSpecificationBtn">添加规格项目</el-button>
            <div v-for="(standard, index) in standards" :key="index" class="classify-item">
              <el-select v-model="standard.selectValue" @change="specificationChage" placeholder="添加规格项目">
                <el-option
                  v-for="(specification, index) in specificationColumn"
                  :key="specification._id"
                  :label="`${specification.name}【${specification.remark}】`"
                  :value="index">
                </el-option>
              </el-select>
              <i class="el-icon-delete" @click.prevent="deleteSpecification(index)"></i>
              <el-checkbox-group class="specification-checkbox-group" v-model="standard.checkboxList" v-if="standard.selectValue !== null">
                <el-checkbox v-for="(valueArray,index) in specificationColumn[standard.selectValue].valueArray" :key="index" :label="valueArray._id" @change="specificationCheckboxChange">{{ valueArray.value }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form>
        </el-form-item>
        <!--商品库存-->
        <el-form-item label="商品库存">
         <el-table :data="itemSkus">
            <el-table-column type="index"></el-table-column>
            <el-table-column v-for="(item, index) in itemSkusType" :key="index" :label="item.name" :prop="item.key" min-width="100">
            </el-table-column>
            <el-table-column label="价格(单位：元)" min-width="100">
              <template scope="scope">
                <el-input v-model="scope.row.price" type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="库存" min-width="100">
              <template scope="scope">
                <el-input v-model="scope.row.stock" type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="商品货号" min-width="100">
               <template scope="scope">
                <el-input v-model="scope.row.productNo"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template scope="scope">
                <el-button size="small" @click.native.prevent="deleteItemSkus(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
       <!--商品类型-->
        <el-form-item label="商品类型" class="productType">
          <el-radio class="radio" v-model="product.itemType" :label="1">实物商品(物流发货)</el-radio>
          <el-radio class="radio" v-model="product.itemType" :label="2">虚拟商品(无需物流)</el-radio>
          <el-radio class="radio" v-model="product.itemType" :label="3">电子卡券(无需物流)</el-radio>
        </el-form-item>
        <!--预售商品-->
        <el-form-item label="预售商品">
          <el-radio v-model="product.preSale" :label="true">是</el-radio>
          <el-radio v-model="product.preSale" :label="false">否</el-radio>
        </el-form-item>
        <!--产品相册-->
        <el-form-item label="产品相册" style="width:800px">
          <el-upload
            action="//up-z2.qiniu.com" accept="image/*" multiple list-type="picture-card" :file-list="product.images" :data="uploadParams" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload"
            :on-remove="handleComicsRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!--描述-->
         <el-form-item label="描述" style="width: 800px">
          <simditor :content="product.details" :options="options2" @change="change" v-model="product.details"></simditor>
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

// const _ = require('lodash')

export default {
  data() {
    return {
      data3: [{
        id: '1',
        label: '一级 2',
        children: [{
          id: 3,
          label: '二级 2-1',
          children: [{
            id: 4,
            label: '三级 3-1-1'
          }, {
            id: 5,
            label: '三级 3-1-2',
            disabled: true
          }]
        }, {
          id: 2,
          label: '二级 2-2',
          disabled: true,
          children: [{
            id: 6,
            label: '三级 3-2-1'
          }, {
            id: 7,
            label: '三级 3-2-2',
            disabled: true
          }]
        }]
      }],
      specificationCheckedList: [],
      itemSkus: [],
      itemSkusType: [],
      specificationColumn: [],
      uploadParams: {},
      classifyList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      product: {
        classifies: ['59d4d3b6fc612a7e43930909'],
        specifications: [],
        images: [],
        itemType: 1,
        details: '',
        name: ''
      },
      radio: false,
      standards: [{
        checkboxList: [], // 选中的checkbox
        selectValue: null // 选中的select
      }],
      stockList: [],
      freeExpress: 'true',
      onBatch: 'true',
      share: 'true',
      preSales: false,
      editing: false,
      article: {
        publicationDate: ''
      },
      // 图片上传七牛参考: https://my.oschina.net/u/1760791/blog/643768
      // http://blog.csdn.net/jiangtianhao13269230/article/details/50699737
      options2: {},
      optionColumn: [],
      optionAuthor: [],
      optionTag: [],
      result: [],
      results: []
    }
  },
  components: {
    Simditor,
    UploadSingle
  },
  async created() {
    // 获取所属分类
    const { code, data } = await api.get('/api/product/classify/all')
    if (code === 200) {
      this.classifyList = data
    }
    // 获取规格
    const specification = await api.get('/api/product/specification/all')
    if (specification.code === 200) {
      this.specificationColumn = specification.data.pagingData
    }
    // 获取token
    api.get('/api/pic/getUploadToken').then(response => {
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
  methods: {
    handleComicsRemove() {
    },
    deleteItemSkus(index) {
      this.itemSkus.splice(index, 1)
    },
    // getClassifiesId(checkedNodes) {
    //   for (let i = 0; i < checkedNodes.length; i += 1) {
    //     this.product.classifies.push(checkedNodes[i]._id)
    //     this.getClassifiesId(checkedNodes[i])
    //   }
    // },
    findCheckBoxName(checkboxId) {
      for (let i = 0; i < this.specificationColumn.length; i += 1) {
        for (let j = 0; j < this.specificationColumn[i].valueArray.length; j += 1) {
          if (this.specificationColumn[i].valueArray[j]._id === checkboxId) {
            console.log(this.specificationColumn[i].valueArray[j].value)
            return this.specificationColumn[i].valueArray[j].value
          }
        }
      }
    },
    findSelectName(selectIndex) {
      return this.specificationColumn[selectIndex]
    },
    doExchange(arr, depth) {
      for (let i = 0; i < arr[depth].length; i += 1) {
        this.result[depth] = arr[depth][i]
        if (depth !== arr.length - 1) {
          this.doExchange(arr, depth + 1)
        } else {
          this.results.push(JSON.parse(JSON.stringify(this.result)))
        }
      }
    },
    specificationChage() {
      const stLen = this.standards.length
      this.standards[stLen - 1].checkboxList.splice(0, this.standards[stLen - 1].checkboxList.length)
    },
    specificationCheckboxChange() {
      this.result = []
      this.results = []
      this.itemSkusType = []
      this.itemSkus = []
      for (let i = 0; i < this.standards.length; i += 1) {
        if (this.standards[i].checkboxList.length) {
          const specificationName = this.specificationColumn[this.standards[i].selectValue]
          this.itemSkusType.push({ name: `${specificationName.name}【${specificationName.remark}】`, key: '' + this.itemSkusType.length })
        }
      }
      const arr = []
      for (let i = 0, len1 = this.standards.length; i < len1; i += 1) {
        const checkboxList = []
        for (let j = 0, len2 = this.standards[i].checkboxList.length; j < len2; j += 1) {
          checkboxList.push(this.standards[i].checkboxList[j])
        }
        arr.push(checkboxList)
      }
      this.doExchange(arr, 0)
      for (let i = 0; i < this.results.length; i += 1) {
        let item = { attrIdArray: [] }
        for (let j = 0; j < this.results[0].length; j += 1) {
          item[j] = this.findCheckBoxName(this.results[i][j])
          item.attrIdArray.push(this.results[i][j])
        }
        item = Object.assign(item, { stock: '0', price: '0', productNo: '10000' })
        this.itemSkus.push(item)
      }
    },
    deleteSpecification(index) {
      this.standards.splice(index, 1)
      this.specificationCheckboxChange()
    },
    async handleAvatarScucess(response, file, fileList) {
      const { code } = await api.get('/api/pic/getPrivateDownloadUrl', { key: response.key })
      if (code === 200) {
        // this.$set(this.product, 'productUrl', `${this.bucketPort}/${response.key}`)
        // this.$set(this.product, 'productKey', response.key)
        this.product.images = fileList
      }
    },
    beforeAvatarUpload() {
      console.log('beforeAvatarUpload')
    },
    addSpecificationItems() {
      // 不能超过3个规格
      if (this.standards.length >= 3) {
        this.$notify.warning({ title: '提示', message: '规格不能超过3项' })
        return
      }
      this.standards.push({
        checkboxList: [],
        selectValue: null
      })
    },
    change(html) {
      this.article.content = html
    },
    async fetchData() {
      // editing
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get(`/api/product/${this.$route.params.id}`)
        if (code === 200) {
          this.product = data
          this.standards = []
          for (let i = 0, len = data.specifications.length; i < len; i += 1) {
            let checkboxList = []
            for (let j = 0, len2 = data.specifications[i].specificationsItem.length; j < len2; j += 1) {
              checkboxList.push(data.specifications[i].specificationsItem[j])
            }
            checkboxList = [...new Set(checkboxList)]
            this.$nextTick(() => {
              this.standards.push({
                checkboxList,
                selectValue: i
              })
            })
          }
          this.$nextTick(() => {
            this.specificationCheckboxChange()
            this.itemSkus = JSON.parse(JSON.stringify(this.product.productAttrs))
            for (let i = 0, len = this.itemSkus.length; i < len; i += 1) {
              for (let j = 0, len2 = this.itemSkus[i].attrIdArray.length; j < len2; j += 1) {
                this.$set(this.itemSkus[i], j.toString(), this.findCheckBoxName(this.itemSkus[i].attrIdArray[j]))
                // debugger
                this.itemSkus[i].attrIdArray[j] = this.itemSkus[i].attrIdArray[j]
              }
            }
          })
          // for (let i = 0, len = this.product.classifies.length; i < len; i += 1) {
          //   // console.log(this.product.classifies[i].toString())
          //   this.defaultClassifies.push(this.product.classifies[i])
          // }
          this.$refs.tree.setCheckedKeys(this.product.classifies)
          // this.product.itemRecommendTypeArray = data.itemRecommendTypeList
          // this.product.images = []
          // data.imageMapList.forEach((item) => {
          //   this.product.images.push({ url: item.imageUrl, key: item.imageKey })
          // })
          // this.product.classifyList = data.categoryIdList
          // this.itemSkus = data.itemSkuMappingList
          // data.attrIdArray.forEach((item, index) => {
          //   this.itemSkusType.push({ name: `${item.name}【${item.remark}】`, key: '' + index })
          // })
          $('.simditor-body').html(this.product.details)
        }
      } else {
        // new
        this.editing = false
        this.product = { name: 'test', onSale: true, order: 1, preSale: false, itemType: 1, itemRecommendTypeArray: ['1'], classifies: [], images: [], productAttrs: [], specifications: [] }
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
      // 图片key放入数组,key数组存放于数据库中
      const imgUrl = []
      this.product.images.forEach((item) => {
        if (item.response) {
          imgUrl.push(item.response.key)
        } else {
          imgUrl.push(item.key)
        }
      })
      this.product.images = imgUrl
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
      // 商品分类
      this.product.classifies = this.$refs.tree.getCheckedKeys()
      // 商品推荐类型
      this.product.itemRecommendTypeArray = this.product.itemRecommendTypeArray
      this.$set(this.product, 'details', $('.simditor-body').html())
      this.product.productAttrs = this.itemSkus
      // editing
      if (this.editing) {
        // this.product.images = JSON.stringify((_.clone(this.product.images)))
        const { code } = await api.put(`/api/product/edit/${this.product._id}`, this.product)
        if (code === 201) {
          this.$notify.success({ title: '成功', message: '编辑成功' })
          this.$router.push('/product/list')
        } else {
          return this.$notify.error({ title: '失败', message: code + '编辑成功' })
        }
      } else {
        // new
        this.product.classifies = this.$refs.tree.getCheckedKeys()
        this.$set(this.product, 'specificationIdArray', this.product.result)
        for (let i = 0, len = this.standards.length; i < len; i += 1) {
          this.product.specifications.push({
            specificationsItemId: this.specificationColumn[i]._id,
            specificationsItem: []
          })
          for (let j = 0, len2 = this.standards[i].checkboxList.length; j < len2; j += 1) {
            this.product.specifications[i].specificationsItem.push(this.standards[i].checkboxList[j])
          }
        }
        const { code } = await api.post('/api/product/add', this.product)
        if (code === 201) {
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
  .el-form .classify-item {
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
