<template>
  <div>
  <!-- TODO 编辑时上下线没有显示 -->
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>网站管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>广告设置</span>
      </el-form-item>
    </el-form>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="location" label="位置" width="120"></el-table-column>
      <el-table-column prop="size" label="尺寸" width="120"></el-table-column>
      <el-table-column prop="advertisers" label="广告主" min-width="120"></el-table-column>
      <el-table-column label="跳转链接" min-width="120">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200">
        <template scope="scope">
          <img :src="scope.row.imgUrl" width="200" max-height="200" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template scope="scope">
          <el-tag v-if="scope.row.ifUse" type="success">上线</el-tag>
          <el-tag v-if="!scope.row.ifUse" type="gray">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button @click.native.prevent="" type="default" size="small" @click="editRow(scope.$index)">编辑</el-button>
          <el-button type="default" size="small" @click="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="addRow">添加广告</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加轮播表单 -->
    <el-dialog title="添加广告" v-model="formDialog">
      <el-form :model="newAd" label-width="100px">
        <el-form-item label="广告主">
          <el-input v-model="newAd.advertisers"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="newAd.url"></el-input>
        </el-form-item>
        <el-form-item label="选择位置">
          <el-select v-model="newAd.advertismentTypeId" filterable remote
            placeholder="请输入文章标题搜索"
            :remote-method="searchPosition">
            <el-option
              v-for="item in positionResults"
              :key="item.advertismentTypeId"
              :label="item.location"
              :value="item.advertismentTypeId"
              :disabled="item.ifUse">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="newAd.ifUse">
            <el-radio :label="true">上线</el-radio>
            <el-radio :label="false">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传图片">
          <UploadSingle
            :imgUrl="newAd.imgUrl"
            :imgKey="newAd.imgKey"
            :size=1 
            :dimension="newAd.size" name="article"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
          <div slot="tip" class="el-upload__tip">建议尺寸TODO，只能上传jpg/png文件，且不超过1MB</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRow">确 定</el-button>
        <el-button @click="formDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

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
    // 获取分类数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/advertisment/listAdvertisment')
      if (code === 200) {
        this.tableData = data
      }
    },
    editRow(index) {
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
      this.formDialog = true
    },
    addRow() {
      this.editing = false
      this.newAd = {
        location: null,
        advertismentTypeId: null,
        ifUse: null
      }
      this.formDialog = true
    },
    async searchPosition() {
      const { code, data } = await api.get('/api/system/advertisment/listAdvertisment')
      if (code === 200) {
        this.positionResults = data
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
      if (!this.newAd.advertismentTypeId || !this.newAd.advertisers || !this.newAd.imgUrl) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/advertisment/updateAdvertisment', this.newAd)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.newAd))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.formDialog = false
          // this.fetchData()
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
