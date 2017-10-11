<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>首页管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>精选商品</span>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="80"></el-table-column>
      <el-table-column label="商品" width="200">
        <template scope="scope">
          <img :src="scope.row.productImg" width="200" max-height="200" @click="openImg(scope.row.productImg)" style="cursor:pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="addRow">添加精选商品</el-button> 最多{{max}}个
      </el-form-item>
    </el-form>

    <!-- 添加表单 -->
    <el-dialog title="添加精选商品" v-model="formDialog">
      <el-form label-width="100px">
        <el-form-item label="选择商品" >
          <el-select v-model="rowObj.targetProductId"
            filterable
            placeholder="请输入商品名称搜索">
            <el-option
              v-for="item in results"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="rowObj.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="saveRow">确 定</el-button>
        <el-button @click.native.prevent="formDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'

const _ = require('lodash')

export default {
  data() {
    return {
      max: 7,
      // 表单
      formDialog: false,
      editing: false,
      editingIndex: null,
      rowObj: {
        targetProductId: null,
        order: 1
      },
      results: [],
      // 表格
      tableData: [{
        order: '1',
        name: '衣服',
        productImg: 'https://img.yzcdn.cn/upload_files/2015/05/14/Fh1ZR74CpUm0s85svgQuU-MQ3oQd.png?imageView2/2/w/120/h/0/q/75/format/webp'
      },
      {
        order: '2',
        name: '拖鞋',
        productImg: 'https://img.yzcdn.cn/upload_files/2015/05/14/Fh1ZR74CpUm0s85svgQuU-MQ3oQd.png?imageView2/2/w/120/h/0/q/75/format/webp'
      }]
    }
  },
  created() {
    this.getAllProduct()
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { code, data } = await api.get('/api/featuredProduct/all')
      if (code === 200) {
        this.tableData = data
      }
    },
    async getAllProduct() {
      const { code, data } = await api.get('/api/product/all')
      if (code === 200) {
        this.results = data
      }
    },
    async search(val) {
      const { code, data } = await api.get('/api/product/searchName', { name: val })
      if (code === 200) {
        this.results = data
        if (this.results.length > 10) {
          this.results.length = 10
        }
      }
    },
    // 添加精选
    addRow() {
      if (this.tableData.length >= this.max) {
        return this.$notify.info({ title: '提示', message: `最多创建${this.max}个精选商品` })
      }
      this.editing = false
      this.rowObj = {
        articleId: null,
        title: null,
        order: null
      }
      this.formDialog = true
    },
    // 编辑精选
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj = { targetProductId: this.tableData[index].title }
      this.rowObj.articleId = this.tableData[index].id
      this.rowObj.order = this.tableData[index].order
      this.rowObj.title = this.tableData[index].title
      this.rowObj.navigationName = this.tableData[index].navigationName
      this.rowObj.author = this.tableData[index].author
      this.rowObj.period = this.tableData[index].period
      this.formDialog = true
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该精选，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post(`/api/featuredProduct/delete/${this.tableData[index]._id}`)
        if (code === 204) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (!this.rowObj.targetProductId || !this.rowObj.order) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        if (this.rowObj.targetProductId === this.rowObj.title) {
          this.rowObj.targetProductId = this.rowObj.articleId
        }
        const { code } = await api.post(`/api/featuredProduct/edit/${this.rowObj._id}`, this.rowObj)
        if (code === 201) {
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
          this.rowObj = {
            articleId: null,
            title: null,
            order: null
          }
          this.formDialog = false
          this.fetchData()
        }
      } else {
        this.rowObj.articleId = this.rowObj.targetProductId
        const { code } = await api.post('/api/system/article/addExquisiteArticle', this.rowObj)
        if (code === 201) {
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.fetchData()
          this.formDialog = false
        }
      }
    }
  }
}
</script>
