<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="100"></el-table-column>
      <el-table-column prop="order" label="顺序" width="80"></el-table-column>
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
        <el-button @click="dialogFormVisible = true">添加分类</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加栏目表单 -->
    <el-dialog title="添加分类" v-model="dialogFormVisible">
      <el-form :model="newColumn" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="newColumn.name"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="newColumn.order" placeholder="输入数字，数字越大越排前"></el-input>
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
      newColumn: {
      },
      tableData: [
        { order: 1, name: '这是分类1' },
        { order: 1, name: '这是分类2' },
        { order: 1, name: '这是分类3' },
        { order: 1, name: '这是分类4' },
        { order: 1, name: '这是分类5' },
        { order: 1, name: '这是分类6' }
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
