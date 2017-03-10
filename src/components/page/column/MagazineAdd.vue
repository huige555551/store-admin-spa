<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>固定栏目</el-breadcrumb-item>
        <el-breadcrumb-item>添加封面</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="form-box">
      <el-form ref="form" :model="magazine" label-width="80px">
        <el-form-item label="封面上传">
          <el-upload action="" :file-list="magazine.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="年份">
          <el-date-picker v-model="magazine.year" type="year" placeholder="选择年"></el-date-picker>
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
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="杂志目录">
          <el-input type="textarea" :rows="4" v-model="magazine.story"></el-input>
        </el-form-item>
        <el-form-item label="目录图片">
          <el-upload action="" :file-list="magazine.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
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
  methods: {
    onSubmit() {
      this.$message.success('提交成功！')
    }
  }
}
</script>
