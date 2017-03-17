<template>
  <div>
    <el-form ref="form" :model="magazine" label-width="100px" style="width: 500px;">
      <el-form-item label="封面上传">
        <el-upload action="" :file-list="magazine.fileList" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸520x676，只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="magazine.year" type="date" placeholder="选择年"></el-date-picker>
      </el-form-item>
      <el-form-item label="封面标题">
        <el-input v-model="magazine.title"></el-input>
      </el-form-item>
      <el-form-item label="期数">
        <el-input v-model="magazine.term"></el-input>
      </el-form-item>
      <el-form-item label="购买链接">
        <el-input v-model="magazine.buyUrl"></el-input>
      </el-form-item>
      <el-form-item label="杂志故事">
        <el-input type="textarea" :rows="4" v-model="magazine.story"></el-input>
      </el-form-item>
      <el-form-item label="故事图片">
        <el-upload action="" :file-list="magazine.fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸560x440，只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="杂志目录">
        <el-input type="textarea" :rows="4" v-model="magazine.story"></el-input>
      </el-form-item>
      <el-form-item label="目录图片">
        <el-upload action="" :file-list="magazine.fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸560x440，只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      magazine: {
        title: '',
        term: '',
        buyUrl: '',
        story: '',
        year: '2017',
        fileList: []
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // TODO 突然离开未保存，提示管理员
    console.log('leave')
    next()
  }
}
</script>
