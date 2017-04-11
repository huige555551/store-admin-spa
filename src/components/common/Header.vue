<template>
  <div class="header">
    <div class="logo">
      <img class="user-logo" src="../../assets/logo.png" style="height: 30px; vertical-align: middle; margin-right: 10px;">
      网站管理后台
    </div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user-logo" src="../../assets/logo2.jpg">
          {{username}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="reset">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'

export default {
  data() {
    return {
      username: '管理员'
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'loginout') {
        // $.cookie('name', null, { path: '/' })
        this.$router.push('/login')
      } else if (command === 'reset') {
        this.$router.push('/website/reset')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  z-index: 1;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 20px;
  line-height: 60px;
  color: #353535;
  background-color: #fbfbfb;
  box-shadow: 0 2px 2px rgba(0,0,0,0.05), 0 1px 0 rgba(0,0,0,0.05);
}
.header .logo {
  float: left;
  width: 250px;
  margin-left: 20px;
}
.user-info {
  float: right;
  padding-right: 30px;
  font-size: 16px;
  color: #353535;
}
.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 40px;
  color: #353535;
  cursor: pointer;
  vertical-align: middle;
}
.user-info .user-logo {
  position: absolute;
  left:0;
  top:15px;
  width:30px;
  height:30px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
