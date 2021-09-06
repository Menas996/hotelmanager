<template>
  <div
    class="main"
    @keyup.down="switchInput"
    @keyup.enter="submitForm('ruleForm')"
  >
    <!-- 背景画布 -->
    <canvas id="particle-canvas" width="1245" height="902"></canvas>
    <div class="content">
      <div class="login">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm mainForm"
        >
          <h2>酒店用户管理系统</h2>
          <el-form-item label="账号" prop="loginId" class="loginid">
            <el-input
              type="text"
              v-model="ruleForm.loginId"
              placeholder="请输入您的账号..."
              autocomplete="off"
              ref="inputId"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="loginPwd" class="loginpwd">
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
              placeholder="请输入您的密码..."
              autocomplete="off"
              class="inputPwd"
              ref="inputPwd"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="loginPwd" class="remeberPwd">
            <el-checkbox v-model="ruleForm.checkMe" class="remeclick"
              >记住我</el-checkbox
            >
          </el-form-item>
          <el-form-item class="btn" label-width="0px">
            <el-button type="success" @click="submitForm('ruleForm')"
              >提交</el-button
            >
            <el-button @click="resetForm('ruleForm')"
              >重置</el-button
            ></el-form-item
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//导入md5加密方法
import { strToMd5 } from "../utils/md5";
import { startAnime } from "../assets/js/login.js";
export default {
  mounted() {
    if (this.anime) {
      startAnime();
      this.anime = false;
    }
  },
  data() {
    //验证账号名称
    var validateId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    //验证输入密码
    var validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      anime: true,
      ruleForm: {
        //表单数据
        loginId: "",
        //登录名
        loginPwd: "",

        checkMe: false,
      },
      //表单的验证数据
      rules: {
        //验证用户名
        loginId: [{ validator: validateId, trigger: "blur" }],
        //验证密码
        loginPwd: [{ validator: validatePwd, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //实现登录
          //对密码进行加密
          this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
          //success会传值，到自身位置
          let { message, success, token } = await this.$get(
            "/Admin/Login",
            this.ruleForm
          );
          if (success) {
            sessionStorage.setItem("token", token);
            //在浏览器中保存登录名
            sessionStorage.setItem(
              "roleId",
              this.$store.state.admin.admin.roleId
            );

            localStorage.setItem("loginId", this.ruleForm.loginId);
            //判断是否需要记住密码
            if (this.ruleForm.checkMe) {
              localStorage.setItem("loginPwd", this.ruleForm.loginPwd);
            }

            //将token信息放在请求头中
            this.$setToken();
            this.$router.push("/layout");
          } else {
            this.$msg_e(message);
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    switchInput() {
      this.$refs.inputId.blur();
      this.$refs.inputPwd.focus();
    },
  },
};
</script>
// 单一样式
<style lang="less">
.loginid,
.loginpwd {
  .el-form-item__label {
    color: #fff;
  }
}
.remeclick {
  .el-checkbox__label {
    color: #fff;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: lightgreen;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: lightgreen;
  }
}
</style>
<style lang='less' scoped>
/* 背景样式 */
#particle-canvas {
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgb(5, 145, 135) 0%,
    rgb(2, 115, 213) 100%
  );
  vertical-align: middle;
}
.main {
  width: 100vw;
  height: 100vh;
  position: relative;
  .content {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login {
    width: 400px;
    height: 200px;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    .mainForm {
      width: 450px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-262px, -55px);
      text-align: center;
      h2 {
        position: absolute;
        left: 38%;
        top: -47px;
        color: #fff;
        margin: 0;
        width: 40%;
      }
      .remeberPwd {
        float: left;
        text-align: left;
      }
      .btn {
        float: left;
        margin-left: 20px;
      }
    }
  }
}
</style>