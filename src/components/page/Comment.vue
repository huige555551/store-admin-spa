<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>文章：XXXXXXX</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="内容">
        <el-input v-model="searchKey.title" placeholder="内容"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="searchKey.date" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="user" label="用户"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="createdAt" label="时间"></el-table-column>
      <el-table-column label="操作" width="120">
        <template scope="scope">
          <el-button type="default" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
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
      searchKey: {},
      tableData: [
        { user: '用户A', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', content: '评论内容', createdAt: '2017-02-02 12:30' }
      ]
    }
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    }
  }
}
</script>
