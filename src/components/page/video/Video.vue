<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchKey.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="栏目">
        <el-select v-model="searchKey" filterable placeholder="请输入栏目进行搜索">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
        </el-select>
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
      <el-table-column prop="category" label="分类" width="100"></el-table-column>
      <el-table-column prop="length" label="时长" width="120"></el-table-column>
      <el-table-column label="封面" width="200">
        <template scope="scope">
          <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="时间" width="160"></el-table-column>
      <el-table-column label="评论管理" width="140">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      searchKey: {},
      tableData: [
        { title: '这是标题1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', createdAt: '2017-02-02 12:30' },
        { title: '这是标题2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', createdAt: '2017-02-02 12:30' },
        { title: '这是标题3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', createdAt: '2017-02-02 12:30' },
        { title: '这是标题4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', createdAt: '2017-02-02 12:30' },
        { title: '这是标题5', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', createdAt: '2017-02-02 12:30' },
        { title: '这是标题6', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', createdAt: '2017-02-02 12:30' }
      ],
      options: [
        { id: '1', value: '选项1', label: '选项1' },
        { id: '2', value: '选项2', label: '选项2' },
        { id: '3', value: '选项3', label: '选项3' },
        { id: '4', value: '选项4', label: '选项4' },
        { id: '5', value: '选项5', label: '选项5' }
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
