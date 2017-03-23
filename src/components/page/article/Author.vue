<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>栏目文章</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>作者列表</span>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="100"></el-table-column>
      <el-table-column label="头像" width="80">
        <template scope="scope">
          <img :src="scope.row.headImgUrl" width="80" height="80" @click="openImg(scope.row.headImgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-button @click="addRow" style="float: left;">添加作者</el-button>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 添加表单 -->
    <el-dialog title="添加作者" v-model="formDialog">
      <el-form :model="rowObj" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="rowObj.name"></el-input>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-upload action="">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸120x120，只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
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
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
      // 表单
      formDialog: false,
      editing: false,
      editingIndex: null,
      rowObj: {},
      // 表格
      tableData: [
        // { id: 1, name: '作者1', headImgUrl: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        // { id: 1, name: '作者2', headImgUrl: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        // { id: 1, name: '作者3', headImgUrl: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        // { id: 1, name: '作者4', headImgUrl: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        // { id: 1, name: '作者5', headImgUrl: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        // { id: 1, name: '作者6', headImgUrl: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('api/system/author/listAuthor', { currentPage: this.currentPage, perPage: this.perPage })
      if (code === 200) {
        this.tableData = data
      }
    },
    // 分页
    handleSizeChange(val) {
      this.perPage = val
      this.currentPage = 1
      this.fetchData()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    // 添加行
    addRow() {
      this.editing = false
      this.rowObj = {
        name: null,
        headImgUrl: null
      }
      this.formDialog = true
    },
    // 编辑行
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.name = this.tableData[index].name
      this.rowObj.headImgUrl = this.tableData[index].headImgUrl
      this.formDialog = true
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该作者，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const { code } = api.post('/api/system/author/deleteAuthor', { authorId: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (this.editing) {
        const { code } = await api.post('/api/system/author/updateAuthor', this.rowObj)
        if (code === 200) {
          this.tableData[this.editingIndex] = this.rowObj
          this.rowObj = {}
          this.formDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/author/addAuthor', this.rowObj)
        if (code === 200) {
          this.rowObj = {}
          this.formDialog = false
          this.fetchData()
        }
      }
    }
  }
}
</script>
