<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>网站设置</el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Table -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="position" label="位置" width="120"></el-table-column>
      <el-table-column prop="size" label="尺寸" width="120"></el-table-column>
      <el-table-column prop="advertiser" label="广告主" width="120"></el-table-column>
      <el-table-column label="跳转链接" width="120">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200">
        <template scope="scope">
          <img :src="scope.row.imgUrl" width="200" max-height="200" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="上线" width="120">
        <template scope="scope">
          <el-switch v-model="scope.row.isOn" on-color="#13ce66" off-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button @click.native.prevent="" type="default" size="small">编辑</el-button>
          <el-button type="default" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="dialogFormVisible = true">添加广告</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加轮播表单 -->
    <el-dialog title="添加广告" v-model="dialogFormVisible" label-position="right">
      <el-form :model="newAd" style="width: 500px">
        <el-form-item label="广告主" label-width="120px">
          <el-input v-model="newAd.advertiser"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" label-width="120px">
          <el-input v-model="newAd.url"></el-input>
        </el-form-item>
        <el-form-item label="选择位置" label-width="120px">
          <el-select v-model="newAd.position">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" label-width="120px">
          <el-upload action="" :file-list="newAd.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸TODO，只能上传jpg/png文件，且不超过1MB</div>
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
      options: [
        { id: '1', value: '选项1', label: '选项1', disabled: false },
        { id: '2', value: '选项2', label: '选项2', disabled: true },
        { id: '3', value: '选项3', label: '选项3', disabled: true },
        { id: '4', value: '选项4', label: '选项4', disabled: true },
        { id: '5', value: '选项5', label: '选项5', disabled: false }
      ],
      newAd: {},
      dialogFormVisible: false,
      tableData: [
        { position: '位置1', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', size: '120x120', url: 'http://baidu.com', advertiser: '新周刊', isOn: true },
        { position: '位置2', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', size: '120x120', url: 'http://baidu.com', advertiser: '新周刊', isOn: true },
        { position: '位置3', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', size: '120x120', url: 'http://baidu.com', advertiser: '新周刊', isOn: true },
        { position: '位置4', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', size: '120x120', url: 'http://baidu.com', advertiser: '新周刊', isOn: true },
        { position: '位置5', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', size: '120x120', url: 'http://baidu.com', advertiser: '新周刊', isOn: true },
        { position: '位置6', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', size: '120x120', url: 'http://baidu.com', advertiser: '新周刊', isOn: true }
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
