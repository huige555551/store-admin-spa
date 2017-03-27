<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>首页管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>轮播管理</span>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="160"></el-table-column>
      <el-table-column prop="content" label="描述" min-width="160"></el-table-column>
      <el-table-column prop="author" label="作者" min-width="100"></el-table-column>
      <el-table-column prop="order" label="顺序" width="70"></el-table-column>
      <el-table-column label="跳转链接" min-width="160">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200">
        <template scope="scope">
          <img :src="scope.row.imgUrl + '?imageView2/2/w/200/h/200'" width="200" max-height="200" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button type="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="addRow">添加轮播</el-button> 最多{{max}}张
      </el-form-item>
    </el-form>

    <!-- 添加表单 -->
    <el-dialog title="添加轮播" v-model="formDialog">
      <el-form :model="rowObj" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="rowObj.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="rowObj.content"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="rowObj.url"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="rowObj.author"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="rowObj.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <UploadSingle
            :imgUrl="rowObj.imgUrl"
            :imgKey="rowObj.imgKey"
            :size=1 dimension="1440x520"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
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
      max: 6,
      // 表单
      formDialog: false,
      editing: false,
      editingIndex: null,
      rowObj: {
        imgUrl: null, // data内声明，允许子组件跟踪值变化
        imgKey: null // data内声明，允许子组件跟踪值变化
      },
      // 表格
      tableData: []
    }
  },
  components: {
    UploadSingle
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    // 获取轮播数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/banner/listBanner', { type: 1 })
      if (code === 200) {
        this.tableData = data
      }
    },
    // 删除图片
    handleRemove() {
      this.rowObj.imgKey = null
      this.rowObj.imgUrl = null
    },
    // 上传成功
    handleSuccess(response, bucketPort) {
      this.rowObj.imgKey = response.key
      this.rowObj.imgUrl = `${bucketPort}/${response.key}`
    },
    // 添加轮播
    addRow() {
      if (this.tableData.length >= this.max) {
        return this.$notify.info({ title: '提示', message: `最多创建${this.max}张轮播` })
      }
      this.editing = false
      this.rowObj.title = null
      this.rowObj.imgUrl = null
      this.rowObj.imgKey = null
      this.rowObj.content = null
      this.rowObj.url = null
      this.rowObj.author = null
      this.rowObj.order = null
      this.formDialog = true
    },
    // 编辑轮播
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.title = this.tableData[index].title
      this.rowObj.imgUrl = this.tableData[index].imgUrl
      this.rowObj.imgKey = this.tableData[index].imgKey
      this.rowObj.content = this.tableData[index].content
      this.rowObj.url = this.tableData[index].url
      this.rowObj.author = this.tableData[index].author
      this.rowObj.order = this.tableData[index].order
      this.formDialog = true
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该轮播，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/banner/deleteBanner', { bannerId: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (!this.rowObj.imgUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      }
      this.rowObj.type = 1
      if (this.editing) {
        const { code } = await api.post('/api/system/banner/updateBanner', this.rowObj)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
          this.formDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/banner/addBanner', this.rowObj)
        if (code === 200) {
          this.fetchData()
          this.formDialog = false
        }
      }
    }
  }
}
</script>
