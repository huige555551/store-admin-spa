<template>
  <div>
    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" :model="audio" label-width="100px" style="width: 500px;">
        <el-form-item label="封面上传">
          <UploadSingle
            :imgUrl="cover.imgUrl"
            :imgKey="cover.imgKey"
            :size=1 dimension="240x240"
            @handleRemove="handleRemove"
            @handleSuccess="handleSuccess">
          </UploadSingle>

        </el-form-item>
        <el-form-item label="选择分类">
          <el-select v-model="audio.navigationId" filterable placeholder="请输入分类进行搜索">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音频标题">
          <el-input v-model="audio.title"></el-input>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="audio.length"></el-input>
        </el-form-item>
        <el-form-item label="音频链接">
          <el-upload action="//up-z2.qiniu.com" :file-list="audio.cover">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp3文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="音频摘要">
          <el-input type="textarea" :rows="4" v-model="audio.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="beforeRouteLeave">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import UploadSingle from '@/components/util/UploadSingle'
import Simditor from '../../util/Simditor'
// import router from 'router'
// const _ = require('lodash')

export default {
  data() {
    return {
      searchKey: '',
      cover: {
        imgUrl: null, // data内声明，允许子组件跟踪值变化
        imgKey: null  // data内声明，允许子组件跟踪值变化
      },
      audio: {
        navigationId: null,
        length: null,
        title: null,
        time: null,
        fileKey: null,
        remark: null,
        coverKey: null
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
      },
      components: {
        UploadSingle
      }
    }
  },
  components: {
    Simditor,
    UploadSingle
  },
  methods: {
    async onSubmit() {
      const { code } = await api.post('/api/system/audio/addAudio', this.audio)
      if (code === 200) {
        this.$message.success('提交成功！')
      } else {
        this.$message.error('提交失败！')
      }
    },
    // 删除封面图片
    handleRemove() {
      this.audio.imgKey = null
      this.audio.imgUrl = null
    },
    // 封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.cover.imgKey = response.key
      this.cover.imgUrl = `${bucketPort}/${response.key}`
    },
    change(val) {
      console.log(val)
    },
    beforeRouteLeave(to, from, next) {
      // TODO 突然离开未保存，提示管理员
      console.log('leave')
      this.$confirm('此操作将不保留任何修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // $router.push('/audio/list')
        window.location.href = '/audio/list'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      next()
    }
  }
}
</script>
