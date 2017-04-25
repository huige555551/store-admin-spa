<template>
  <div>
  <!-- TODO 编辑时候是否上线没有显示出来 -->
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
          <el-tag v-if="scope.row.ifUse" type="success">上线</el-tag>
          <el-tag v-if="!scope.row.ifUse" type="gray">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="海报" width="200">
        <template scope="scope">
          <img class="posture" :src="scope.row.bannerUrl" width="200" max-height="200" @click="openImg(scope.row.bannerUrl)" style="cursor: pointer">
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
          <el-radio-group v-model="rowObj.ifUse">
            <el-radio :label="true">上线</el-radio>
            <el-radio :label="false">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传海报">
          <UploadSingle
            :imgUrl="rowObj.bannerUrl"
            :imgKey="rowObj.banner"
            :size=1 dimension="1440x320" name="article"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
          <div slot="tip" class="el-upload__tip">建议尺寸1440x320，只能上传jpg/png文件，且不超过1MB</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="saveRow">确 定</el-button>
        <el-button @click.native.prevent="formDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style type="text/css">
  .posture {
    width: 250px;
    height: 100px;
    display: inline-block;
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
      formDialog: false,
      editing: false,
      editingIndex: null,
      rowObj: {
        ifUse: null,
        bannerUrl: null
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
      this.rowObj = { ifUse: null }
      this.formDialog = true
    },
    // 编辑行
    editRow(index) {
      this.editing = true
      this.editingIndex = index
      this.rowObj.id = this.tableData[index].id
      this.rowObj.name = this.tableData[index].name
      this.rowObj.order = this.tableData[index].order
      this.rowObj.ifUse = this.tableData[index].ifUse
      this.rowObj.bannerUrl = this.tableData[index].bannerUrl
      this.formDialog = true
    },
    // 删除行
    async deleteRow(index) {
      this.$confirm('此操作将会清空与该栏目有关的所有文章，请谨慎操作，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async() => {
        const { code } = await api.post('/api/system/article/deleteNavigation', { id: this.tableData[index].id })
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.tableData.splice(index, 1)
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 保存行
    async saveRow() {
      if (!this.rowObj.name || !this.rowObj.order || !this.rowObj.bannerUrl) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/article/updateNavigation', this.rowObj)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.rowObj))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.rowObj = { ifUse: null }
          this.formDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/article/addNavigation', this.rowObj)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.fetchData()
          this.rowObj = { ifUse: null }
          this.formDialog = false
        }
      }
    },
    handleRemove() {
      this.rowObj.bannerUrl = null
      this.rowObj.banner = null
    },
    handleSuccess(response, bucketPort) {
      this.$set(this.rowObj, 'bannerUrl', `${bucketPort}/${response.key}`)
      this.$set(this.rowObj, 'banner', response.key)
    }
  }
}
</script>
