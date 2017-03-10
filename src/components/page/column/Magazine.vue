<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>固定栏目</el-breadcrumb-item>
        <el-breadcrumb-item>封面列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="年份">
        <el-input v-model="searchKey.year" placeholder="年份"></el-input>
      </el-form-item>
      <el-form-item label="期号">
        <el-input v-model="searchKey.term" placeholder="期号"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="searchKey.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="term" label="期号"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column label="封面">
        <template scope="scope">
          <img :src="scope.row.imgUrl" height="80" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="default" size="small">编辑</el-button>
          <el-button type="default" size="small">删除</el-button>
        </template>
      </el-table-column>
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
        year: '',
        term: '',
        title: ''
      },
      tableData: [
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '封面标题', term: '480', date: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' }
      ]
    }
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
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
