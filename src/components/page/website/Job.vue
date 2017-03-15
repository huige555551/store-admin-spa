<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>网站设置</el-breadcrumb-item>
        <el-breadcrumb-item>岗位列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Table -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="title" label="名字"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="default" size="small">编辑</el-button>
          <el-button type="default" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="dialogFormVisible = true">添加岗位</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加栏目表单 -->
    <el-dialog title="添加轮播" v-model="dialogFormVisible" label-position="right">
      <el-form :model="newJob" style="width: 500px">
        <el-form-item label="名字" label-width="120px">
          <el-input v-model="newJob.name"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述" label-width="120px">
          <el-input type="textarea" :rows="6" v-model="newJob.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      newJob: {
      },
      tableData: [
        { title: '岗位1', description: '123456' },
        { title: '岗位2', description: '123456' },
        { title: '岗位3', description: '123456' },
        { title: '岗位4', description: '123456' },
        { title: '岗位5', description: '123456' },
        { title: '岗位6', description: '123456' }
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
