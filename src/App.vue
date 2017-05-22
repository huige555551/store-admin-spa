<template>
  <div id="app">
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html, body, #app, .wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}
body {
  font-family: "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
  background-color: #f2f4f6;
}
a {
  text-decoration: none;
}
.content {
  background: none repeat scroll 0 0 #fff;
  position: absolute;
  left: 220px;
  right: 0;
  top: 60px;
  bottom: 0;
  width: auto;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  background-color: #f2f4f6;
}
.content > div {
  padding: 20px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 2px rgba(0,0,0,0.05), 0 1px 0 rgba(0,0,0,0.05);
}
.pagination {
  margin: 20px 0;
  text-align: right;
}
.el-table td, .el-table th {
  padding: 3px;
}
.el-dialog.el-dialog--small .el-form .el-form-item:not(.custom-input) {
  .el-input, .el-textarea {
    width: 320px;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #f6f6f6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.flex{
  display: flex;
}
</style>
