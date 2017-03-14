<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>栏目文章</el-breadcrumb-item>
        <el-breadcrumb-item>栏目列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Table -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="name" label="名字"></el-table-column>
      <el-table-column prop="order" label="顺序"></el-table-column>
      <el-table-column label="海报">
        <template scope="scope">
          <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
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
        <el-button @click="dialogFormVisible = true">添加栏目</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加栏目表单 -->
    <el-dialog title="添加栏目" v-model="dialogFormVisible" label-position="right">
      <el-form :model="newColumn" style="width: 500px">
        <el-form-item label="名字" label-width="120px">
          <el-input v-model="newColumn.name"></el-input>
        </el-form-item>
        <el-form-item label="顺序" label-width="120px">
          <el-input v-model="newColumn.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
        <el-form-item label="上传海报" label-width="120px">
          <el-upload action="" :file-list="newColumn.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸1440x320，只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
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
      newColumn: {
      },
      tableData: [
        { name: '这是栏目1', order: 1, cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg' },
        { name: '这是栏目2', order: 1, cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg' },
        { name: '这是栏目3', order: 1, cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg' },
        { name: '这是栏目4', order: 1, cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg' },
        { name: '这是栏目5', order: 1, cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg' },
        { name: '这是栏目6', order: 1, cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg' }
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
