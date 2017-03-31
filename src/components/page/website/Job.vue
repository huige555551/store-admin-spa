<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>网站设置</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>岗位列表</span>
      </el-form-item>
    </el-form>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="job" label="名字" min-width="120"></el-table-column>
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
        <el-button @click="addRow">添加岗位</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加栏目表单 -->
    <el-dialog title="添加轮播" v-model="formDialog">
      <el-form :model="rowObj" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="rowObj.job"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述">
          <el-input type="textarea" :rows="6" v-model="rowObj.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRow">确 定</el-button>
        <el-button @click="formDialog=false">取 消</el-button>
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
      formDialog: false,
      rowObj: {
        id: null,
        job: null,
        description: null
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
      const { code, data } = await api.get('/api/system/job/listRecruitment')
      if (code === 200) {
        this.tableData = data
      }
    },
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.job = this.tableData[index].job
      this.rowObj.description = this.tableData[index].description
      this.formDialog = true
    },
    addRow() {
      this.editing = false
      this.rowObj.id = null
      this.rowObj.job = null
      this.rowObj.description = null
      this.formDialog = true
    },
    // 删除栏目
    async deleteRow(index) {
      this.$confirm('此操作将该删除该栏目，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/job/deleteRecruitment', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      }).catch(() => {})
    },
    // 保存修改
    async saveRow() {
      if (!this.rowObj.description || !this.rowObj.job) {
        return this.$notify.error({ title: '失败', message: '请填写完整有效的名字和岗位描述' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/job/updateRecruitment', this.rowObj)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.formDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/job/addRecruitment', this.rowObj)
        if (code === 200) {
          this.fetchData()
          this.formDialog = false
          this.$notify.success({ title: '成功', message: '添加成功' })
        }
      }
    }
  }
}
</script>
