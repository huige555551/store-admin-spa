<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Table -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="column" label="分类"></el-table-column>
      <el-table-column label="封面">
        <template scope="scope">
          <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="时间" width="200"></el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button type="default" size="small">编辑</el-button>
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
        { title: '这是标题1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '分类', createdAt: '2017-02-02 12:30' },
        { title: '这是标题2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '分类', createdAt: '2017-02-02 12:30' },
        { title: '这是标题3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '分类', createdAt: '2017-02-02 12:30' },
        { title: '这是标题4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '分类', createdAt: '2017-02-02 12:30' },
        { title: '这是标题5', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '分类', createdAt: '2017-02-02 12:30' },
        { title: '这是标题6', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '分类', createdAt: '2017-02-02 12:30' }
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
