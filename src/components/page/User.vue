<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

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
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="users" stripe style="width: 100%">
      <el-table-column type="index" label="#" min-width="120" width="120"></el-table-column>
      <el-table-column prop="nickname" label="昵称" min-width="200"></el-table-column>
      <el-table-column prop="name" label="姓名" min-width="200"></el-table-column>
      <el-table-column prop="phone" label="电话" min-width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200"></el-table-column>
      <el-table-column label="第三方社交绑定" min-width="200">
        <template scope="scope">
          <el-tag type="success" v-if="scope.row.socials.indexOf('wechat') != -1">微信</el-tag>
          <el-tag type="primary" v-if="scope.row.socials.indexOf('sina') != -1">新浪</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="注册时间" min-width="200"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      searchKey: {
        nicnickname: '',
        phone: '',
        email: ''
      },
      users: [
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat', 'sina'], createdTime: '2017-01-01 12:30' },
        { nickname: 'A', name: 'AA', phone: '13800880088', email: 'A@A.com', socials: ['wechat'], createdTime: '2017-01-01 12:30' }
      ]
    }
  },
  methods: {
    handleSizeChange() {
    },
    handleCurrentChange() {
    }
  }
}
</script>

<style>
.plugins-tips .el-form-item {
  margin-bottom: 0px;
}
</style>
