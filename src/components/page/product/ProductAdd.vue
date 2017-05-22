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

    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" :model="article" label-width="100px" label-position="left">
        <el-form-item label="商品名称" style="width: 400px;">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="关键字" style="width: 400px;">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-tree
            :data="data2"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">
          </el-tree>
        </el-form-item>
         <el-form-item label="是否上架">
          <el-radio class="radio" v-model="onBatch" label="true">是</el-radio>
          <el-radio class="radio" v-model="onBatch" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否免运费">
            <el-radio class="radio" v-model="freeExpress" label="true">是</el-radio>
            <el-radio class="radio" v-model="freeExpress" label="false">否</el-radio>
            <el-form>
              <el-form-item>
                <el-radio>
                  <span>每单固定收取运费：</span>
                  <el-input style="width: 100px;"></el-input>元
                </el-radio>
              </el-form-item>
              <el-form-item>
                <el-radio>
                  <span>订单每消费满</span><el-input style="width: 100px;"></el-input><span>元免运费，未达到条件每订单收取</span><el-input style="width: 100px;"></el-input><span>元运费</span>
                </el-radio>
              </el-form-item>
              <el-form-item>
                <el-radio>
                  <span>每订单购满<el-input style="width: 100px;"></el-input>件商品免运费，未达到条件每订单收取<el-input style="width: 100px;"></el-input>元运费：</span>元
                </el-radio>
              </el-form-item>
            </el-form>
        </el-form-item>
         <el-form-item label="商品推荐类型">
            <el-checkbox class="radio" v-model="freeExpress" label="true">最新商品</el-checkbox>
            <el-checkbox class="radio" v-model="freeExpress" label="false">特价商品</el-checkbox>
            <el-checkbox class="radio" v-model="freeExpress" label="true">热卖商品</el-checkbox>
            <el-checkbox class="radio" v-model="freeExpress" label="true">推荐商品</el-checkbox>
        </el-form-item>
        <el-form-item label="商品库存">
         <el-table :data="tableData">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="款式" min-width="100">

            </el-table-column>
            <el-table-column prop="name" label="尺码" min-width="100"></el-table-column>
            <el-table-column label="价格" min-width="100">
              <template scope="scope">
                <el-input></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="库存" min-width="100">
              <template scope="scope">
                <el-input></el-input>
              </template>
            </el-table-column>
            <el-table-column label="商家编码" min-width="100">
               <template scope="scope">
                <el-input></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="销量" min-width="100"></el-table-column>
            <el-table-column label="操作" width="160">
              <template scope="scope">
                <el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-form>
              <!--<el-form-item v-for="(option, index) in newQuestion.options" :label="'选项' + (index+1)" :key="option.key">
              <el-input v-model="option.option"></el-input>
              <el-button style="margin-left: 20px" @click="deleteOption(index)">删除</el-button>
            </el-form-item>-->
            <!--<el-form-item>
              <el-button @click="addOption">新增选项</el-button>
            </el-form-item>-->
            <template v-for="(standard, index) in standards">
              <el-form-item label="" class="category-item">
                <el-select v-model="standard.addItemValue" multiple placeholder="添加规格项目">
                  <el-option
                    v-for="item in standard.item"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <i class="el-icon-delete"></i>
              </el-form-item>
              <el-form-item label="" class="category-item" v-if="standard.addItemValue">
                <el-select v-model="value5" multiple placeholder="添加">
                  <el-option
                    v-for="item in standard.subItem"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-upload class="avatar-uploader">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span @click="add(index)">添加</span>
              </el-form-item>
            </template>
            <el-button @click="addSpecificationItems">添加规格项目</el-button>
          </el-form>
        </el-form-item>
        <el-form-item label="商品类型" class="productType">
          <el-radio class="radio" v-model="radio" label="1">实物商品(物流发货)</el-radio>
          <el-radio class="radio" v-model="radio" label="2">虚拟商品(无需物流)</el-radio>
          <el-radio class="radio" v-model="radio" label="3">电子卡券(无需物流)</el-radio>
        </el-form-item>
        <el-form-item label="预售商品">
          <el-switch
            v-model="preSales"
            on-text=""
            off-text="">
          </el-switch>
        </el-form-item>
        <el-form-item label="产品相册" style="width:400px">
          <el-upload
          action="//up-z2.qiniu.com" accept="image/*" multiple list-type="picture-card" :data="uploadParams" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload"
          :on-remove="handleComicsRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        </el-form-item>
         <el-form-item label="描述" style="width: 800px">
          <simditor :content="article.content" :options="options2" @change="change"></simditor>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/product/list')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="选择商品分类" label-position="left">
      <el-form>
      </el-form>
    </el-dialog>
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
      radio: false,
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      standards: [
        {
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
          subItem: []
        }
      ],
      tableData: [{
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
    // this.fetchData()
  },
  // 组件复用，路由数据刷新
  /* eslint-disable */
  watch: {
    '$route'() {
      // this.fetchData()
    }
  },
  /* eslint-enable */
  methods: {
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
      this.standards[index].subItem.push({})
    },
    addSpecificationItems() {
      this.standards.push({
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
      const getNavigation = await api.get('/api/system/wechat/listNavigation')
      if (getNavigation.code === 200) {
        this.optionColumn = getNavigation.data
      }
      this.optionTag = []
      const getAuthor = await api.get('/api/system/author/listAuthor', { perPage: 1000 })
      if (getAuthor.code === 200) {
        this.optionAuthor = getAuthor.data.array
      }
      // editing
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/wechat/getArticle', { articleId: this.$route.params.id })
        if (code === 200) {
          this.article = data
          $('.simditor-body').html(this.article.content)
        }
      } else {
      // new
        this.editing = false
        this.article = { navigationId: null, authorId: null, publicationDate: null, labels: [], content: '' }
      }
    },
    async searchAuthorName(inputAuthorName) {
      const { code, data } = await api.get('/api/system/author/listAuthor', { authorName: inputAuthorName })
      if (code === 200) {
        this.optionAuthor = data.array
      }
    },
    // 日期更改
    handleDatePick(val) {
      this.article.publicationDate = val
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
      this.$set(this.article, 'content', $('.simditor-body').html())
      if (!this.article.coverUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      } else if (!this.article.navigationId || !this.article.authorId || !this.article.title || !this.article.labels || !this.article.publicationDate || !this.article.introduction || !this.article.content) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      // 对上post的key
      this.article.labelList = JSON.stringify((_.clone(this.article.labels)))
      if (this.editing) {
        const { code } = await api.post('/api/system/wechat/updateArticle', this.article)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/newmedia/list')
        } else {
          return this.$notify.error({ title: '失败', message: code + '保存失败' })
        }
      } else {
        this.article.authorId = this.article.authorId
        const { code } = await api.post('/api/system/wechat/addArticle', this.article)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/newmedia/list')
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
</style>
