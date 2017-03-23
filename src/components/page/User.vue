<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>用户管理</span>
      </el-form-item>
    </el-form>

    <!-- 搜索 -->
    <el-form :inline="true">
      <el-form-item label="昵称">
        <el-input v-model="searchInput.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchInput.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="searchInput.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="search">搜索</el-button>
        <el-button @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
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
          <el-tag type="success" v-if="scope.row.isBindWechat">微信</el-tag>
          <el-tag type="success" v-if="scope.row.isBindQQ">QQ</el-tag>
          <el-tag type="success" v-if="scope.row.isBindWeibo">新浪</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="registerDate" label="注册时间" width="160"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
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
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      // 搜索
      searchInput: {
        nickname: null,
        phone: null,
        email: null
      },
      searchKey: {
        nickname: null,
        phone: null,
        email: null
      },
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 清空搜索
    emptySearch() {
      this.searchInput.nickname = null
      this.searchInput.phone = null
      this.searchInput.email = null
      this.searchKey.nickname = null
      this.searchKey.phone = null
      this.searchKey.email = null
      this.currentPage = 1
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchKey.nickname = this.searchInput.nickname
      this.searchKey.phone = this.searchInput.phone
      this.searchKey.email = this.searchInput.email
      this.currentPage = 1
      this.fetchData()
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/sysUser/searchUser', {
        currentPage: this.currentPage,
        perPage: this.perPage,
        nickname: this.searchKey.nickname,
        phone: this.searchKey.phone,
        email: this.searchKey.email
      })
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
    }
  }
}
</script>
