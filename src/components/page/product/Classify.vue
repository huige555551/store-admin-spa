<template>
  <div class="">
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>商品管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>分类列表</span>
      </el-form-item>
    </el-form>

    <!-- 创建商品分类 -->
    <div class="form-box">
      <el-table>
        <el-table-column align="center" label=""></el-table-column>
        <el-table-column align="center" label="首页是否展示" width="300"></el-table-column>
        <el-table-column align="center" label="层级" width="300"></el-table-column>
        <el-table-column align="center" label="排序"  width="300"></el-table-column>
        <el-table-column label="操作" width="100"></el-table-column>
        <div slot="empty"></div>
      </el-table>
      <el-tree
        :data="classifyList"
        :props="defaultProps"
        node-key="_id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
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
        label: 'name'
      },
      editing: false,
      classifyList: [
        {
          label: 't1'
        },
        {
          label: 't2'
        }
      ]
      // defaultProps: {
      //   children: 'sonCategories',
      //   label: 'name'
      // }
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
      this.fetchData()
    }
  },
  /* eslint-enable */
  methods: {
    async remove(store, data) {
      const { code } = await api.delete(`/api/product/classify/delete/${data._id}`)
      if (code === 200) {
        store.remove(data)
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{ node.label }</span>
          </span>
          <span style="float: right;">
            <span class="showIndex">{ data.showIndex ? '是' : '否' }</span>
            <span class="level">{ data.level }</span>
            <span class="order">{ data.order }</span>
            <span class="btn-group">
              <el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>
              <el-button size="mini" on-click={ () => this.$router.push(`/product/classify/edit/${data._id}`) }>编辑</el-button>
            </span>
          </span>
        </span>)
    },
    async deleteClassify(index) {
      this.$confirm('此操作将该分类，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/product/category/delete', { categoryId: index })
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.fetchData()
        }
      }).catch(() => {})
    },
    async fetchData() {
      const { code, data } = await api.get('/api/product/classify/all')
      if (code === 200) {
        if (data) {
          this.classifyList = data
        }
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
  .el-table__empty-block {
    display: none;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .level, .order, .showIndex {
    width: 300px;
    display: inline-block;
    text-align: center;
  }
  .btn-group {
    width: 100px;
    display: inline-block;
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
