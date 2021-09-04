<template>
  <div style="width: 500px">
    <el-form
      size="mini"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- 不需要修改密码 -->
      <el-form-item label="原始密码" prop="oldLoginPwd">
        <el-input
          type="password"
          v-model="ruleForm.oldLoginPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="最新密码" prop="newLoginPwd">
        <el-input
          type="password"
          v-model="ruleForm.newLoginPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="loginPwd2">
        <el-input
          type="password"
          v-model="ruleForm.loginPwd2"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >修改</el-button
        >
        <el-button @click="resetForm('ruleForm')">取消</el-button></el-form-item
      >
    </el-form>
  </div>
</template>

<script>
import { strToMd5 } from "../../utils/md5";
export default {
  data() {
    //验证原始密码
    var validateLoginPwdOld = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    //验证密码二
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.newLoginPwd) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        //管理员编号
        id: this.$store.state.admin.admin.id,
        //原始密码
        oldLoginPwd: "",
        //密码
        newLoginPwd: "",
        //确认密码
        loginPwd2: "",
      },
      rules: {
        oldLoginPwd: [{ validator: validateLoginPwdOld, trigger: "blur" }],
        newLoginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.oldLoginPwd = strToMd5(this.ruleForm.oldLoginPwd);
          this.ruleForm.newLoginPwd = strToMd5(this.ruleForm.newLoginPwd);
          //执行添加功能
          let { success, message } = await this.$post(
            "/Admin/ResetPwd",
            this.ruleForm
          );
          //判断是否表单数据是否验证成功
          if (success) {
            this.$msg_s(message);
            //获取最新的信息
            this.getTableData();
            //清空表单
            this.resetForm("ruleForm");
          } else {
            this.$msg_e(message);
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields();
      //清空表单数据
      this.ruleForm = {
        id: this.$store.state.admin.admin.id,
        //原始密码
        loginPwdOld: "",
        //密码
        loginPwd: "",
        //确认密码
        loginPwd2: "",
      };
    },
  },
};
</script>

<style>
</style>