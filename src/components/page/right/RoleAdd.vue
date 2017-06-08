<template>
  <div class="">
    <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>权限管理</span>
      </el-form-item>
      <el-form-item label="菜单：" v-if="!editing">
        <span>添加角色</span>
      </el-form-item>
    </el-form>

    <!-- 创建分类 -->
    <div class="form-box">
      <el-form ref="form" label-width="100px" label-position="left">
        <el-form-item label="角色名称" style="width: 400px;">
          <el-input v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="权限分配：" >
            <!--商品模块-->
            <div class="right-item">
              <span class="title">商品：</span>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
              <el-checkbox-group>
                <el-checkbox>商品列表</el-checkbox>
                <el-checkbox>商品添加修改</el-checkbox>
                <el-checkbox>商品删除</el-checkbox>
                <el-checkbox>分类列表</el-checkbox>
                <el-checkbox>分类添加修改</el-checkbox>
                <el-checkbox>分类删除</el-checkbox>
                <el-checkbox>规格列表</el-checkbox>
                <el-checkbox>规格添加修改</el-checkbox>
                <el-checkbox>规格删除</el-checkbox>
                <el-checkbox>品牌列表</el-checkbox>
                <el-checkbox>品牌添加修改</el-checkbox>
                <el-checkbox>品牌删除</el-checkbox>
                <el-checkbox>运费修改</el-checkbox>
              </el-checkbox-group>
            </div>
            <!--END商品模块-->
            <!--系统模块-->
            <div class="right-item">
              <span class="title">系统：</span>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
              <el-checkbox-group>
                <el-checkbox>修改密码</el-checkbox>
              </el-checkbox-group>
            </div>
            <!--END系统模块-->
            <!--地址模块-->
            <div class="right-item">
              <span class="title">地址：</span>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
              <el-checkbox-group>
                <el-checkbox>地址列表</el-checkbox>
                <el-checkbox>地址添加修改</el-checkbox>
                <el-checkbox>地址删除</el-checkbox>
              </el-checkbox-group>
            </div>
            <!--END地址模块-->
            <!--订单模块-->
            <div class="right-item">
              <span class="title">订单：</span>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
              <el-checkbox-group>
                <el-checkbox>快递单列表</el-checkbox>
                <el-checkbox>快递单添加修改</el-checkbox>
                <el-checkbox>快递单删除</el-checkbox>
                <el-checkbox>订单列表</el-checkbox>
                <el-checkbox>订单添加修改</el-checkbox>
                <el-checkbox>订单状态修改</el-checkbox>
                <el-checkbox>订单详情</el-checkbox>
                <el-checkbox>订单退款操作</el-checkbox>
                <el-checkbox>退款单列表</el-checkbox>
                <el-checkbox>退款单详情</el-checkbox>
                <el-checkbox>退款申请单修改</el-checkbox>
                <el-checkbox>退款申请单列表</el-checkbox>
                <el-checkbox>退款申请单详情</el-checkbox>
              </el-checkbox-group>
            </div>
            <!--END订单模块-->
        </el-form-item>
         <el-form>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/product/classify/list')">取消</el-button>
        </el-form>
      </el-form>
    </div>

    <el-dialog title="选择商品分类" label-position="left">
      <el-form>
      </el-form>
    </el-dialog>
  </div>
</template>

<style type="text/css">
  .adImg {
    display: inline-block;
    max-height: 200px;
    max-width: 200px;
  }
</style>

<script>
import api from '@/api'
import UploadSingle from '../../util/UploadSingle'

const _ = require('lodash')

export default {
  data() {
    return {
      // 表单
      role: {},
      classify: {},
      editing: false,
      editingIndex: null,
      formDialog: false,
      size: null,
      newAd: {
        advertismentTypeId: null,
        ifUse: null,
        location: null,
        imgUrl: null,
        imgKey: null
      },
      // 表格
      tableData: [],
      options: [],
      positionResults: []
    }
  },
  components: {
    UploadSingle
  },
  created() {
    // this.fetchData()
  },
  methods: {
    openImg(url) {
      window.open(url)
    },
    // 获取分类数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/advertisment/listAdvertisment')
      if (code === 200) {
        this.tableData = data
      }
    },
    editRow(index, size) {
      this.editing = true
      this.editingIndex = index
      this.newAd.advertismentTypeId = this.tableData[index].advertismentTypeId
      this.newAd.id = this.tableData[index].id
      this.newAd.location = this.tableData[index].location
      this.newAd.advertisers = this.tableData[index].advertisers
      this.newAd.size = this.tableData[index].size
      this.newAd.url = this.tableData[index].url
      this.newAd.ifUse = this.tableData[index].ifUse
      this.newAd.imgUrl = this.tableData[index].imgUrl
      this.newAd.imgKey = this.tableData[index].imgKey
      this.size = size
      this.formDialog = true
    },
    addRow() {
      this.editing = false
      this.newAd = {
        location: null,
        advertismentTypeId: null,
        ifUse: null,
        imgUrl: null,
        imgKey: null
      }
      this.formDialog = true
    },
    async searchPosition() {
      const { code, data } = await api.get('/api/system/advertisment/getLocation')
      if (code === 200) {
        this.positionResults = data
      }
    },
    // 添加广告时更新建议图片的尺寸提示
    async selectItem(selected) {
      const { code, data } = await api.get('/api/system/advertisment/getLocation')
      if (code === 200) {
        this.newAd.size = data[selected - 1].size
      }
    },
    // 删除广告
    async deleteRow(index) {
      this.$confirm('此操作将该删除该广告，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/advertisment/deleteAdvertisment', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
        }
      }).catch(() => {})
    },
    // 保存修改
    async saveRow() {
      if (!this.newAd.advertismentTypeId || !this.newAd.advertisers || !this.newAd.imgUrl || this.newAd.ifUse === null) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/advertisment/updateAdvertisment', this.newAd)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.newAd))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.formDialog = false
        }
      } else {
        const { code } = await api.post('/api/system/advertisment/addAdvertisment', this.newAd)
        if (code === 200) {
          this.fetchData()
          this.formDialog = false
          this.$notify.success({ title: '成功', message: '添加成功' })
        }
      }
    },
    // 删除封面图片
    handleRemove() {
      this.newAd.imgKey = null
      this.newAd.imgUrl = null
    },
    // 封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.newAd, 'imgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.newAd, 'imgKey', response.key)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-checkbox-group {
  .el-checkbox {
    width: 300px;
    margin-left: 0;
  }
}
.right-item:not(last-child) {
  margin-bottom: 30px;
}
.title {
}
</style>
