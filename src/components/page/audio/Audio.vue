<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchKey">
      <el-form-item label="标题">
        <el-input v-model="searchInput.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="栏目">
        <el-select v-model="value" filterable placeholder="请输入栏目进行搜索">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id" v-model="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="search">搜索</el-button>
        <el-button  @click.native.prevent="emptySearch">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="category" label="分类" width="100"></el-table-column>
      <el-table-column prop="time" label="时长" width="120"></el-table-column>
      <el-table-column label="封面" width="200">
        <template scope="scope">
          <img :src="scope.row.coverUrl" width="200" max-height="200" @click="openImg(scope.row.coverUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="publicationDate" label="时间" width="160"></el-table-column>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      currentPage: 1,
      total: 0,
      perPage: 10,
      searchInput: {
        id: 1,
        title: null,
        catergory: null
      },
      searchKey: {
        id: null,
        title: null,
        catergory: null
      },
      tableData: [
        { title: '这是标题1', coverUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', publicationDate: '2017-02-02 12:30', time: '120' },
        { title: '这是标题2', coverUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', publicationDate: '2017-02-02 12:30', time: '120' },
        { title: '这是标题3', coverUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', publicationDate: '2017-02-02 12:30', time: '120' },
        { title: '这是标题4', coverUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', publicationDate: '2017-02-02 12:30', time: '120' },
        { title: '这是标题5', coverUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', publicationDate: '2017-02-02 12:30', time: '120' },
        { title: '这是标题6', coverUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '栏目', length: '20"20"', publicationDate: '2017-02-02 12:30', time: '120' }
      ],
      options: [
        { id: '1', value: '选项1', label: '1' },
        { id: '2', value: '选项2', label: '2' },
        { id: '3', value: '选项3', label: '3' },
        { id: '4', value: '选项4', label: '4' },
        { id: '5', value: '选项5', label: '5' }
      ],
      value: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    openImg(url) {
      window.open(url)
    },
    search() {
      this.searchKey.title = this.searchInput.title
      this.searchKey.category = this.searchInput.catergory
      this.fetchData()
    },
    emptySearch() {
      this.searchInput.title = null
      this.searchInput.category = null
      this.searchKey.title = null
      this.searchKey.category = null
      this.currentPage = 1
      this.tableData = []
    },
    // 获取数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/audio/searchAudio', {
        currentPage: this.currentPage,
        perPage: this.perPage,
        title: this.searchKey.title,
        navigationId: this.searchKey.catergory
      })
      if (code === 200) {
        this.tableData = data.array
        console.log(this.tableData)
        this.total = data.total
      }
    },
    // 分页
    handleSizeChange(val) {
      this.perPage = val
      this.total = this.total / val
      this.currentPage = 1
      this.fetchData()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
</script>
