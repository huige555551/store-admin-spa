<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="160"></el-table-column>
      <el-table-column prop="introduction" label="描述" min-width="160"></el-table-column>
      <el-table-column prop="author" label="作者" min-width="100"></el-table-column>
      <el-table-column prop="order" label="顺序" width="70"></el-table-column>
      <el-table-column label="跳转链接" min-width="160">
        <template scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200">
        <template scope="scope">
          <img :src="scope.row.imgUrl" width="200" max-height="200" @click="openImg(scope.row.imgUrl)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="small" @click.native.prevent="editBanner(scope.$index)">编辑</el-button>
          <el-button type="small" @click.native.prevent="deleteBanner(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-form style="margin-top: 20px">
      <el-form-item>
        <el-button @click="addBanner">添加轮播</el-button> 最多6张
      </el-form-item>
    </el-form>

    <!-- 添加轮播表单 -->
    <el-dialog title="添加轮播" v-model="newBannerDialog">
      <el-form :model="newBannerObj" :rules="rules" ref="newBannerObj" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="newBannerObj.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="introduction">
          <el-input v-model="newBannerObj.introduction"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="newBannerObj.url"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="newBannerObj.author"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="order">
          <el-input v-model="newBannerObj.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="imgKey">
          <el-upload 
            action="//upload.qiniu.com" 
            :file-list="newBannerObj.fileList"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :data="uploadForm"
            list-type="picture-card">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸1440x520，只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native.prevent="newBannerDialog = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="saveBanner">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑轮播表单 -->
    <el-dialog title="编辑轮播" v-model="editBannerDialog">
      <el-form :model="editBannerObj" :rules="rules" ref="editBannerObj" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="editBannerObj.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="introduction">
          <el-input v-model="editBannerObj.introduction"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="editBannerObj.url"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editBannerObj.author"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="order">
          <el-input v-model="editBannerObj.order" placeholder="输入数字，数字越大越排前"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="imgKey">
          <el-upload 
            action="//upload.qiniu.com" 
            :file-list="editBannerObj.fileList"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :data="uploadForm"
            list-type="picture-card">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸1440x520，只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native.prevent="editBannerDialog = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="saveBanner">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'

const moment = require('moment')

export default {
  data() {
    return {
      // 添加轮播
      newBannerObj: {},
      newBannerDialog: false,
      // 编辑轮播
      editing: false,
      editBannerObj: {},
      editBannerDialog: false,
      uploadForm: {},
      // tableData: []
      tableData: [
        { id: 1, order: '1', title: '这是标题1', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', introduction: '这是描述', url: 'http://baidu.com', author: '新周刊' },
        { id: 1, order: '1', title: '这是标题2', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', introduction: '这是描述', url: 'http://baidu.com', author: '新周刊' },
        { id: 1, order: '1', title: '这是标题3', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', introduction: '这是描述', url: 'http://baidu.com', author: '新周刊' },
        { id: 1, order: '1', title: '这是标题4', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', introduction: '这是描述', url: 'http://baidu.com', author: '新周刊' },
        { id: 1, order: '1', title: '这是标题5', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', introduction: '这是描述', url: 'http://baidu.com', author: '新周刊' },
        { id: 1, order: '1', title: '这是标题6', imgUrl: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', introduction: '这是描述', url: 'http://baidu.com', author: '新周刊' }
      ],
      rules: {
        title: [{ required: true, message: '请输入轮播标题', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入轮播描述', trigger: 'blur' }],
        url: [{ required: true, message: '请输入轮播跳转链接', trigger: 'blur' }],
        author: [{ required: true, message: '请输入轮播跳转作者', trigger: 'blur' }],
        order: [{ required: true, message: '请输入轮播顺序', trigger: 'blur' }],
        imgKey: [{ required: true, message: '请上传轮播图片', trigger: 'blur' }]
      }
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    // 获取轮播数据
    async fetchData() {
      this.tableData = []
      const { code, data } = api.get('/api/system/banner/listBanner', { type: 1 })
      if (code === 200) {
        this.tableData = data
      }
    },
    beforeUpload(file) {
      const curr = moment().format('YYYYMMDD').toString()
      const prefix = moment(file.lastModified).format('HHmmss').toString()
      const suffix = file.name
      const key = encodeURI(`${curr}/${prefix}_${suffix}`)
      return api.get('/api/token', { key }).then(response => {
        this.bucketHost = response.bucketHost
        this.supportWebp = response.supportWebp
        this.form = {
          key,
          token: this.upToken
        }
      })
    },
    handleSuccess(file) {
      console.log(file)
    },
    // 添加轮播
    addBanner() {
      this.editing = false
      this.newBannerObj = {}
      this.newBannerDialog = true
    },
    // 编辑轮播
    editBanner(index) {
      this.editing = true
      this.editBannerObj = this.tableData[index]
      this.editBannerObj.fileList = [
        { name: this.editBannerObj.imgUrl.split('/').pop(), url: this.editBannerObj.imgUrl }
      ]
      this.editBannerDialog = true
    },
    // 保存轮播
    async saveBanner() {
      if (this.editing) {
        this.$refs.editBannerObj.validate((valid) => {
          if (valid) {
            const { code } = api.post('/api/system/banner/updateBanner', this.editBannerObj)
            if (code === 200) {
              this.$notify.success({ title: '成功', message: '这是一条成功的提示消息' })
              this.editBanner = {}
              this.editBannerDialog = false
            }
          }
        })
      } else {
        this.$refs.newBannerObj.validate((valid) => {
          if (valid) {
            this.newBannerObj.type = 1
            const { code } = api.post('/api/system/banner/addBanner', this.newBannerObj)
            if (code === 200) {
              this.newBannerObj = {}
              this.newBannerDialog = false
              this.fetchData()
            }
          }
        })
      }
    },
    // 删除轮播
    async deleteBanner(index) {
      this.$confirm('此操作将该删除该反馈，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const { code } = api.post('/api/system/banner/deleteBanner', { bannerId: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
        }
      }).catch(() => {})
    }
  }
}
</script>
