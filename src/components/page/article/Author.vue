<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="100"></el-table-column>
      <el-table-column label="头像" width="80">
        <template scope="scope">
          <img :src="scope.row.avatar" width="80" height="80" @click="openImg(scope.row.cover)" style="cursor: pointer">
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
      <el-button @click="dialogFormVisible = true" style="float: left;">添加作者</el-button>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>

    <!-- 添加作者表单 -->
    <el-dialog title="添加作者" v-model="dialogFormVisible">
      <el-form :model="newAuthor" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="newAuthor.name"></el-input>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-upload action="" :file-list="newAuthor.avatar">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸120x120，只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      dialogFormVisible: false,
      newAuthor: {
      },
      tableData: [
        { name: '作者1', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        { name: '作者2', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        { name: '作者3', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        { name: '作者4', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        { name: '作者5', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' },
        { name: '作者6', avatar: 'http://om4r3bojb.bkt.clouddn.com/avatar.jpg' }
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
