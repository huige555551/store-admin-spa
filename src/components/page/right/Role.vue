<template>
  <div>
  <!-- TODO 编辑时上下线没有显示 -->
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>权限管理</span>
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
          <el-button type="default" v-if="$isAllowUser('管理员修改')" size="small" @click="$router.push(`/right/role/edit/${scope.row._id}`)">编辑</el-button>
          <el-button type="default" v-if="$isAllowUser('管理员删除')" size="small" @click="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px" v-if="$isAllowUser('角色添加')">
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
      const { code, data } = await api.get('/api/permission/role/all')
      if (code === 200) {
        this.tableData = data
      }
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
    // 删除广告
    async deleteRow(index) {
      this.$confirm('此操作将该删除该角色，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.delete('/api/permission/role/delete/' + this.tableData[index]._id)
        if (code === 204) {
          this.fetchData()
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
