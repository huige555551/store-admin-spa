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
      <el-table-column prop="order" label="顺序" width="80"></el-table-column>
      <el-table-column label="商品" width="200">
        <template scope="scope">
          <img class="articleImg":src="scope.row.image" width="200" max-height="200" @click="openImg(scope.row.productImg)" style="cursor:pointer">
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
          <el-select v-model="rowObj.productId"
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
          <el-input v-model="rowObj.order" type="number" placeholder="输入数字，数字越大越排前"></el-input>
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
        productId: null,
        order: 1
      },
      results: [],
      // 表格
      tableData: []
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
        productId: null,
        title: null,
        order: null
      }
      this.formDialog = true
    },
    // 编辑精选
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj = _.clone(this.tableData[index])
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
      if (!this.rowObj.productId || !this.rowObj.order) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.put(`/api/featuredProduct/edit/${this.rowObj._id}`, this.rowObj)
        if (code === 201) {
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.formDialog = false
          this.fetchData()
        }
      } else {
        this.rowObj.productId = this.rowObj.productId
        const { code } = await api.post('/api/featuredProduct/add', this.rowObj)
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
