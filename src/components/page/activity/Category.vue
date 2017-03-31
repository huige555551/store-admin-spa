<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>活动管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>活动分类</span>
      </el-form-item>
    </el-form>
    <!-- Table -->
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
        <el-button @click="addRow">添加分类</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加栏目表单 -->
    <el-dialog title="添加分类" v-model="activityDialog">
      <el-form :model="rowObj" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="rowObj.name"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="rowObj.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="saveRow">确 定</el-button>
        <el-button @click.native.prevent="activityDialog = false">取 消</el-button>
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
      // 表单
      editing: false,
      editingIndex: null,
      activityDialog: false,
      rowObj: {
        id: null,
        name: null,
        order: null
      },
      // 表格
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
      const { code, data } = await api.get('/api/system/activity/listNavigation')
      if (code === 200) {
        this.tableData = data
      }
    },
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.name = this.tableData[index].name
      this.rowObj.order = this.tableData[index].order
      this.activityDialog = true
    },
    addRow() {
      this.editing = false
      this.rowObj.id = null
      this.rowObj.name = null
      this.rowObj.order = null
      this.activityDialog = true
    },
    // 删除栏目
    async deleteRow(index) {
      this.$confirm('此操作将该删除该栏目，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/activity/deleteNavigation', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      }).catch(() => {})
    },
    // 保存修改
    async saveRow() {
      if (!this.rowObj.order || !this.rowObj.name) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/activity/updateNavigation', this.rowObj)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.activityDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/activity/addNavigation', this.rowObj)
        if (code === 200) {
          this.fetchData()
          this.activityDialog = false
          this.$notify.success({ title: '成功', message: '添加成功' })
        }
      }
    }
  }
}
</script>
