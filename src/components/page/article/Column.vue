<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>栏目文章</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>栏目列表</span>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="100"></el-table-column>
      <el-table-column prop="order" label="顺序" width="80"></el-table-column>
      <el-table-column label="状态" width="80">
        <template scope="scope">
          <el-tag v-if="scope.row.isUse" type="success">上线</el-tag>
          <el-tag v-if="!scope.row.isUse" type="gray">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="海报" width="200">
        <template scope="scope">
          <img :src="scope.row.bannerUrl" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
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
        <el-button @click="addRow">添加栏目</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加表单 -->
    <el-dialog title="添加栏目" v-model="formDialog">
      <el-form :model="rowObj" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="rowObj.name"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="rowObj.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="rowObj.isUse">
            <el-radio :label="true">上线</el-radio>
            <el-radio :label="false">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传海报">
          <el-upload action="" :file-list="rowObj.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸1440x320，只能上传jpg/png文件，且不超过1MB</div>
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
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    // 获取数据
    async fetchData() {
      const { code, data } = await api.get('/api/system/article/listNavigation')
      if (code === 200) {
        this.tableData = data
      }
    },
    // 添加行
    addRow() {
      this.editing = false
      this.rowObj = {
        name: null,
        order: 1,
        isUse: true,
        bannerUrl: null
      }
      this.formDialog = true
    },
    // 编辑行
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.name = this.tableData[index].name
      this.rowObj.order = this.tableData[index].order
      this.rowObj.isUse = this.tableData[index].isUse
      this.rowObj.bannerUrl = this.tableData[index].bannerUrl
      this.formDialog = true
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该栏目，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const { code } = api.post('/api/system/article/deteleNavigation', { id: this.tableData[index].id })
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
        const { code, data } = await api.post('/api/system/article/addNavigation', this.rowObj)
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
