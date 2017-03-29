<!-- TODO -->
<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>网站设置</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>修改密码</span>
      </el-form-item>
    </el-form>

    <el-form label-width="100px" style="width: 400px">
      <el-form-item label="旧密码">
        <el-input type="password" v-model="form.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="form.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="form.rePassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    submit() {
      if (!this.form.oldPassword || !this.form.newPassword || !this.form.oldPassword || this.form.newPassword !== this.form.rePassword) {
        return this.$notify.error({ title: '失败', message: '密码框不能为空且新密码与确认密码应一致' })
      }
      const { code } = api.post('/api/system/sysUser/updatePassword', this.form)
      if (code === 200) {
        this.$notify.success({ title: '成功', message: '修改成功' })
        this.router.push('/login')
      }
    }
  }
}
</script>
