<template>
  <div class="sidebar">
    <el-menu :default-active="'welcome'" class="el-menu-vertical-demo" theme="dark" unique-opened router>
      <!-- 用户管理 -->
      <el-menu-item index="/user/list" v-if="$isAllowModule('用户模块')"><i class="el-icon-date"></i>用户管理</el-menu-item>

       <!-- 首页管理 -->
      <el-submenu index="index" v-if="$isAllowModule('首页模块')">
        <template slot="title"><i class="el-icon-date"></i>首页管理</template>
        <el-menu-item index="/index/banner" v-if="$isAllowUser('轮播列表')">首页轮播</el-menu-item>
        <el-menu-item index="/feature/product" v-if="$isAllowUser('精选商品列表')">精选商品</el-menu-item>
      </el-submenu>

      <!-- 商品 -->
      <el-submenu index="product" v-if="$isAllowModule('商品模块')">
        <template slot="title"><i class="el-icon-date"></i>商品</template>
        
        <!-- 商品管理 -->
        <el-menu-item-group>
          <template slot="title">商品管理</template>
          <el-menu-item index="/product/list" v-if="$isAllowUser('商品列表')">商品列表</el-menu-item>
          <el-menu-item index="/product/add" v-if="$isAllowUser('商品添加')">添加商品</el-menu-item>
        </el-menu-item-group>

        <!-- 商品分类 -->
        <el-menu-item-group>
          <template slot="title">商品分类</template>
          <el-menu-item index="/product/classify/list" v-if="$isAllowUser('分类列表')">分类列表</el-menu-item>
          <el-menu-item index="/product/classify/add" v-if="$isAllowUser('分类添加')">添加分类</el-menu-item>
        </el-menu-item-group>

        <!-- 规格管理 -->
        <el-menu-item-group>
          <template slot="title">规格分类</template>
          <el-menu-item index="/product/specification/list" v-if="$isAllowUser('规格列表')">规格列表</el-menu-item>
          <el-menu-item index="/product/specification/add" v-if="$isAllowUser('规格添加')">添加规格</el-menu-item>
        </el-menu-item-group>

        <!-- 品牌管理 -->
        <el-menu-item-group>
          <template slot="title">品牌分类</template>
          <el-menu-item index="/product/brand/list" v-if="$isAllowUser('品牌列表')">品牌列表</el-menu-item>
          <el-menu-item index="/product/brand/add" v-if="$isAllowUser('品牌添加')">添加品牌</el-menu-item>
        </el-menu-item-group>

        <!-- 运费管理 -->
        <el-menu-item-group v-if="$isAllowUser('运费查看')">
          <template slot="title">运费管理</template>
          <el-menu-item index="/product/express">运费设置</el-menu-item>
        </el-menu-item-group>

      </el-submenu>

      <!-- 订单管理 -->
      <el-submenu index="order" v-if="$isAllowModule('订单模块')">
        <template slot="title"><i class="el-icon-date"></i>订单</template>
        <el-menu-item index="/order/list" v-if="$isAllowUser('订单列表')">所有订单</el-menu-item>
        <el-menu-item index="/order/list?type=2" v-if="$isAllowUser('退款申请单列表')">维权订单</el-menu-item>
      </el-submenu>

       <!-- 地址管理 -->
      <el-submenu index="address"  v-if="$isAllowModule('地址模块')">
        <template slot="title"><i class="el-icon-date"></i>地址管理</template>
        <el-menu-item index="/address/list" v-if="$isAllowUser('地址列表')">发货地址管理</el-menu-item>
        <el-menu-item index="/address/add" v-if="$isAllowUser('地址添加')">添加发货地址</el-menu-item>
      </el-submenu>

       <!-- 权限管理 -->
      <el-submenu index="right"  v-if="$isAllowModule('权限模块')">
        <template slot="title"><i class="el-icon-date"></i>权限管理</template>
        <el-menu-item index="/right/admin/list" v-if="$isAllowUser('管理员列表')">管理员</el-menu-item>
        <el-menu-item index="/right/role/list" v-if="$isAllowUser('角色列表')">角色</el-menu-item>
      </el-submenu>

      <!-- 网站设置 -->
      <el-submenu index="setting">
        <template slot="title"><i class="el-icon-setting"></i>网站设置</template>
        <el-menu-item index="/website/reset">修改密码</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      // 存储用户模块权限的临时数组
      moduleAuthorityArray: [],
      // 存储用户具体权限的临时数组
      userAuthorityArray: [],
      adminId: '',
      authorityArray: [],
      productModule: true,
      orderModule: true,
      addressModule: true,
      permissionModule: true
    }
  },
  created() {
    console.log('订单模块', this.$isAllowModule('订单模块'))
    console.log('地址模块', this.$isAllowModule('地址模块'))
    // this.getAdminId()
  },
  methods: {
    // 获取已登录用户的id
    async getAdminId() {
      const { code, data } = await api.get('/api/auth/isLogin')
      if (code === 200) {
        this.adminId = data._id
        this.getListAdminAuthorityGroups(this.adminId)
      }
    },
    async getListAdminAuthorityGroups(id) {
      const { code, data } = await api.get(`/api/permission/admin/${id}`)
      if (code === 200) {
        this.authorityArray = []
        this.authorityArray = data.role.permissionList
        this.moduleAuthorityArray = this.authorityArray.map(item => item.moduleName)
        this.moduleAuthorityArray = [...new Set(this.moduleAuthorityArray)]
        this.userAuthorityArray = this.authorityArray.map(item => item.identification)
        this.authorityArray = this.authorityArray.map(item => item.name)
        window.user = {}
        window.user.authorityArray = this.authorityArray
      }
      this.productModule = this.moduleAuthorityArray.includes('商品模块')
      this.addressModule = this.moduleAuthorityArray.includes('地址模块')
      this.orderModule = this.moduleAuthorityArray.includes('订单模块')
      this.permissionModule = this.moduleAuthorityArray.includes('权限模块')
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar{
  display: block;
  position: absolute;
  width: 220px;
  left: 0;
  top: 60px;
  bottom: 0;
  background-color: #020203;
  overflow-y: scroll;
}
.sidebar > ul {
  min-height: 100%;
}
</style>
