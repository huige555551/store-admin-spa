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
        <el-form-item label="封面上传">
          <el-upload action="" :file-list="comics.fileList" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸520x676，只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="漫画上传">
          <el-upload action="" list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="漫画标题">
          <el-input v-model="comics.title"></el-input>
        </el-form-item>
        <el-form-item label="期数">
          <el-input v-model="comics.term"></el-input>
        </el-form-item>
        <el-form-item label="选择作者">
          <el-select v-model="searchKey" filterable placeholder="请输入作者进行搜索">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
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
      options: [
        { id: '1', value: '选项1', label: '选项1' },
        { id: '2', value: '选项2', label: '选项2' },
        { id: '3', value: '选项3', label: '选项3' },
        { id: '4', value: '选项4', label: '选项4' },
        { id: '5', value: '选项5', label: '选项5' }
      ],
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
