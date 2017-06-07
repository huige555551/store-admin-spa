<template>
  <div>
  <!-- TODO 编辑时上下线没有显示 -->
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>网站管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>角色</span>
      </el-form-item>
    </el-form>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" width="120"></el-table-column>
      <el-table-column label="操作" min-width="160">
        <template scope="scope">
          <el-button @click.native.prevent="" type="default" size="small" @click="editRow(scope.$index,scope.row.size)">编辑</el-button>
          <el-button type="default" size="small" @click="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="$router.push('/right/role/add')">添加角色</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<style type="text/css">
  .adImg {
    display: inline-block;
    max-height: 200px;
    max-width: 200px;
  }
</style>

<script>
import api from '@/api'
import UploadSingle from '../../util/UploadSingle'

const _ = require('lodash')

export default {
  data() {
    return {
      // 表单
      editing: false,
      editingIndex: null,
      formDialog: false,
      size: null,
      newAd: {
        advertismentTypeId: null,
        ifUse: null,
        location: null,
        imgUrl: null,
        imgKey: null
      },
      // 表格
      tableData: [],
      options: [],
      positionResults: []
    }
  },
  components: {
    UploadSingle
  },
  created() {
    this.fetchData()
  },
  methods: {
    openImg(url) {
      window.open(url)
    },
    // 获取分类数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/advertisment/listAdvertisment')
      if (code === 200) {
        this.tableData = data
      }
    },
    editRow(index, size) {
      this.editing = true
      this.editingIndex = index
      this.newAd.advertismentTypeId = this.tableData[index].advertismentTypeId
      this.newAd.id = this.tableData[index].id
      this.newAd.location = this.tableData[index].location
      this.newAd.advertisers = this.tableData[index].advertisers
      this.newAd.size = this.tableData[index].size
      this.newAd.url = this.tableData[index].url
      this.newAd.ifUse = this.tableData[index].ifUse
      this.newAd.imgUrl = this.tableData[index].imgUrl
      this.newAd.imgKey = this.tableData[index].imgKey
      this.size = size
      this.formDialog = true
    },
    addRow() {
      this.editing = false
      this.newAd = {
        location: null,
        advertismentTypeId: null,
        ifUse: null,
        imgUrl: null,
        imgKey: null
      }
      this.formDialog = true
    },
    async searchPosition() {
      const { code, data } = await api.get('/api/system/advertisment/getLocation')
      if (code === 200) {
        this.positionResults = data
      }
    },
    // 添加广告时更新建议图片的尺寸提示
    async selectItem(selected) {
      const { code, data } = await api.get('/api/system/advertisment/getLocation')
      if (code === 200) {
        this.newAd.size = data[selected - 1].size
      }
    },
    // 删除广告
    async deleteRow(index) {
      this.$confirm('此操作将该删除该广告，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/advertisment/deleteAdvertisment', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      }).catch(() => {})
    },
    // 保存修改
    async saveRow() {
      if (!this.newAd.advertismentTypeId || !this.newAd.advertisers || !this.newAd.imgUrl || this.newAd.ifUse === null) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/advertisment/updateAdvertisment', this.newAd)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.newAd))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.formDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/advertisment/addAdvertisment', this.newAd)
        if (code === 200) {
          this.fetchData()
          this.formDialog = false
          this.$notify.success({ title: '成功', message: '添加成功' })
        }
      }
    },
    // 删除封面图片
    handleRemove() {
      this.newAd.imgKey = null
      this.newAd.imgUrl = null
    },
    // 封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.newAd, 'imgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.newAd, 'imgKey', response.key)
    }
  }
}
</script>
