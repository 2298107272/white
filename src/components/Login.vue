<template>
  <div class="con">
    <div class="box">
      <h2>快吧后台管理系统</h2>
      <el-form label-width="0" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item class="ip1" prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" class="btn1" @click="submit('ruleForm')">立即登录</el-button>
          <el-button type="info" @click="del('ruleForm')">重置信息</el-button>
        </el-form-item>
      </el-form>
    </div>
   
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  create(){
    
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        // this.$router.push('/home')
        window.sessionStorage.setItem('token', res.data.token)
        if(this.$router.push('/home')){
          this.$message.success('登录成功')
        }
          this.openFullScreen2()
      })
    },
    del() {
      this.$refs.ruleForm.resetFields()
    },
    //loading加载
     openFullScreen2() {
        const loading = this.$loading({
          lock: true,
          text: '页面正在努力加载中。。。',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 1500);
  }
  }
}
</script>

<style lang="less" scoped>
.con {
   background: url('../assets/ab317250086a174a0ffa9effbbc8285a.jpg') center no-repeat;
    background-size: 100% 100%;
  height: 100%;
  .box {
    position: absolute;
    width: 450px;
    height: 400px;
    background:rgba(37, 37, 129, 0.2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 50px;
  }
  h2 {
    text-align: center;
    margin-bottom: 50px;
    font-size: 35px;
    font-family: serif;
  }
  .btn {
    margin-top: 70px;
    text-align: center;
  }
  .ip1 {
    margin-bottom: 40px;
  }
  .btn1 {
    margin-right: 30px;
  }
}
</style>
