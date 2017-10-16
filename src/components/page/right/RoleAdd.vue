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
  </div>
</template>

<script>
import api from '@/api'

// const _ = require('lodash')

export default {
  data() {
    return {
      idArray: [],
      // 表单
      role: {
        name: ''
      },
      classify: {},
      editing: false,
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
  created() {
    this.fetchData()
  },
  methods: {
    // 获取分类数据
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
      }
      this.tableData = []
      const { code, data } = await api.get('/api/permission/all')
      if (code === 200) {
        this.tableData = data
        for (let i = 0, len = this.tableData.length; i < len; i += 1) {
          for (let j = 0, len2 = this.tableData[i].array.length; j < len2; j += 1) {
            this.$set(this.tableData[i].array[j], 'have', false)
            for (let k = 0, len3 = this.tableData[i].array[j].sonAuthorityList.length; k < len3; k += 1) {
              this.$set(this.tableData[i].array[j].sonAuthorityList[k], 'have', false)
            }
          }
        }
      }
      if (this.editing) {
        const getRoleDetail = await api.get('/api/permission/role/' + this.$route.params.id)
        if (getRoleDetail.code === 200) {
          this.role.name = getRoleDetail.data.name
          this.idArray = getRoleDetail.data.permissionList.map(permissionItem => permissionItem._id)
          getRoleDetail.data.permissionList = getRoleDetail.data.permissionList.map(permissionItem => permissionItem._id)
          // debugger
          for (let i = 0, len = this.tableData.length; i < len; i += 1) {
            for (let j = 0, len2 = this.tableData[i].array.length; j < len2; j += 1) {
              if (getRoleDetail.data.permissionList.includes(this.tableData[i].array[j]._id)) {
                this.$set(this.tableData[i].array[j], 'have', true)
              }
              for (let k = 0, len3 = this.tableData[i].array[j].sonAuthorityList.length; k < len3; k += 1) {
                if (getRoleDetail.data.permissionList.includes(this.tableData[i].array[j].sonAuthorityList[k]._id)) {
                  this.$set(this.tableData[i].array[j].sonAuthorityList[k], 'have', true)
                }
              }
            }
          }
        }
      }
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
      for (let i = 0; i < item.sonAuthorityList.length; i += 1) {
        if (item.have === true) {
          this.$set(item.sonAuthorityList[i], 'have', true)
          this.idArray.push(item.sonAuthorityList[i]._id)
          // 添加全选框的id
          this.idArray.push(item._id)
        } else {
          this.$set(item.sonAuthorityList[i], 'have', false)
          for (let j = 0; j < this.idArray.length; j += 1) {
            if (this.idArray[j] === item.sonAuthorityList[i]._id || this.idArray[j] === item.id) {
              this.idArray.splice(j, 1)
              j -= 1
            }
          }
        }
      }
      // 去重
      this.idArray = [...new Set(this.idArray)]
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
    validate(name, errMessage) {
      if (!name) {
        this.$notify.error({
          title: '提示',
          message: errMessage
        })
        return false
      }
      return true
    },
    // 保存修改
    async save() {
      if (!this.validate(this.role.name, '请填写角色名称')) {
        return false
      }
      if (!this.idArray.length) {
        this.$notify.error({
          title: '失败',
          message: '强选择至少一个权限'
        })
        return false
      }
      if (!this.editing) {
        const { code } = await api.post('/api/permission/role/add', { name: this.role.name, permissionList: this.idArray })
        if (code === 201) {
          this.$notify.success({
            title: '成功',
            message: '添加角色成功'
          })
        }
        this.$router.push('/right/role/list')
      } else {
        const { code } = await api.put('/api/permission/role/edit/' + this.$route.params.id, { name: this.role.name, permissionList: this.idArray })
        if (code === 201) {
          this.$notify.success({
            title: '成功',
            message: '修改角色成功'
          })
        }
        // this.$router.push('/right/role/list')
      }
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
