<template>
  <div class="">
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>地址管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加地址</span>
      </el-form-item>
    </el-form>

    <!-- 创建文章 -->
    <div class="form-box">
      <el-form ref="form" :model="article" label-width="100px" label-position="right">
        <el-form-item label="发货点名称" style="width: 400px;">
          <el-input v-model="address.name"></el-input>
        </el-form-item>
        <el-form-item label="发货人姓名" style="width: 400px;">
          <el-input v-model="address.consignor"></el-input>
        </el-form-item>
        <el-form-item label="性别" style="width: 400px;">
          <el-radio v-model="address.consignorGender" :label="1">先生</el-radio>
          <el-radio v-model="address.consignorGender" :label="2">女士</el-radio>
        </el-form-item>
        <el-form-item label="地区" style="width: 800px;">
          <el-select class="province" placeholder="请选择省份" v-model="address.province">
            <el-option value="广东省">广东省</el-option>
          </el-select>
          <el-select class="city" placeholder="请选择市" v-model="address.city">
            <el-option value="广州市">广州市</el-option>
          </el-select>
          <el-select class="area" placeholder="请选择区" v-model="address.area">
            <el-option value="白云区">白云区</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" style="width: 400px;">
          <el-input v-model="address.address"></el-input>
        </el-form-item>
         <el-form-item label="邮编" style="width: 400px;">
          <el-input type="number" v-model="address.postcode"></el-input>
        </el-form-item>
         <el-form-item label="手机" style="width: 400px;">
          <el-input type="number" v-model="address.mobilePhone"></el-input>
        </el-form-item>
         <el-form-item label="电话" style="width: 400px;">
          <el-input type="number" v-model="address.phone"></el-input>
        </el-form-item>
        <el-form-item label="设置为默认地址" style="width: 400px;">
          <el-radio v-model="address.defaultUse" :label="true">是</el-radio>
          <el-radio v-model="address.defaultUse" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/address/list')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import api from '@/api'
import Simditor from '../../util/Simditor'
import UploadSingle from '../../util/UploadSingle'

// const _ = require('lodash')

export default {
  data() {
    return {
      address: {
        name: '',
        consignor: '',
        consignorGender: 1,
        province: '',
        city: '',
        area: '',
        address: '',
        postcode: '',
        phone: '',
        mobilePhone: '',
        defaultUse: false
      },
      // 图片上传七牛参考: https://my.oschina.net/u/1760791/blog/643768
      // http://blog.csdn.net/jiangtianhao13269230/article/details/50699737
      options2: {},
      optionColumn: [],
      optionAuthor: [],
      optionTag: []
    }
  },
  components: {
    Simditor,
    UploadSingle
  },
  async created() {
    this.fetchData()
  },
  // 组件复用，路由数据刷新
  /* eslint-disable */
  watch: {
    '$route'() {
      this.fetchData()
    }
  },
  /* eslint-enable */
  methods: {
    add(index) {
      this.standards[index].subItem.push({})
    },
    addSpecificationItems() {
      this.standards.push({
        item: [
          {
            value: '1',
            label: '尺码'
          },
          {
            value: '2',
            label: '颜色'
          },
          {
            value: '3',
            label: '规格'
          }]
      })
    },
    change(html) {
      this.article.content = html
    },
    async fetchData() {
      // editing
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/address/getAddressDetails', { addressId: this.$route.params.id })
        if (code === 200) {
          this.address = data
        }
      } else {
      // new
        this.editing = false
      }
    },
    async searchAuthorName(inputAuthorName) {
      const { code, data } = await api.get('/api/system/author/listAuthor', { authorName: inputAuthorName })
      if (code === 200) {
        this.optionAuthor = data.array
      }
    },
    // 日期更改
    handleDatePick(val) {
      this.article.publicationDate = val
    },
    handleRemove(name) {
      if (name === 'article') {
        this.article.coverUrl = null
        this.article.coverKey = null
      }
    },
    handleSuccess(response, bucketPort, name) {
      if (name === 'article') {
        this.$set(this.article, 'coverUrl', `${bucketPort}/${response.key}`)
        this.$set(this.article, 'coverKey', response.key)
      }
    },
    async save() {
      if (!this.address.name || !this.address.consignor || !this.address.consignorGender || !this.address.province || !this.address.city || !this.address.area || !this.address.address || !this.address.postcode || !this.address.phone || !this.address.mobilePhone) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      // this.article.labelList = JSON.stringify((_.clone(this.article.labels)))
      if (this.editing) {
        const { code } = await api.post('/api/address/update', this.address)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/address/list')
        } else {
          return this.$notify.error({ title: '失败', message: code + '保存失败' })
        }
      } else {
        const { code } = await api.post('/api/address/add', this.address)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/address/list')
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .simditor-body {
    max-height: 600px;
    overflow: scroll;
  }

  .simditor-body img {
    display: block;
    width: 100%!important;
    height: auto;
  }

  .simditor-body h1 {
    font-size: 22px;
  }

  .simditor-body h2 {
    font-size: 20px;
  }

  .simditor-body h3 {
    font-size: 18px
  }

   .el-select-dropdown__wrap {
    max-height: 180px;
  }
  .el-form .category-item {
    margin-bottom: 22px;
    .el-button {
      margin-bottom: 22px;
      display: block;
    }
  }
  .el-form-item .el-form-item {
    margin-bottom: 22px;
  }
  .productType {
    .el-radio {
      margin-left: 0;
      margin-right: 20px;
    }
  }
  .avatar-uploader {
    margin-top: 20px;
  }
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
  .province, .city, .area {
    display: inline-block;
  }
</style>
