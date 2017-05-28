<template>
  <div class="">
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>商品管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加分类</span>
      </el-form-item>
    </el-form>

    <!-- 创建分类 -->
    <div class="form-box">
      <el-form ref="form" label-width="100px" label-position="left">
        <el-form-item label="分类名称" style="width: 400px;">
          <el-input v-model="classify.name"></el-input>
        </el-form-item>
        <el-form-item label="上级分类" style="width: 500px;">
          <template>
            <el-select v-model="classify.parentId" placeholder="默认为顶级分类">
              <el-option-group
                v-for="group in classifyParent"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="首页是否显示">
          <el-radio class="radio" v-model="classify.indexDisplay" :label="true">是</el-radio>
          <el-radio class="radio" v-model="classify.indexDisplay" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="排序" style="width: 400px;">
          <el-input v-model="classify.rank" type="number" placeholder="数字越大排名越前"></el-input>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/product/classify/list')">取消</el-button>
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
// import $ from 'jquery'
import api from '@/api'
import Simditor from '../../util/Simditor'
import UploadSingle from '../../util/UploadSingle'

// const _ = require('lodash')

let id = 1000
export default {
  data() {
    return {
      classify: {
        name: '',
        rank: '',
        parentId: '',
        indexDisplay: false
      },
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
      classifyParent: [{
        label: '一级分类',
        options: [{
          value: '',
          label: ''
        }]
      }, {
        label: '二级分类',
        options: [{
          value: '',
          label: ''
        }]
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
    this.fetchData()
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
      const getClassify = await api.get('/api/category/listParent')
      if (getClassify.code === 200) {
        this.classifyParent[0].options = []
        this.classifyParent[1].options = []
        const that = this
        if (getClassify.data.firstCategories) {
          getClassify.data.firstCategories.forEach((item, index) => {
            console.log(index)
            that.classifyParent[0].options.push({ value: item.id, label: item.name })
          })
        }
        if (getClassify.data.secondCategories) {
          getClassify.data.secondCategories.forEach((item, index) => {
            console.log(index)
            that.classifyParent[1].options.push({ value: item.id, label: item.name })
          })
        }
      }
      // this.optionTag = []
      // const getAuthor = await api.get('/api/system/author/listAuthor', { perPage: 1000 })
      // if (getAuthor.code === 200) {
      //   this.optionAuthor = getAuthor.data.array
      // }
      // // editing
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/category/getCategoryDetails', { categoryId: this.$route.params.id })
        if (code === 200) {
          this.classify = data
        }
      } else {
        this.editing = false
        this.classify = { name: '', parentId: '', rank: '', indexDisplay: false }
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
      if (!this.classify.name || !this.classify.rank) {
        this.$notify.error({ title: '错误', message: '表单信息不完整' })
        return
      }
      const { code } = await api.post('/api/category/add', this.classify)
      if (code === 200) {
        this.$notify.success({ title: '添加分类成功' })
        this.$router.push('/product/classify/list')
      }
    //   this.$set(this.article, 'content', $('.simditor-body').html())
    //   if (!this.article.coverUrl) {
    //     return this.$notify.error({ title: '错误', message: '图片不能为空' })
    //   } else if (!this.article.navigationId || !this.article.authorId || !this.article.title || !this.article.labels || !this.article.publicationDate || !this.article.introduction || !this.article.content) {
    //     return this.$notify.error({ title: '错误', message: '表单信息不完整' })
    //   }
    //   // 对上post的key
    //   this.article.labelList = JSON.stringify((_.clone(this.article.labels)))
    //   if (this.editing) {
    //     const { code } = await api.post('/api/system/wechat/updateArticle', this.article)
    //     if (code === 200) {
    //       this.$notify.success({ title: '成功', message: '保存成功' })
    //       this.$router.push('/newmedia/list')
    //     } else {
    //       return this.$notify.error({ title: '失败', message: code + '保存失败' })
    //     }
    //   } else {
    //     this.article.authorId = this.article.authorId
    //     const { code } = await api.post('/api/system/wechat/addArticle', this.article)
    //     if (code === 200) {
    //       this.$notify.success({ title: '成功', message: '保存成功' })
    //       this.$router.push('/newmedia/list')
    //     }
    //   }
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
  .hint {
    color: #48576a;
  }
</style>
