<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="100"></el-table-column>
      <el-table-column prop="order" label="顺序" width="80"></el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="default" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button type="default" size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="dialogFormVisible = true">添加分类</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加栏目表单 -->
    <el-dialog title="添加分类" v-model="dialogFormVisible" label-position="right">
      <el-form :model="newColumn" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="newColumn.name"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="newColumn.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native.prevent="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="saveRow">确 定</el-button>
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
      dialogFormVisible: false,
      editing: false,
      editingIndex: null,
      rowObj: {
        name: null,
        order: null
      },
      newColumn: {
        name: null,
        order: null
      },
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取分类数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/wechat/listNavigation')
      if (code === 200) {
        this.tableData = data
      }
    },
    // 添加行
    addRow() {
      this.editing = false
      this.newColumn.name = null
      this.newColumn.order = null
    },
    // 编辑行
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.newColumn.id = this.tableData[index].id
      this.newColumn.name = this.tableData[index].name
      this.newColumn.order = this.tableData[index].order
      this.dialogFormVisible = true
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该分类数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        console.log(this.tableData[index].id)
        const { code } = await api.post('/api/system/wechat/deleteNavigation', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (this.editing) {
        const { code } = await api.post('/api/system/wechat/updateNavigation', this.newColumn)
        if (code === 200) {
          this.tableData.splice(this.this.editingIndex, 1, this.newColumn)
          this.tableData.splice(this.this.editingIndex, 1, _.clone(this.newColumn))
          this.dialogFormVisible = false
        }
      } else {
        const { code } = await api.post('/api/system/wechat/addNavigation', this.newColumn)
        if (code === 200) {
          this.fetchData()
          this.dialogFormVisible = false
        }
      }
    }
  }
}
</script>
