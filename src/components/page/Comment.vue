<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>评论管理</span>
      </el-form-item>
      <el-form-item label="文章：">
        <span>去寺院喝咖啡，听爵士煮老茶</span>
      </el-form-item>
    </el-form>

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
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column label="头像" width="80">
        <template scope="scope">
          <img :src="scope.row.avatar" width="48" height="48" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="user" label="用户" min-width="100"></el-table-column>
      <el-table-column prop="content" label="内容" min-width="140"></el-table-column>
      <el-table-column prop="createdAt" label="时间" width="160"></el-table-column>
      <el-table-column label="操作" width="100">
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
        { user: '用户A', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg', content: '评论内容', createdAt: '2017-02-02 12:30' },
        { user: '用户A', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg', content: '评论内容', createdAt: '2017-02-02 12:30' }
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
