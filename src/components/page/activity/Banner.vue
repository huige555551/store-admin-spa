<template>
  <div>
    <!-- Table -->
    <el-table :data="banners">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column label="跳转链接" min-width="120">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200">
        <template scope="scope">
          <img :src="scope.row.imgUrl" width="200" max-height="200" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
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
        <el-button @click="dialogFormVisible = true">添加轮播</el-button> 最多6张
      </el-form-item>
    </el-form>

    <!-- 添加轮播表单 -->
    <el-dialog title="添加轮播" v-model="dialogFormVisible">
      <el-form :model="newBanner" label-width="100px">
        <el-form-item label="跳转链接">
          <el-input v-model="newBanner.url"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="newBanner.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload action="" :file-list="newBanner.fileList">
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
      newBanner: {

      },
      banners: [
        { order: 1, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { order: 1, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { order: 1, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { order: 1, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { order: 1, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { order: 1, imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' }
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
