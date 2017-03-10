<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>固定栏目</el-breadcrumb-item>
        <el-breadcrumb-item>添加漫画</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="form-box">
      <el-form ref="form" :model="comics" label-width="80px">
        <el-form-item label="漫画上传">
          <el-upload action="" list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="漫画标题">
          <el-input v-model="comics.title"></el-input>
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
      comics: {
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
