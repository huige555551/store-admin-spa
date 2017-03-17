<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="position" label="位置" width="120"></el-table-column>
      <el-table-column prop="size" label="尺寸" width="120"></el-table-column>
      <el-table-column prop="advertiser" label="广告主" min-width="120"></el-table-column>
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
      <el-table-column label="状态" width="100">
        <template scope="scope">
          <el-tag type="success">上线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
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
    <el-dialog title="添加广告" v-model="dialogFormVisible">
      <el-form :model="newAd" label-width="100px">
        <el-form-item label="广告主">
          <el-input v-model="newAd.advertiser"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="newAd.url"></el-input>
        </el-form-item>
        <el-form-item label="选择位置">
          <el-select v-model="newAd.position">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="newAd.resource">
            <el-radio label="上线"></el-radio>
            <el-radio label="下线"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload action="" :file-list="newAd.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸TODO，只能上传jpg/png文件，且不超过1MB</div>
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
