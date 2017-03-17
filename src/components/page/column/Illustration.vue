<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchKey.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="searchKey.date" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="date" label="日期" width="140"></el-table-column>
      <el-table-column prop="author" label="作者" min-width="60"></el-table-column>
      <el-table-column prop="term" label="期数" width="80"></el-table-column>
      <el-table-column label="封面" width="80">
        <template scope="scope">
          <img :src="scope.row.imgUrl" height="80" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
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
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '插画标题', date: '2017-02-02', count: 12, author: '新周刊', term: 480, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' }
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
