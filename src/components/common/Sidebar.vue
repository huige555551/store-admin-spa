<template>
  <div class="sidebar">
    <el-menu :default-active="'welcome'" class="el-menu-vertical-demo" theme="dark" unique-opened router>
      <!-- 用户管理 -->
      <el-menu-item index="/user/list"><i class="el-icon-date"></i>用户管理</el-menu-item>

      <!-- 首页管理 -->
      <el-submenu index="index">
        <template slot="title"><i class="el-icon-date"></i>首页管理</template>
        <el-menu-item index="/index/banner">轮播管理✅-stone</el-menu-item>
        <el-menu-item index="/feature/article">精选文章✅-Lee</el-menu-item>
        <el-menu-item index="/feature/newmedia">精选新媒体✅-Lee</el-menu-item>
        <el-menu-item index="/feature/video">精选视频✅-Lee</el-menu-item>
        <el-menu-item index="/feature/audio">精选音频✅-Lee</el-menu-item>
      </el-submenu>

      <!-- 固定栏目 -->
      <el-submenu index="column">
        <template slot="title"><i class="el-icon-date"></i>固定栏目</template>
        <el-menu-item-group>
          <template slot="title">封面管理</template>
          <el-menu-item index="/cover/list">封面列表 - s</el-menu-item>
          <el-menu-item index="/cover/add">添加封面✅-hui</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template slot="title">漫画管理</template>
          <el-menu-item index="/comics/list">漫画列表-hui✅</el-menu-item>
          <el-menu-item index="/comics/add">添加漫画-hui✅</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template slot="title">插画管理</template>
          <el-menu-item index="/illustration/list">插画列表-hui✅</el-menu-item>
          <el-menu-item index="/illustration/add">添加插画-hui✅</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <!-- 栏目文章 -->
      <el-submenu index="article">
        <template slot="title"><i class="el-icon-date"></i>栏目文章</template>
        <el-menu-item index="/column/list">栏目列表✅-Lee</el-menu-item>
        <el-menu-item index="/author/list">作者列表✅-Lee</el-menu-item>
        <el-menu-item index="/article/list">文章列表✅-hui</el-menu-item>
        <el-menu-item index="/article/add">添加文章✅-Lee</el-menu-item>
      </el-submenu>

      <!-- 视频管理 -->
      <el-submenu index="video">
        <template slot="title"><i class="el-icon-date"></i>视频管理</template>
        <el-menu-item index="/video/category">分类管理✅-Lee</el-menu-item>
        <el-menu-item index="/video/list">视频列表✅-Lee</el-menu-item>
        <el-menu-item index="/video/add">添加视频✅-Lee</el-menu-item>
        <el-menu-item index="/video/banner">轮播管理✅-hui</el-menu-item>
      </el-submenu>

      <!-- 音频管理 -->
      <el-submenu index="audio">
        <template slot="title"><i class="el-icon-date"></i>音频管理</template>
        <el-menu-item index="/audio/category">分类管理✅-Lee</el-menu-item>
        <el-menu-item index="/audio/list">音频列表✅-Lee</el-menu-item>
        <el-menu-item index="/audio/add">添加音频✅-Lee</el-menu-item>
      </el-submenu>

      <!-- 新媒体管理 -->
      <el-submenu index="newmedia">
        <template slot="title"><i class="el-icon-date"></i>新媒体管理－hui</template>
        <el-menu-item index="/newmedia/category">分类管理✅</el-menu-item>
        <el-menu-item index="/newmedia/list">文章列表✅</el-menu-item>
        <el-menu-item index="/newmedia/add">添加文章✅</el-menu-item>
        <el-menu-item index="/newmedia/banner">轮播管理✅</el-menu-item>
      </el-submenu>

      <!-- 评论管理 -->
      <el-menu-item index="/comment/list"><i class="el-icon-date"></i>评论管理</el-menu-item>

      <!-- 图书管理 -->
      <el-submenu index="book">
        <template slot="title"><i class="el-icon-date"></i>图书管理</template>
        <el-menu-item index="/book/list">图书列表✅-Lee</el-menu-item>
        <el-menu-item index="/book/add">添加图书✅-Lee</el-menu-item>
      </el-submenu>

      <!-- 活动管理 -->
      <el-submenu index="activity">
        <template slot="title"><i class="el-icon-date"></i>活动管理</template>
        <el-menu-item index="/activity/category">活动分类✅-Lee</el-menu-item>
        <el-menu-item index="/activity/list">活动列表</el-menu-item>
        <el-menu-item index="/activity/add">添加活动</el-menu-item>
        <el-menu-item index="/activity/banner">轮播管理✅</el-menu-item>
      </el-submenu>

      <!-- 网站设置 -->
      <el-submenu index="setting">
        <template slot="title"><i class="el-icon-setting"></i>网站设置</template>
        <el-menu-item index="/website/ad">广告设置✅-Lee</el-menu-item>
        <el-menu-item index="/website/job">岗位列表✅-Lee</el-menu-item>
        <el-menu-item index="/website/partner">合作伙伴✅-Lee</el-menu-item>
        <el-menu-item index="/website/subscription">网上订阅✅-Lee</el-menu-item>
        <el-menu-item index="/website/reset">修改密码-Lee</el-menu-item>
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
