<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="名字" min-width="120"></el-table-column>
      <el-table-column label="跳转链接" min-width="120">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="LOGO"  width="200">
        <template scope="scope">
          <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
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
        <el-button @click="dialogFormVisible = true">添加合作伙伴</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加合作伙伴 -->
    <el-dialog title="添加合作伙伴" v-model="dialogFormVisible">
      <el-form :model="newPartner" label-width="100px">
        <el-form-item label="名字">
          <el-input v-model="newPartner.name"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="newPartner.url"></el-input>
        </el-form-item>
        <el-form-item label="LOGO">
          <el-upload action="" :file-list="newPartner.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
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
      dialogFormVisible: false,
      newPartner: {
      },
      tableData: [
        { name: '合作伙伴1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴5', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴6', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' }
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
