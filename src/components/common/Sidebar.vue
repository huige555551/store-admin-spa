<template>
  <div class="sidebar">
    <el-menu :default-active="'welcome'" class="el-menu-vertical-demo" theme="dark" unique-opened router>
      <!-- 用户管理 -->
      <el-menu-item index="/user/list"><i class="el-icon-date"></i>用户管理</el-menu-item>

       <!-- 首页管理 -->
      <el-submenu index="index">
        <template slot="title"><i class="el-icon-date"></i>首页管理</template>
        <el-menu-item index="/index/banner">首页轮播</el-menu-item>
        <el-menu-item index="/feature/product">精选商品</el-menu-item>
      </el-submenu>

      <!-- 商品 -->
      <el-submenu index="product">
        <template slot="title"><i class="el-icon-date"></i>商品</template>
        
        <!-- 商品管理 -->
        <el-menu-item-group>
          <template slot="title">商品管理</template>
          <el-menu-item index="/product/list">商品列表</el-menu-item>
          <el-menu-item index="/product/add">添加商品</el-menu-item>
        </el-menu-item-group>

        <!-- 商品分类 -->
        <el-menu-item-group>
          <template slot="title">商品分类</template>
          <el-menu-item index="/product/classify/list">分类列表</el-menu-item>
          <el-menu-item index="/product/classify/add">添加分类</el-menu-item>
        </el-menu-item-group>

        <!-- 规格管理 -->
        <el-menu-item-group>
          <template slot="title">规格分类</template>
          <el-menu-item index="/product/specification/list">规格列表</el-menu-item>
          <el-menu-item index="/product/specification/add">添加规格</el-menu-item>
        </el-menu-item-group>

        <!-- 品牌管理 -->
        <el-menu-item-group>
          <template slot="title">品牌分类</template>
          <el-menu-item index="/product/brand/classify_list">品牌分类</el-menu-item>
          <el-menu-item index="/product/brand/list">品牌列表</el-menu-item>
          <el-menu-item index="/product/brand/add">添加品牌</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <!-- 订单管理 -->
      <el-submenu index="order">
        <template slot="title"><i class="el-icon-date"></i>订单</template>
        <el-menu-item index="/order/list">所有订单</el-menu-item>
        <el-menu-item index="/order/list?type=2">维权订单</el-menu-item>
      </el-submenu>

       <!-- 地址管理 -->
      <el-submenu index="address">
        <template slot="title"><i class="el-icon-date"></i>地址管理</template>
        <el-menu-item index="/address/list">发货地址管理</el-menu-item>
        <el-menu-item index="/address/add">添加发货地址</el-menu-item>
      </el-submenu>

      <!-- 网站设置 -->
      <el-submenu index="setting">
        <template slot="title"><i class="el-icon-setting"></i>网站设置</template>
        <el-menu-item index="/website/admin">权限设置</el-menu-item>
        <el-menu-item index="/website/reset">修改密码</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
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
