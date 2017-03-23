<template>
  <div>
    <el-form ref="form" :model="featuredAudio" label-width="80px">
      <el-form-item label="音频">
        <span>{{featuredAudio.title}}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="formDialog = true">替换</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 添加精选文章 -->
    <el-dialog title="选择精选音频" v-model="formDialog">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="选择音频">
          <el-select v-model="featuredObj.title" filterable placeholder="请输入音频标题进行搜索">
            <el-option label="选项一" value="value1"></el-option>
            <el-option label="选项二" value="value2"></el-option>
          </el-select>
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
      formDialog: false,
      featuredObj: {},
      featuredAudio: {
        title: '老屋，旧房，砖瓦',
        dialog: false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log()
    }
  }
}
</script>
