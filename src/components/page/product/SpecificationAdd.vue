<template>
  <div class="">
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>商品管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加规格</span>
      </el-form-item>
    </el-form>

    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" label-width="100px" label-position="left">
        <el-form-item label="规格名称" style="width: 400px;">
          <el-input v-model="specification.name"></el-input>
        </el-form-item>
        <el-form-item label="显示类型">
          <el-radio class="radio" v-model="specification.display_type" :label="1">文字</el-radio>
          <el-radio class="radio" v-model="specification.display_type" :label="2">图片</el-radio>
        </el-form-item>
        <el-form-item label="说明" style="width: 400px;">
          <el-input v-model="specification.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addSpecification">添加规则</el-button>
        </el-form-item>
        <el-form-item label="规格列表">
          <el-table :data="specification.skuArray">
              <el-table-column label="规格值" min-width="100">
                <template scope="scope">
                  <el-input style="width: 100px;" v-model="scope.row.value" v-if="specification.display_type === 1"></el-input>
                  <div v-if="specification.display_type === 2">
                    <UploadSingle
                      :imgUrl="article.coverUrl"
                      :imgKey="article.coverKey"
                      :size=1 dimension="800x400"
                      @handleRemove="handleRemove"
                      @handleSuccess="handleSuccess">
                    </UploadSingle>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提示信息(不重复)" min-width="300">
                <template scope="scope">
                  <el-input style="width: 300px;" v-model="scope.row.valueHint"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="序号">
                <template scope="scope">
                  <el-input style="width: 100px;" v-model="scope.row.rank"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template scope="scope">
                  <el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/product/specification')">取消</el-button>
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

export default {
  data() {
    return {
      specification: {
        type: '',
        remark: '',
        display_type: 1,
        skuArray: [{ value: '', valueHint: '', rank: '' }]
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
    deleteRow(index) {
      console.log(index)
      this.specification.skuArray.splice(index, 1)
    },
    addSpecification() {
      this.specification.skuArray.push({ value: '', valueHint: '' })
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
