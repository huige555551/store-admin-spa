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
    
    <!-- 替换精选音频 -->
    <el-dialog title="选择精选音频" v-model="formDialog">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="选择音频">
          <el-select
            v-model="featuredObj.audioId" 
            filterable remote placeholder="请输入音频标题进行搜索"
            :remote-method="searchAudio">
            <el-option
              v-for="item in results"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="formDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      formDialog: false,
      featuredObj: { title: null },
      featuredAudio: { title: null },
      results: {}
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/audio/getExquisiteAudio')
      if (code === 200) {
        if (data) {
          this.featuredAudio = data
        } else {
          this.featuredAudio.title = '暂无精选音频，请添加'
        }
      }
    },
    async searchAudio(val) {
      const { code, data } = await api.get('/api/system/audio/searchAudioByTitle', { title: val })
      if (code === 200) {
        this.results = data
      }
    },
    async save() {
      const { code } = await api.post('/api/system/audio/changeAudio', this.featuredObj)
      if (code === 200) {
        this.$notify.success({ title: '成功', message: '音频替换成功' })
        this.featuredAudio = this.featuredObj
        this.formDialog = false
        this.$router.push('/feature/audio')
      }
    }
  }
}
</script>
