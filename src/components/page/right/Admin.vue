<template>
  <div>
  <!-- TODO 编辑时上下线没有显示 -->
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>权限管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>管理员</span>
      </el-form-item>
    </el-form>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="role.name" label="角色" width="120"></el-table-column>
      <el-table-column prop="email" label="Email" min-width="120"></el-table-column>
      <el-table-column prop="ip" label="上次登陆IP" min-width="120"></el-table-column>
      <el-table-column prop="onlineTime" label="上次登陆时间" min-width="120"></el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="default" v-if="$isAllowUser('管理员修改')" size="small" @click="editRow(scope.$index,scope.row.size)">编辑</el-button>
          <el-button type="default" v-if="$isAllowUser('管理员删除')" size="small" @click="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px" v-if="$isAllowUser('管理员添加')">
      <el-form-item>
        <el-button @click="addRow">添加管理员</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加管理员 -->
    <el-dialog title="添加管理员" v-model="formDialog">
      <el-form :model="rowObject" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="rowObject.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="!editing">
          <el-input v-model="rowObject.password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" v-if="!editing">
          <el-input v-model="rowObject.rePassword"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="rowObject.role">
            <el-option v-for="role in roles" :label="role.name" :value="role._id" :key="role._id">{{role.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="rowObject.email"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <UploadSingle
            :imgUrl="rowObject.image"
            dimension="1440x520"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRow">确 定</el-button>
        <el-button @click="formDialog = false">取 消</el-button>
      </div>
    </el-dialog>
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

// const _ = require('lodash')

export default {
  data() {
    return {
      allowAddAdmin: false,
      roles: [],
      // 表单
      rowObject: {
        username: 'hui',
        password: '123456',
        rePassword: '123456',
        role: '',
        email: '1026367919@qq.com',
        avatarKey: '',
        image: ''
      },
      editing: false,
      editingIndex: null,
      formDialog: false,
      size: null,
      // 表格
      tableData: [],
      options: [],
      positionResults: [],
      // 分页
      currentPage: 1,
      total: 0,
      perPage: 10
    }
  },
  components: {
    UploadSingle
  },
  created() {
    this.fetchData()
  },
  mounted() {
    // debugger
    this.allowAddAdmin = this.$isAllow('管理员添加')
  },
  methods: {
    handleRemove() {
      this.rowObject.image = null
      this.rowObject.avatarKey = null
    },
    // 上传成功
    async handleSuccess(response) {
      const { code, data } = await api.get('/api/pic/getPrivateDownloadUrl', {
        key: response.key,
        fops: 'imageView2/2/w/200'
      })
      if (code === 200) {
        this.rowObject.avatarKey = response.key
        this.$set(this.rowObject, 'image', data.privateDownloadUrl)
      }
    },
    openImg(url) {
      window.open(url)
    },
    // 获取分类数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/permission/admin/list', { perPage: this.perPage, page: this.currentPage })
      if (code === 200) {
        this.tableData = data.pagingData
        this.total = data.total
        this.currentPage = data.page
      }
      const getAllRole = await api.get('/api/permission/role/all')
      if (getAllRole.code === 200) {
        this.roles = getAllRole.data
      }
    },
    async editRow(index) {
      this.editing = true
      const { code, data } = await api.get(`/api/permission/admin/${this.tableData[index]._id}`)
      if (code === 200) {
        this.rowObject = data
        this.$set(this.rowObject, 'avatarKey', this.rowObject.avatar.imageKey)
        this.$set(this.rowObject, 'image', this.rowObject.avatar.imageUrl)
        this.rowObject.role = data.role._id
      }
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
      this.$confirm('此操作将该删除该管理员，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.delete(`/api/permission/admin/delete/${this.tableData[index]._id}`)
        if (code === 204) {
          this.fetchData()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      })
    },
    // 保存修改
    async saveRow() {
      if (!this.editing && (!this.rowObject.username || !this.rowObject.password || !this.rowObject.rePassword || this.rowObject.password !== this.rowObject.rePassword || !this.rowObject.role || !this.rowObject.email || !this.rowObject.avatarKey)) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing && (!this.rowObject.username || !this.rowObject.role || !this.rowObject.email || !this.rowObject.avatarKey)) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        delete this.rowObject.password
        delete this.rowObject.avatar
        const { code } = await api.put(`/api/permission/admin/edit/${this.rowObject._id}`, this.rowObject)
        if (code === 201) {
          this.fetchData()
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.formDialog = false
        }
      } else {
        delete this.rowObject.avatar
        const { code } = await api.post('/api/permission/admin/add', this.rowObject)
        if (code === 201) {
          this.fetchData()
          this.formDialog = false
          this.$notify.success({ title: '成功', message: '添加成功' })
        }
      }
    }
  }
}
</script>
