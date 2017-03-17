<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchKey.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="期数">
        <el-input v-model="searchKey.term" placeholder="期数"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="searchKey.author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
      <el-table-column prop="column" label="栏目" width="100"></el-table-column>
      <el-table-column prop="term" label="期数" width="80"></el-table-column>
      <el-table-column prop="author" label="作者" min-width="90"></el-table-column>
      <el-table-column prop="createdAt" label="时间" width="160"></el-table-column>
      <el-table-column label="封面" width="200">
        <template scope="scope">
          <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="预览" width="80">
        <template scope="scope">
          <el-button type="default" @click.native.prevent = "articleDialog = true" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="评论管理" width="120">
        <template scope="scope">
          <el-button type="default" size="small">评论管理</el-button>
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
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>

    <!-- 预览dialog -->
    <el-dialog title="文章信息" v-model="articleDialog">
      <el-form label-width="100px">
        <el-form-item label="封面">
          <img src="http://om4r3bojb.bkt.clouddn.com/index-banner.jpg" style="max-width: 200px; max-height: 200px">
        </el-form-item>
        <el-form-item label="标题">
          <span>文章标题</span>
        </el-form-item>
        <el-form-item label="栏目">
          <span>栏目</span>
        </el-form-item>
        <el-form-item label="期数">
          <span>480</span>
        </el-form-item>
        <el-form-item label="作者">
          <span>#新周刊</span>
        </el-form-item>
        <el-form-item label="发布时间">
          <span>2017-03-03 12:30</span>
        </el-form-item>
        <el-form-item label="内容">
          <p v-html="content"></p>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articleDialog: false,
      currentPage: 1,
      searchKey: {},
      content: '<p>123456</p><p>123456</p>',
      tableData: [
        { title: '这是标题1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '栏目', author: '新周刊', term: '480', createdAt: '2017-02-02 12:30' },
        { title: '这是标题2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '栏目', author: '新周刊', term: '480', createdAt: '2017-02-02 12:30' },
        { title: '这是标题3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '栏目', author: '新周刊', term: '480', createdAt: '2017-02-02 12:30' },
        { title: '这是标题4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '栏目', author: '新周刊', term: '480', createdAt: '2017-02-02 12:30' },
        { title: '这是标题5', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '栏目', author: '新周刊', term: '480', createdAt: '2017-02-02 12:30' },
        { title: '这是标题6', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', column: '栏目', author: '新周刊', term: '480', createdAt: '2017-02-02 12:30' }
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
