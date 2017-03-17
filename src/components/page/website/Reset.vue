<template>
  <div>
    <el-form label-width="100px" style="width: 400px">
      <el-form-item label="旧密码">
        <el-input v-model="form.oldPass"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.newPass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.repeatPass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  }
}
</script>
