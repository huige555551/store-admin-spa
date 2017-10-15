<template>
  <div class="m-role-add">
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
        <el-form-item :key="item.moduleName" v-for="item in tableData" class="table-item" style="width: 800px;">
          <div class="table-title">{{item.moduleName}}</div>
          <el-table :data="item.array">
            <el-table-column align="left" label="权限模块" width="200px">
              <template scope="scope">
                <el-checkbox v-show="scope.row.sonAuthorityList" @change="chooseAll(scope.row)" v-model="scope.row.have">{{scope.row.name}}</el-checkbox>
                <div class="no-checkbox" v-show="!scope.row.sonAuthorityList">{{scope.row.name}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="具体权限" min-width="80">
              <template scope="scope">
                <el-checkbox @change="addId(authorityItem._id, authorityItem.have, scope.row)" v-model="authorityItem.have" v-for="authorityItem in scope.row.sonAuthorityList" :label="authorityItem" :key="authorityItem._id">{{authorityItem.name}}</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="$router.push('/product/classify/list')">取消</el-button>
        </el-form-item>
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
      idArray: [],
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
    this.fetchData()
  },
  methods: {
    handleCheckAllChange(event, type) {
      this[`checked${type}`] = event.target.checked ? this[`checked${type}Options`] : []
      this[`is${type}Indeterminate`] = false
    },
    handleCheckedChange(value, type) {
      const checkedCount = value.length
      this[`checkAll${type}`] = checkedCount === this[`checked${type}Options`].length
      this[`checkAll${type}`] = checkedCount === this[`checked${type}Options`].length
      this[`is${type}Indeterminate`] = checkedCount > 0 && checkedCount < this[`checked${type}Options`].length
    },
    openImg(url) {
      window.open(url)
    },
    // 获取分类数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/permission/all')
      if (code === 200) {
        this.tableData = data
        if (!this.editing) {
          for (let i = 0, len = this.tableData.length; i < len; i += 1) {
            for (let j = 0, len2 = this.tableData[i].array.length; j < len2; j += 1) {
              this.$set(this.tableData[i].array[j], 'have', false)
              for (let k = 0, len3 = this.tableData[i].array[j].sonAuthorityList.length; k < len3; k += 1) {
                this.$set(this.tableData[i].array[j].sonAuthorityList[k], 'have', false)
              }
            }
          }
        }
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
     /*
    *控制全选
    */
    chooseAll(item) {
      if (!item.sonAuthorityList) {
        this.$notify({
          title: '提示',
          message: '该分组下没有权限选项，全选功能不可用',
          type: 'info'
        })
        return false
      }
      // debugger
      for (let i = 0; i < item.sonAuthorityList.length; i += 1) {
        if (item.have === true) {
          this.$set(item.sonAuthorityList[i], 'have', true)
          this.idArray.push(item.sonAuthorityList[i]._id)
          // 添加全选框的id
          this.idArray.push(item._id)
        } else {
          this.$set(item.sonAuthorityList[i], 'have', false)
          for (let j = 0; j < this.idArray.length; j += 1) {
            if (this.idArray[j] === item.sonAuthorityList[i]._id) {
              this.idArray.splice(j, 1)
              j -= 1
            }
            // 去掉全选的id
            if (this.idArray[j] === item.id) {
              this.idArray.splice(j, 1)
              j -= 1
            }
          }
        }
      }
      // 去重
      this.idArray = [...new Set(this.idArray)]
      // debugger
    },
    /*
   *添加权限id到id数组内
   *@params: id number ID值
   *@params: checked boolean 是否勾选
   *@params: parent obj 模块对象
   */
    addId(id, checked, parent) {
      if (checked === true) {
        if (!this.idArray.includes(id)) {
          this.idArray.push(id)
        } else {
          return false
        }
        let all = true
        for (let i = 0; i < parent.sonAuthorityList.length; i += 1) {
          if (parent.sonAuthorityList[i].have === false) {
            all = false
          }
        }
        if (all === true) {
          this.idArray.push(parent.id)
        }
        this.$set(parent, 'have', all)
      } else {
        // 关联全选
        this.$set(parent, 'have', false)
        for (let j = 0; j < this.idArray.length; j += 1) {
          if (this.idArray[j] === id) {
            this.idArray.splice(j, 1)
          }
          // 去掉全选的id
          if (this.idArray[j] === parent.id) {
            this.idArray.splice(j, 1)
          }
        }
      }
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
.m-role-add {
  form.upload .el-form-item {
    width: 500px;
  }

  .table-title {
    text-align: center;
  }

  .table-item {
    width: 100%!important;
  }

  .no-checkbox {
    text-indent: 23px;
  }
}
</style>
