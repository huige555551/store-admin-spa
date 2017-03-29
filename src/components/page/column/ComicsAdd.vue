<template>
  <div>
    <el-form ref="form" :model="comics" label-width="100px" style="width: 500px;">
      <el-form-item label="封面上传">
        <UploadSingle
          :imgUrl="comics.coverUrl"
          :imgKey="comics.coverKey"
          :size=1 dimension="520x676"
          :data="uploadParams"
          @handleRemove="handleRemove" name="comics"
          @handleSuccess="handleSuccess">
        </UploadSingle>
      </el-form-item>
      
      <el-form-item label="漫画上传">
        <!--<el-upload list-type="picture-card" class="avatar-uploader" action="//up-z2.qiniu.com" accept="image/*" list-type="picture-card" :show-file-list="false" :data="uploadParams" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
          <img v-if="comics.comicsUrl" :src="comics.comicsUrl" class="avatar">
          <i class="el-icon-plus"></i>
        </el-upload>-->
        <el-upload
          action="//up-z2.qiniu.com" accept="image/*" multiple list-type="picture-card" :file-list="comics.comicsList" :data="uploadParams" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload"
          :on-remove="handleComicsRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="漫画标题">
        <el-input v-model="comics.title"></el-input>
      </el-form-item>
      <el-form-item label="期数">
        <el-input v-model="comics.period"></el-input>
      </el-form-item>
      <el-form-item label="选择作者">
        <el-select v-model="comics.authorId" filterable placeholder="请输入作者进行搜索">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api'
import UploadSingle from '../../util/UploadSingle'

const _ = require('lodash')

export default {
  data() {
    return {
      editing: null,
      searchKey: {},
      options: [
        { id: '1', value: '1', label: '选项1' },
        { id: '2', value: '2', label: '选项2' },
        { id: '3', value: '3', label: '选项3' },
        { id: '4', value: '4', label: '选项4' },
        { id: '5', value: '5', label: '选项5' },
        { id: '6', value: '6', label: '选项6' },
        { id: '7', value: '7', label: '选项7' },
        { id: '8', value: '8', label: '选项8' }
      ],
      comics: {
        imgKey: '',
        title: '',
        term: '',
        buyUrl: '',
        story: '',
        period: '',
        authorId: '',
        year: '2017',
        comicsList: [],
        type: 1,
        imgList: []
      },
      // 漫画上传参数
      bucketPort: null,
      uploadParams: {},
      dialogVisible: false
    }
  },
  components: {
    UploadSingle
  },
  async created() {
    this.fetchData()
  },
  beforeRouteLeave(to, from, next) {
    // TODO 突然离开未保存，提示管理员
    console.log('leave')
    next()
  },
  methods: {
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('}/api/system/comicIllustration/getComicIllustrations', { id: this.$route.params.id })
        if (code === 200) {
          this.comics = data
          this.editing = true
        }
      } else {
        this.editing = false
        this.comics = { imgKey: '', title: '', type: 1, authorId: '', period: '', comicsList: [], imgList: [] }
      }
    },
    /* eslint-disable */
    handleComicsRemove(file, fileList) {
    /* eslint-enable */
      this.comics.comicsList = fileList
      this.comics.comicsUrl = null
      this.comics.comicsKey = null
    },
    // 漫画上传
    beforeAvatarUpload() {
      console.log('comics success1')
      return api.get('/api/system/upload/getToken').then(response => {
        this.bucketPort = response.data.bucketPort
        this.uploadParams = {
          unique_names: true,
          save_key: false,
          token: response.data.token
        }
      })
    },
    // 漫画成功
    /* eslint-disable */
    handleAvatarScucess(response, file, fileList) {
      this.$set(this.comics, 'comicsUrl', `${this.bucketPort}/${response.key}`)
      this.$set(this.comics, 'comicsKey', response.key)
      this.comics.comicsList = fileList
      /* eslint-enable */
      // this.comics.comicsList.splice(this.comics.comicsList.length, 0, { 'imgKey': response.key })
    },
    handleRemove() {
      this.comics.coverUrl = null
      this.comics.coverKey = null
    },
    // 文件上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.comics, 'coverUrl', `${bucketPort}/${response.key}`)
      this.$set(this.comics, 'coverKey', response.key)
    },
    async save() {
      console.log(this.comics.title, this.comics.period, this.comics.authorId)
      if (!this.comics.coverUrl || !this.comics.comicsUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      } else if (!this.comics.title || !this.comics.period || !this.comics.authorId) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      console.log(this.comics.comicsList)
      const comicsList = _.clone(this.comics.comicsList)
      /* eslint-disable */
      let imgUrl = []
      /* eslint-enable */
      comicsList.forEach((item) => {
        /* eslint-disable */
        imgUrl.push({ 'imgKey': item.response.key })
        /* eslint-enable */
      })
      this.comics.imgList = imgUrl
      this.imgKey = this.coverKey
      // this.publicationDate = new Moment(this.publicationDate).format('yyyy-MM-dd')
      // console.log(this.publicationDate)
      if (this.editing) {
        // this.$set(this.cover, 'publicationDate', this.comics.publicationDate.slice(0, 16))
        const { code } = await api.post('/api/system/wechat/updatecomics', this.comics)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/comics/list')
        }
      } else {
        const { code } = await api.post('/api/system/comicIllustration/addComicIllustrations', this.comics)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/comics/list')
        }
      }
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>
