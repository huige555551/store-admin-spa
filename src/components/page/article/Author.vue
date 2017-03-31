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
    <!-- 搜索 -->
    <!-- TODO搜索接口待开 分页总数 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="作者">
        <el-input v-model="searchInput.name" placeholder="作者名字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="search">搜索</el-button>
        <el-button  @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="100"></el-table-column>
      <el-table-column label="头像" width="120">
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
          <UploadSingle
            :imgUrl="rowObj.headImgUrl"
            :imgKey="rowObj.headImgKey"
            :size=1 dimension="240x240"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
          <div slot="tip" class="el-upload__tip">建议尺寸120x120，只能上传jpg/png文件，且不超过1MB</div>
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
import UploadSingle from '@/components/util/UploadSingle'

const _ = require('lodash')

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
      rowObj: {
        headImgUrl: '',
        headImgKey: ''
      },
      // 表格
      tableData: [],
      searchInput: {},
      searchKey: {}
    }
  },
  components: {
    UploadSingle
  },
  async created() {
    this.fetchData()
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    search() {
      this.searchKey.name = this.searchInput.name
      this.fetchData()
    },
    emptySearch() {
      this.searchInput.name = null
      this.searchKey.name = null
      this.currentPage = 1
      this.tableData = []
      this.fetchData()
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/author/listAuthor', { currentPage: this.currentPage, perPage: this.perPage, authorName: this.searchKey.name })
      if (code === 200) {
        this.tableData = data.array
        this.total = data.total
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
      this.rowObj.headImgKey = this.tableData[index].headImgKey
      this.formDialog = true
    },
    // 删除行
    async deleteRow(index) {
      console.log(this.tableData[index], index)
      this.$confirm('此操作将会清空与该作者有关的所有数据，请谨慎操作，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async() => {
        const { code } = await api.post('/api/system/author/deleteAuthor', { authorId: this.tableData[index].id })
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.tableData.splice(index, 1)
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      console.log(this.rowObj)
      if (!this.rowObj.name || !this.rowObj.headImgUrl) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/author/updateAuthor', this.rowObj)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
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
    },
    // 删除用户头像
    handleRemove() {
      this.rowObj.headImgUrl = null
      this.rowObj.headImgKey = null
    },
    // 用户头像上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.rowObj, 'headImgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.rowObj, 'headImgKey', response.key)
    }
  }
}
</script>
