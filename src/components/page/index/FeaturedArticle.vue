<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>首页管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>精选文章</span>
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

    <!-- 添加表单 -->
    <el-dialog title="添加精选文章" v-model="formDialog">
      <el-form label-width="100px">
        <el-form-item label="选择文章" >
          <el-select v-model="rowObj.title" 
            filterable remote 
            placeholder="请输入文章标题进行搜索"
            :remote-method="searchArticle">
            <el-option label="选项一" value="value1"></el-option>
            <el-option label="选项二" value="value2"></el-option>
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

export default {
  data() {
    return {
      max: 7,
      // 表单
      formDialog: false,
      editing: false,
      editingIndex: null,
      rowObj: {},
      // 表格
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { code, data } = await api.get('/api/system/article/listExquisiteArticle')
      if (code === 200) {
        this.tableData = data
      }
    },
    async searchArticle(val) {
      const { code, data } = await api.get('/api/system/article/searchArticle', { title: val })
      if (code === 200) {
        console.log(data)
      }
    },
    // 添加精选
    addRow() {
      if (this.tableData.length >= this.max) {
        return this.$notify.info({ title: '提示', message: `最多创建${this.max}篇精选文章` })
      }
      this.editing = false
      this.rowObj = {
        title: null,
        order: 1
      }
      this.formDialog = true
    },
    // 编辑精选
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj = {}
      this.rowObj.id = this.tableData[index].id
      this.rowObj.order = this.tableData[index].order
      this.rowObj.title = this.tableData[index].title
      this.formDialog = true
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该精选，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = api.post('/api/system/article/deleteArticle', { articleId: this.tableData[index].id })
        console.log(code)
        if (code === 200) {
          this.tableData.splice(index, 1)
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (this.editing) {
        const { code } = await api.post('/api/system/article/updateNavigation', { articleId: this.rowObj.id })
        if (code === 200) {
          this.tableData[this.editingIndex] = this.rowObj
          this.rowObj = {}
          this.formDialog = false
        }
      } else {
        const { code, data } = await api.post('/api/system/article/addArticle', this.rowObj)
        if (code === 200) {
          this.rowObj.id = data.id
          this.tableData.push(this.rowObj)
          this.rowObj = {}
          this.formDialog = false
        }
      }
    }
  }
}
</script>
