<!-- TODO接口没开 -->
<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>网站设置</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>合作伙伴</span>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="120"></el-table-column>
      <el-table-column label="跳转链接" min-width="120">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="LOGO"  width="200">
        <template scope="scope">
          <img :src="scope.row.imgUrl" width="200" max-height="200" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
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
        <el-button @click="addRow">添加合作伙伴</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加合作伙伴 -->
    <el-dialog title="添加合作伙伴" v-model="partnerDialog">
      <el-form :model="rowObj" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="rowObj.name"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="rowObj.url"></el-input>
        </el-form-item>
        <el-form-item label="LOGO">
        <UploadSingle
            :imgUrl="rowObj.imgUrl"
            :imgKey="rowObj.imgKey"
            :size=1 dimension="240x240"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
        </UploadSingle>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native.prevent="partnerDialog=false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="saveRow">确 定</el-button>
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
      editing: false,
      editingIndex: null,
      partnerDialog: false,
      rowObj: { imgUrl: null },
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
    openImg(url) {
      window.open(url)
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/partner/listPartner')
      if (code === 200) {
        this.tableData = data
        this.total = data.total
      }
    },
    // 添加合作伙伴
    addRow() {
      this.editing = false
      this.rowObj.id = null
      this.rowObj.name = null
      this.rowObj.imgUrl = null
      this.rowObj.url = null
      this.partnerDialog = true
    },
    // 编辑
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.imgUrl = this.tableData[index].imgUrl
      this.rowObj.url = this.tableData[index].url
      this.rowObj.name = this.tableData[index].name
      this.partnerDialog = true
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将该删除该合作伙伴，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/partner/deletePartner', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 删除合作伙伴图片
    handleRemove() {
      this.rowObj.imgKey = null
      this.rowObj.imgUrl = null
    },
    // 合作伙伴图片上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.rowObj, 'imgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.rowObj, 'imgKey', response.key)
    },
    // 保存修改
    async saveRow() {
      console.log(this.rowObj)
      if (!this.rowObj.url || !this.rowObj.name || !this.rowObj.imgUrl) {
        return this.$notify.error({ title: '失败', message: '请填写完整有效的名字和链接,并上传相应logo图' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/partner/updatePartner', this.rowObj)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.partnerDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/partner/addPartner', this.rowObj)
        if (code === 200) {
          this.fetchData()
          this.partnerDialog = false
          this.$notify.success({ title: '成功', message: '添加成功' })
        }
      }
    }

  }
}
</script>
