<template>
  <div></div>
</template>

<script>
export default {
  async created() {
    //从浏览器的缓存中，获取登录名和密码
    let loginId = localStorage.getItem("loginId");
    let loginPwd = localStorage.getItem("loginPwd");
    //如果登录名或者密码有一个没有值
    if (!loginId || !loginPwd) {
      //跳转到登录页
      this.$router.push("/login");
    } else {
      let { success, token } = await this.$get("Admin/Login", {
        loginId,
        loginPwd,
      });
      //判断是否登陆成功
      if (success) {
        sessionStorage.setItem("token", token);
        //将token信息放到请求头中
        this.$setToken();
        //跳转到后台管理页面
        this.$router.push("/layout");
      } else {
        //跳转到登录页
        this.$router.push("/login");
      }
    }
  },
};
</script>

<style scoped lang="less">
</style>