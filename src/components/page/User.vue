<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="昵称">
        <el-input v-model="searchKey.nicnickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchKey.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="searchKey.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>清空</el-button>
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
      <el-table-column prop="position" label="职位" min-width="120"></el-table-column>
      <el-table-column label="社交账号" min-width="120">
        <template scope="scope">
          <el-tag type="success" v-if="scope.row.socials.indexOf('wechat') != -1">微信</el-tag>
          <el-tag type="primary" v-if="scope.row.socials.indexOf('sina') != -1">新浪</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="注册时间" width="160"></el-table-column>
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
const request = require('superagent')

export default {
  data() {
    return {
      total: 0,
      perPage: 10,
      currentPage: 1,
      searchKey: {
        nicnickname: null,
        phone: null,
        email: null
      },
      tableData: [
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', company: '公司', position: '职位', socials: ['wechat'], createdTime: '2017-01-01 12:30' }
      ]
    }
  },
  created() {
    console.log('TODO with fetching API')
  },
  methods: {
    fetchData() {
      this.tableData = []
      request
        .get('/api/system/sysUser/seachUser')
        .query(this.searchKey)
        .query({ currentPage: this.currentPage })
        .query({ perPage: this.perPage })
        .end((err, res) => {
          if (err || res.body.status.errCode !== 200) {
            return this.$notify.error({ title: '警告', message: '网络似乎出现问题~' })
          }
          const data = res.body.data
          this.total = data.total
          this.tableData = data.array
        })
    },
    handleSizeChange() {
    },
    handleCurrentChange() {
    }
  }
}
</script>
