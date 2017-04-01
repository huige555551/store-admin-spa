<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>首页管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>精选新媒体</span>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="author" label="作者" min-width="60"></el-table-column>
      <el-table-column prop="period" label="期数" width="80"></el-table-column>
      <el-table-column prop="navigationName" label="栏目" width="100"></el-table-column>
      <el-table-column prop="order" label="顺序" width="70"></el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="addRow">添加文章</el-button> 最多{{max}}篇
      </el-form-item>
    </el-form>

    <!-- 添加文章 -->
    <el-dialog title="添加精选文章" v-model="formDialog">
      <el-form label-width="100px">
        <el-form-item label="选择文章" >
          <el-select v-model="rowObj.articleId"
            filterable remote
            placeholder="请输入文章标题搜索"
            :remote-method="searchArticle">
            <el-option
              v-for="item in results"
              :key="item.id"
              :label="item.title"
              :value="item.id">
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
      max: 8,
      // 表单
      formDialog: false,
      editing: false,
      editingIndex: null,
      rowObj: { articleId: null },
      // 表格
      tableData: [],
      results: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { code, data } = await api.get('/api/system/wechat/listNewMedia')
      if (code === 200) {
        this.tableData = data
      }
    },
    async searchArticle(val) {
      const { code, data } = await api.get('/api/system/wechat/searchArticle', { title: val })
      if (code === 200) {
        this.results = data
        this.length = 10
      }
    },
    // 添加精选
    addRow() {
      if (this.tableData.length >= this.max) {
        return this.$notify.info({ title: '提示', message: `最多创建${this.max}篇精选文章` })
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
      this.rowObj = { articleId: this.tableData[index].title }
      this.rowObj.newMediaId = this.tableData[index].id
      this.rowObj.order = this.tableData[index].order
      this.rowObj.title = this.tableData[index].title
      this.rowObj.navigationName = this.tableData[index].navigationName
      this.rowObj.author = this.tableData[index].author
      this.rowObj.period = this.tableData[index].period
      this.formDialog = true
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该精选，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async() => {
        const { code } = await api.post('/api/system/wechat/deleteNewMedia', { newMediaId: this.tableData[index].id })
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.tableData.splice(index, 1)
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (!this.rowObj.articleId || !this.rowObj.order) {
        return this.$notify.error({ title: '保存失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        if (this.rowObj.articleId === this.rowObj.title) {
          this.rowObj.articleId = this.rowObj.newMediaId
        }
        console.log(this.rowObj)
        const { code } = await api.post('/api/system/wechat/updateNewMedia', this.rowObj)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
          this.rowObj = {}
          this.fetchData()
          this.formDialog = false
        }
      } else {
        console.log(this.rowObj)
        const { code } = await api.post('/api/system/wechat/addNewMedia', this.rowObj)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.fetchData()
          this.formDialog = false
        }
      }
    }
  }
}
</script>
