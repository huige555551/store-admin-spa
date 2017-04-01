<template>
  <div>
    <el-form ref="form" :model="comics" label-width="100px" style="width: 500px;">
      <el-form-item label="封面上传">
        <UploadSingle
          :imgUrl="comics.imgUrl"
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
      <el-form-item label="期数" >
        <el-input v-model="comics.period" type="number"></el-input>
      </el-form-item>
      <el-form-item label="选择作者">
        <el-select v-model="comics.authorId" filterable placeholder="请输入作者进行搜索">
          <el-option
              v-for="item in optionsAuthor"
              :label="item.name"
              :value="item.id"
              :key="item.id">
            </el-option>
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
      optionsAuthor: [],
      comics: {
        imgKey: '',
        title: '',
        term: '',
        buyUrl: '',
        story: '',
        period: null,
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
  watch: {
    /* eslint-disable */
    '$route'() {
      this.fetchData()
    /* eslint-enable */
    }
  },
  methods: {
    async fetchData() {
      const getAuthor = await api.get('/api/system/author/listAuthor')
      if (getAuthor.code === 200) {
        this.optionsAuthor = getAuthor.data.array
      }
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/comicIllustration/getComicIllustrations', { id: this.$route.params.id })
        if (code === 200) {
          /* eslint-disable */
          let comicsList = []
          this.comics = data
          data.imgList.forEach(function(item, index){
            const imgKey = item.imgKey
            const imgUrl = item.imgUrl
          /* eslint-enable */
            comicsList.push({ name: imgKey, url: imgUrl })
          })
          // 保证成功显示在页面
          this.comics.comicsList = comicsList
          this.editing = true
          this.comics.coverKey = data.imgKey
          this.comics.type = 1
        }
      } else {
        this.editing = false
        this.comics = { imgKey: '', title: '', type: 1, authorId: '', period: null, comicsList: [], imgList: [] }
      }
    },
    // 日期更改
    handleDatePick(val) {
      this.article.publicationDate = val
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
    // 封面上传成功
    handleRemove() {
      this.comics.imgUrl = null
      this.comics.coverKey = null
    },
    // 上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.comics, 'imgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.comics, 'coverKey', response.key)
    },
    async save() {
      if (!this.comics.imgUrl || !this.comics.comicsList.length) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      } else if (!this.comics.title || !this.comics.period || !this.comics.authorId) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      const comicsList = _.clone(this.comics.comicsList)
      /* eslint-disable */
      let imgUrl = []
      /* eslint-enable */
      comicsList.forEach((item) => {
        /* eslint-disable */
        if(item.response)
          imgUrl.push( item.response.key )
        else
          imgUrl.push( item.name)
        /* eslint-enable */
      })
      // post参数构造
      this.comics.imgList = JSON.stringify(_.clone(imgUrl))
      // period＝> string to nubmer
      this.$set(this.comics, 'period', Number(this.comics.period))
      if (this.editing) {
        this.$set(this.comics, 'imgKey', this.comics.coverKey)
        const { code } = await api.post('/api/system/comicIllustration/updateComicIllustrations', this.comics)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/comics/list')
        }
      } else {
        this.$set(this.comics, 'imgKey', this.comics.coverKey)
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
