<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchKey.title" placeholder="标题"></el-input>
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
      <el-table-column prop="publisher" label="出版社" min-width="100"></el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="author" label="作者" width="120"></el-table-column>
      <el-table-column prop="time" label="出版时间" width="120"></el-table-column>
      <el-table-column label="封面" width="120">
        <template scope="scope">
          <img :src="scope.row.imgUrl" height="80" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="预览" width="80">
        <template scope="scope">
          <el-button type="default" @click.native.prevent = "bookDialog = true" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="发布时间" width="120"></el-table-column>
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

    <!--BookDialog -->
    <el-dialog title="图书信息" v-model="bookDialog">
      <el-form label-width="80px">
        <el-form-item label="封面">
          <img src="http://om4r3bojb.bkt.clouddn.com/magazine.jpg" style="max-width: 200px; max-height: 200px">
        </el-form-item>
        <el-form-item label="标题">
          <span>图书标题</span>
        </el-form-item>
        <el-form-item label="做账">
          <span>新周刊</span>
        </el-form-item>
        <el-form-item label="出版社">
          <span>出版社</span>
        </el-form-item>
        <el-form-item label="价格">
          <span>27.00</span>
        </el-form-item>
        <el-form-item label="出版时间">
          <span>#2017-02-02</span>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      bookDialog: false,
      tableData: [
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' },
        { title: '图书标题', price: '27.00', publisher: '新周刊', author: '新周刊', time: '2017-02-02', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/magazine.jpg' }
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
