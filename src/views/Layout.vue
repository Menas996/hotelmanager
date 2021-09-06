<template>
  <div class="main">
    <!-- 左侧导航 -->
    <div
      class="left"
      :style="{
        backgroundColor: themeColor,
        width: !isCollapse ? '200px' : 'auto',
      }"
    >
      <div class="logo">Bing</div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        router
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-if="this.$store.state.admin.admin.roleId === 1"
              index="/layout/role"
              >角色管理</el-menu-item
            >
            <el-menu-item index="/layout/admin">账号管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-home"></i>
            <span>客房管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              index="/layout/roomtype"
              v-if="this.$store.state.admin.admin.roleId === 1"
              >类型管理</el-menu-item
            >
            <el-menu-item index="/layout/room">客房管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span>客户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/guest">客户管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4" v-if="this.$store.state.admin.admin.roleId === 1">
          <template slot="title">
            <i class="el-icon-s-operation"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/permission">权限管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <!-- 左侧导航end -->
    <div class="right">
      <!-- 右侧内容 -->
      <div class="nav" :style="{ backgroundColor: themeColor }">
        <div class="icon">
          <i
            :class="isCollapse ? 'el-icon-right' : 'el-icon-back'"
            @click="isCollapse = !isCollapse"
          ></i>
        </div>
        <!-- 导航栏开启router属性，设置导航栏，开始路由模式 -->
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          :background-color="themeColor"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="min-width: 500px"
          router
        >
          <el-menu-item index="/layout">
            <i class="el-icon-house"></i>Home</el-menu-item
          >
          <el-menu-item index="/layout/message">
            <i class="el-icon-chat-line-square"></i>Message</el-menu-item
          >
          <el-menu-item index="/layout/email">
            <i class="el-icon-message"></i>Email</el-menu-item
          >
          <el-submenu index="/layout">
            <template slot="title"
              ><i class="el-icon-ice-cream-round"></i>Theme</template
            >
            <el-menu-item
              @click="changeTheme(item.value)"
              v-for="(item, index) in theme"
              :key="index"
              >{{ item.name }}</el-menu-item
            >
            <!-- <el-menu-item index="4-1">蓝色主题</el-menu-item> -->
            <!-- <el-menu-item index="4-2">灰色主题</el-menu-item>
            <el-menu-item index="4-3">红色主题</el-menu-item>
            <el-menu-item index="4-4">绿色主题</el-menu-item>
            <el-menu-item index="4-5">黑色主题</el-menu-item> -->
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">{{ admin.name }}</template>
            <el-menu-item index="/layout/mine">个人中心</el-menu-item>
            <el-menu-item index="/layout/resetpwd">修改密码</el-menu-item>
            <el-menu-item index="" @click="exit">退出系统</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!-- 内容区域 -->
      <div class="content">
        <!-- 路由视图 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      activeIndex2: "1",
      //主题颜色，现在缓存中寻找有无设置，有就调用自定义设置
      themeColor: localStorage.getItem("theme") || "#101f30",
      //是否折叠菜单
      isCollapse: false,
    };
  },
  created() {
    let loginId = localStorage.getItem("loginId");
    // let roleId = sessionStorage.setItem("roleId",);

    if (!loginId) {
      //如果用户名为空，就跳回登陆页面
      this.$router.push("/login");
    }
    //根据用户名，获取用户信息
    this.$get("/Admin/GetOne", { loginId }).then((res) => {
      this.setAdmin(res);
      sessionStorage.setItem("roleId", this.$store.state.admin.admin.roleId);
      console.log(this.$store.state.admin.admin.roleId);
    });
  },
  computed: {
    //导入vuex主题数据
    ...mapState("theme", ["theme"]),
    ...mapState("admin", ["admin"]),
  },
  methods: {
    //导入vuex登录账户的方法
    ...mapMutations("admin", ["setAdmin"]),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    changeTheme(color) {
      //切换主题,同时将主题保存到本地存储中
      this.themeColor = color;
      localStorage.setItem("theme", color);
    },
    exit() {
      //清除浏览器缓存
      //   sessionStorage.removeItem("token");
      //   localStorage.removeItem("loginId");
      //   localStorage.removeItem("loginPwd");
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang='less'>
i {
  color: #fff;
}

.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  // 左侧样式
  .left {
    transition: width 1s;
    .logo {
      width: 90%;
      color: white;
      font-size: 18px;
      text-align: center;
      padding: 10px 0;
      border: 1px solid #fff;
      margin: 10px auto;
    }
  }
  //右侧样式
  .right {
    flex: 1;
    //顶部导航
    .nav {
      height: 60px;
      display: flex;
      justify-content: space-between;
      .icon {
        font-size: 30px;
        line-height: 60px;
        margin-left: 10px;
      }
    }
  }
}
</style>