<template>
  <div>
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>固定栏目</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>新增封面</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="editing">
        <span>编辑封面</span>
      </el-form-item>
      <el-form-item label="封面：" v-if="editing">
        <span>{{cover.title}}</span>
      </el-form-item>
    </el-form>

    <!-- 表单 -->
    <el-form ref="form" :model="cover" label-position="left" label-width="100px" style="width: 500px;">
      <el-form-item label="封面上传">
        <UploadSingle
          :imgUrl="cover.coverUrl"
          :imgKey="cover.coverKey"
          :size=1 dimension="520x676" name="cover"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="cover.publicationDate"
          format="yyyy-MM-dd"
          @change="handleDatePick"
          type="date"
          :clearable="false"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="封面标题">
        <el-input v-model="cover.title"></el-input>
      </el-form-item>
      <el-form-item label="期数">
        <el-input v-model="cover.period"></el-input>
      </el-form-item>
      <el-form-item label="购买链接">
        <el-input v-model="cover.buyUrl"></el-input>
      </el-form-item>
      <el-form-item label="杂志故事">
        <el-input type="textarea" :rows="4" v-model="cover.story"></el-input>
      </el-form-item>
      <el-form-item label="故事图片">
        <UploadSingle
          :imgUrl="cover.storyImgUrl"
          :imgKey="cover.storyImgKey"
          :size=1 dimension="560x440" name="story"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
      </el-form-item>
      <el-form-item label="杂志目录">
        <el-tree :data="cover.directory" :props="defaultProps"></el-tree>
        <el-button style="margin-top: 10px;" @click="editCatergory">编辑</el-button>
      </el-form-item>
      <el-form-item label="目录图片">
        <UploadSingle
          :imgUrl="cover.directoryImgUrl"
          :imgKey="cover.directoryImgKey"
          :size=1 dimension="560x440" name="directory"
          @handleRemove="handleRemove"
          @handleSuccess="handleSuccess">
        </UploadSingle>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="save">保存</el-button>
        <el-button @click.native.prevent="$router.push('/cover/list')">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 录入目录 -->
    <el-dialog title="编辑目录" v-model="catergoryDialog" size="small">
      <el-form ref="form" label-position="left" label-width="100px" style="width: 600px;">
        <!-- 一级目录 -->
        <el-form-item label="一级目录" v-for="(item, index) in directory">
          <el-input v-model="item.name" placeholder="一级目录名" class="inline"></el-input>
          <el-input v-model="item.page" placeholder="页码" class="inline pages"></el-input>
          <el-button type="text" style="margin-left:20px" @click="deleteFirstDir(index)">删除一级</el-button>
          <!-- 二级目录 -->
            <el-form-item  v-for="(subItem, index1) in item.children">
              <el-input v-model="subItem.name" size="small" class="secondCatergory inline" placeholder="二级目录名"></el-input>
              <el-input v-model="subItem.page" size="small"  placeholder="页码" class="inline pages secondCatergory"></el-input>
              <el-button type="text" style="margin-left:20px" @click="deleteSecondDir(index,index1)">删除</el-button>
            </el-form-item>
          <el-button type="text" class="inline" @click="addSecond(index)">添加二级目录</el-button>
        </el-form-item>
        
      </el-form>
      <el-button class="add" @click="addFirst">新增一级目录</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDirectory">确 定</el-button>
        <el-button @click="catergoryDialog = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style type="text/css">
  .inline {
    display: inline-block;
  }

  .pages {
    width: 50px!important;
    height: 36px;
    margin-left: 20px;
  }

  .add {
    position: relative;
    top: 77px;
  }

  .secondCatergory {
    position: relative;
    margin-top: 10px;
  }
</style>

<script>
import api from '@/api'
import UploadSingle from '@/components/util/UploadSingle'

const _ = require('lodash')

export default {
  data() {
    return {
      editing: false,
      cover: {},
      catergoryDialog: false,
      directoryString: '',
      firstDir: {
        name: '',
        page: '',
        children: []
      },
      secondDir: {
        name: '',
        page: ''
      },
      directory: [{
        name: '',
        page: '',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  components: {
    UploadSingle
  },
  async created() {
    this.fetchData()
  },
  // 组件复用，路由数据刷新
  async beforeRouteUpdate() {
    this.fetchData()
  },
  watch: {
    /* eslint-disable */
    '$route'() {
      console.log('########')
      this.fetchData()
    /* eslint-enable */
    }
  },
  methods: {
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/cover/getCover', { coverId: this.$route.params.id })
        if (code === 200) {
          this.cover = data
        }
      } else {
        this.editing = false
        this.cover = { publicationDate: null, directory: [] }
      }
    },
    handleDatePick(val) {
      console.log(val)
      this.cover.publicationDate = val
    },
    handleRemove(name) {
      if (name === 'cover') {
        this.cover.coverUrl = null
        this.cover.coverKey = null
      } else if (name === 'story') {
        this.cover.storyImgUrl = null
        this.cover.storyImgKey = null
      } else if (name === 'directory') {
        this.cover.directoryImgUrl = null
        this.cover.directoryImgKey = null
      }
    },
    handleSuccess(response, bucketPort, name) {
      if (name === 'cover') {
        this.$set(this.cover, 'coverUrl', `${bucketPort}/${response.key}`)
        this.$set(this.cover, 'coverKey', response.key)
      } else if (name === 'story') {
        this.$set(this.cover, 'storyImgUrl', `${bucketPort}/${response.key}`)
        this.$set(this.cover, 'storyImgKey', response.key)
      } else if (name === 'directory') {
        this.$set(this.cover, 'directoryImgUrl', `${bucketPort}/${response.key}`)
        this.$set(this.cover, 'directoryImgKey', response.key)
      }
    },
    async save() {
      if (!this.cover.coverUrl || !this.cover.storyImgUrl || !this.cover.directoryImgUrl) {
        return this.$notify.error({ title: '错误', message: '图片不能为空' })
      } else if (!this.cover.publicationDate || !this.cover.title || !this.cover.period || !this.cover.buyUrl || !this.cover.story || !this.cover.directory) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      let publicationDate = this.cover.publicationDate
      publicationDate = publicationDate.substring(0, 10)
      this.$set(this.cover, 'publicationDate', publicationDate)
      if (this.editing) {
        const { code } = await api.post('/api/system/cover/updateCover', this.cover)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/cover/list')
        }
      } else {
        const { code } = await api.post('/api/system/cover/addCover', this.cover)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/cover/list')
        }
      }
    },
    addSecond(index) {
      this.directory[index].children.push(_.cloneDeep(this.secondDir))
    },
    addFirst() {
      this.directory.push(_.cloneDeep(this.firstDir))
    },
    deleteFirstDir(index) {
      this.$confirm('此操作将删除此一级栏目及其下所有二级栏目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.directory.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSecondDir(parentIndex, index) {
      this.directory[parentIndex].children.splice(index, 1)
    },
    editCatergory() {
      this.catergoryDialog = true
      this.directory = _.cloneDeep(this.cover.directory)
    },
    saveDirectory() {
      this.catergoryDialog = false
      this.cover.directory = _.cloneDeep(this.directory)
      console.log(this.cover)
    }
  }
}
</script>
