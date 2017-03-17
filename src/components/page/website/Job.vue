<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="名字" min-width="120"></el-table-column>
      <el-table-column label="操作" width="160">
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
    <el-dialog title="添加轮播" v-model="dialogFormVisible">
      <el-form :model="newJob" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="newJob.name"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述">
          <el-input type="textarea" :rows="6" v-model="newJob.description"></el-input>
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
