<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>首页管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>精选视频</span>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="order" label="顺序" width="80"></el-table-column>
      <el-table-column label="视频链接" min-width="120">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="100">
        <template scope="scope">{{scope.row.length}}秒</template>
      </el-table-column>
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
        <el-button @click="addRow">添加视频</el-button> 最多{{max}}篇
      </el-form-item>
    </el-form>

    <!-- 添加表单 -->
    <el-dialog title="添加精选视频" v-model="formDialog">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="选择视频">
          <el-select v-model="rowObj.title" filterable placeholder="请输入视频标题进行搜索">
            <el-option label="选项一" value="value1"></el-option>
            <el-option label="选项二" value="value2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="rowObj.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="rowObj.length"></el-input>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="rowObj.url"></el-input>
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
      max: 5,
      // 表单
      formDialog: false,
      editing: false,
      editingIndex: null,
      rowObj: {},
      tableData: [
        // { id: 1, order: 1, title: '这是标题1', url: 'http://baidu.com', length: 90 },
        // { id: 1, order: 2, title: '这是标题2', url: 'http://baidu.com', length: 90 },
        // { id: 1, order: 3, title: '这是标题3', url: 'http://baidu.com', length: 90 },
        // { id: 1, order: 4, title: '这是标题4', url: 'http://baidu.com', length: 90 },
        // { id: 1, order: 5, title: '这是标题5', url: 'http://baidu.com', length: 90 }
      ]
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
    // 添加精选
    addRow() {
      if (this.tableData.length >= this.max) {
        return this.$notify.info({ title: '提示', message: `最多创建${this.max}篇精选文章` })
      }
      this.editing = false
      this.rowObj = {
        title: null,
        url: null,
        length: null,
        order: null
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
      this.rowObj.url = this.tableData[index].url
      this.rowObj.length = this.tableData[index].length
      this.formDialog = true
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该精选，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const { code } = api.post('/api/system/article/deleteArticle', { articleId: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (this.editing) {
        const { code } = await api.post('/api/system/article/updateNavigation', this.rowObj)
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
