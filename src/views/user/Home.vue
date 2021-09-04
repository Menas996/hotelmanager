<template>
  <div class="main" ref="main"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      totalTypePrice: [],
    };
  },
  created() {},
  async mounted() {
    //获取每种房型的销售额
    let res = await this.$get("/RoomType/TotalTypePrice");
    this.totalTypePrice = res;
    console.log(res);
    //基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main);
    //绘制图表
    myChart.setOption({
      title: {
        text: "客房销售额统计",
      },
      tooltip: {},
      xAxis: {
        data: this.totalTypePrice.map((r) => r.roomtypeName),
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: this.totalTypePrice.map((r) => r.totalMoney),
        },
      ],
    });
  },
};
</script>

<style scoped lang="less">
.main {
  width: 1000px;
  height: 500px;
  border: 1px solid #ccc;
}
</style>