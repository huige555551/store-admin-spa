<template>
  <div class="login-wrap">
    <div class="ms-title">新周刊管理后台</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="account">
          <el-input v-model="ruleForm.account" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p style="font-size:12px;line-height:30px;color:#999;">Tips: 请保管好账号密码。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    const { code } = await api.get('/api/system/sysUser/isLogin')
    if (code === 200) {
      this.$router.replace('/')
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { code } = await api.post('/api/system/login', this.ruleForm)
          if (code === 200) {
            this.$notify.success({ title: '成功', message: '登录成功' })
            this.$router.replace('/')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #324157;
}
.ms-title{
  position: absolute;
  top:50%;
  width:100%;
  margin-top: -230px;
  text-align: center;
  font-size:30px;
  color: #fff;
}
.ms-login{
  position: absolute;
  left:50%;
  top:50%;
  width:300px;
  height:160px;
  margin:-150px 0 0 -190px;
  padding:40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn{
  text-align: center;
}
.login-btn button{
  width:100%;
  height:36px;
}
</style>
