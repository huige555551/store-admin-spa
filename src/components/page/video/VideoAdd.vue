<template>
  <div>
    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" :model="video" label-width="100px" style="width: 500px;">
        <el-form-item label="封面上传">
          <el-upload action="" :file-list="video.cover">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸268x150，只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-select v-model="searchKey" filterable placeholder="请输入分类进行搜索">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频标题">
          <el-input v-model="video.title"></el-input>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="video.length"></el-input>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="video.url"></el-input>
        </el-form-item>
        <el-form-item label="视频摘要">
          <el-input type="textarea" :rows="4" v-model="video.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Simditor from '../../util/Simditor'

export default {
  data() {
    return {
      searchKey: '',
      video: {
      },
      options: [
        { id: '1', value: '选项1', label: '选项1' },
        { id: '2', value: '选项2', label: '选项2' },
        { id: '3', value: '选项3', label: '选项3' },
        { id: '4', value: '选项4', label: '选项4' },
        { id: '5', value: '选项5', label: '选项5' }
      ],
      initContent: '<p>123456</p>',
      options2: {
        placeHolder: '输入文章内容',
        toolbarFloat: false,
        upload: true,
        // toolbar: ['title', 'image'],
        cleanPaste: true
      }
    }
  },
  components: {
    Simditor
  },
  methods: {
    onSubmit() {
      this.$message.success('提交成功！')
    },
    change(val) {
      console.log(val)
    }
  }
}
</script>
