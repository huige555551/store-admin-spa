<template>
  <div>
    <el-form ref="form" :model="book" label-width="100px" style="width: 500px;">
      <el-form-item label="封面上传">
        <el-upload action="" :file-list="book.fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸520x676，只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="封面标题">
        <el-input v-model="book.title"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="book.author"></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="book.publisher"></el-input>
      </el-form-item>
      <el-form-item label="出版时间">
        <el-date-picker v-model="book.time" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="购买链接">
        <el-input v-model="book.buyUrl"></el-input>
      </el-form-item>
      <el-form-item label="豆瓣链接">
        <el-input v-model="book.doubanUrl"></el-input>
      </el-form-item>
      <el-form-item label="图书介绍">
        <el-input type="textarea" :rows="4" v-model="book.story"></el-input>
      </el-form-item>
      <el-form-item label="介绍图片">
        <el-upload action="" :file-list="book.fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸560x440，只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="图书目录">
        <el-input type="textarea" :rows="4" v-model="book.story"></el-input>
      </el-form-item>
      <el-form-item label="目录图片">
        <el-upload action="" :file-list="book.fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸560x440，只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: {
        title: '',
        term: '',
        buyUrl: '',
        story: '',
        year: '2017',
        fileList: []
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message.success('提交成功！')
    }
  },
  beforeRouteLeave(to, from, next) {
    // TODO 突然离开未保存，提示管理员
    console.log('leave')
    next()
  }
}
</script>
