<template>
  <div class="error404">
    <img src="@/assets/img/404.png" @click="goToHome" />
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push("/layout");
    },
  },
};
</script>

<style scoped lang="less">
.error404 {
  margin: auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>