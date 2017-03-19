<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="params">
      <el-form-item label="昵称">
        <el-input v-model="params.nicnickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="params.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="params.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="fetchData">搜索</el-button>
        <el-button @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="nickname" label="昵称" min-width="100"></el-table-column>
      <el-table-column prop="realname" label="姓名" min-width="100"></el-table-column>
      <el-table-column prop="phone" label="电话" width="140"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="140"></el-table-column>
      <el-table-column prop="company" label="公司" min-width="120"></el-table-column>
      <el-table-column prop="job" label="职位" min-width="120"></el-table-column>
      <el-table-column label="社交账号" min-width="120">
        <template scope="scope">
          <el-tag type="success" v-if="scope.row.hasBindWechat">微信</el-tag>
          <el-tag type="success" v-if="scope.row.hasBindQQ">QQ</el-tag>
          <el-tag type="success" v-if="scope.row.hasBindWeibo">新浪</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="registerDate" label="注册时间" width="160"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="params.perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      total: 0,
      params: {
        perPage: 10,
        currentPage: 1,
        nicnickname: null,
        phone: null,
        email: null
      },
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    emptySearch() {
      this.params.nickname = null
      this.params.phone = null
      this.params.email = null
    },
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/sysUser/seachUser', this.params)
      if (code === 200) {
        this.tableData = data
      }
    },
    handleSizeChange(val) {
      this.perPage = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
</script>
