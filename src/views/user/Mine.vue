<template>
  <div class="flex">
    <div class="ico">
      <el-image
        style="width: 200px; height: 220px"
        :src="BASE_URL_AdminImg + admin.photo"
        fit="cover"
      ></el-image>
    </div>
    <div class="content">
      <p>账号:{{ admin.loginId }}</p>
      <p>姓名:{{ admin.name }}</p>
      <p>电话:{{ admin.phone }}</p>
      <p>角色:{{ admin.role.roleName }}</p>
    </div>
  </div>
</template>

<script>
import { BASE_URL_AdminImg, Upload_AdminImg_URL } from "../../config";
import { mapState } from "vuex";
export default {
  data() {
    return {
      BASE_URL_AdminImg,
      Upload_AdminImg_URL,
    };
  },
  computed: {
    ...mapState("admin", ["admin"]),
  },
};
</script>

<style scoped lang="less">
.flex {
  display: flex;
  .ico {
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
  }
  .content {
    margin-left: 10px;
    p {
      line-height: 30px;
    }
  }
}
</style>