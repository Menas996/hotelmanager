<template>
  <div>
    <div class="search">
      <el-form>
        <el-form-item>
          <label style="color: #666; font-size: 12px">客户姓名：</label>
          <el-input
            size="mini"
            style="width: 200px; height: 30px"
            v-model="guestName"
            placeholder="请输入客户姓名"
            ref="select1"
            clearable
          ></el-input>
          <label style="color: #666; font-size: 12px; margin-left: 10px"
            >结账状态：</label
          >
          <el-select
            v-model="ruleForm.resideStateList"
            placeholder="结账状态"
            size="mini"
            ref="select2"
            style="margin: 0 10px"
            clearable
          >
            <el-option
              v-for="item in resideStateList"
              :key="item.resideStateId"
              :label="item.resideStateName"
              :value="item.resideStateId"
            >
            </el-option>
          </el-select>

          <el-button
            class="searchToTag"
            size="mini"
            type="success"
            @click="handleTagSearch"
            >查询</el-button
          >
          <el-button type="warning" size="mini" @click="exportClick"
            >导出Excel</el-button
          >
          <el-button type="primary" size="mini" @click="addClick"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      style="width: 99%,min-width:1000px"
      size="mini"
    >
      <el-table-column label="客户姓名" width="80">
        <template slot-scope="scope">
          {{ scope.row.guestName }}
        </template>
      </el-table-column>
      <el-table-column label="客户电话" width="180">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="180">
        <template slot-scope="scope">
          {{ scope.row.identityId }}
        </template>
      </el-table-column>
      <el-table-column label="入住房间" width="100">
        <template slot-scope="scope">
          {{ scope.row.roomId }}
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="80">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="房间价格" width="100">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.roomTypePrice }}
        </template>
      </el-table-column>
      <el-table-column label="入住日期" width="200">
        <template slot-scope="scope">
          {{ scope.row.resideDate }}
        </template>
      </el-table-column>
      <el-table-column label="离开日期" width="200">
        <template slot-scope="scope">
          {{ scope.row.leaveDate }}
        </template>
      </el-table-column>
      <el-table-column label="押金" width="100">
        <template slot-scope="scope">
          {{ scope.row.deposit }}
        </template>
      </el-table-column>
      <el-table-column label="入住人数" width="100">
        <template slot-scope="scope">
          {{ scope.row.guestNum }}
        </template>
      </el-table-column>
      <el-table-column label="消费金额" width="100">
        <template slot-scope="scope">
          {{ scope.row.totalMoney }}
        </template>
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="100"
        :filters="[
          { text: '已结账', value: '已结账' },
          { text: '未结账', value: '未结账' },
        ]"
      >
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.resideState.resideStateName === '已结账'
                ? 'success'
                : 'warning'
            "
            disable-transitions
            >{{ scope.row.resideState.resideStateName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.resideStateId === 1"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.resideStateId === 1"
            type="text"
            size="small"
            style="color: red"
            @click="handlePay(scope.$index, scope.row)"
            >结账</el-button
          >
          <!-- 结账的用户才可以删除 -->
          <el-button
            v-if="scope.row.resideStateId === 2"
            type="text"
            size="small"
            style="color: #ff9400"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
    >
    </el-pagination>
    <el-drawer
      :title="isAdd ? '添加客房类型' : '修改客房类型'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="drawerClose"
      size="50%"
    >
      <div style="padding: 0 20px 0 0">
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="guestName">
            <el-input
              v-model="ruleForm.guestName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="identityId">
            <el-input
              v-model="ruleForm.identityId"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomTypeName">
            <el-select
              @change="roomTypeChange"
              v-model="ruleForm.roomTypeId"
              placeholder="请选择客房类型"
              clearable
            >
              <el-option
                v-for="item in roomTypeList"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住房间" prop="roomId">
            <el-select
              v-model="ruleForm.roomId"
              placeholder="请选择客房"
              clearable
            >
              <el-option
                v-for="item in roomList"
                :key="item.roomId"
                :label="item.roomId"
                :value="item.roomId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="入住时间" prop="resideDate">
            <el-date-picker
              v-model="ruleForm.resideDate"
              type="datetime"
              placeholder="请选择入住时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="押金" prop="deposit">
            <el-input v-model="ruleForm.deposit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="入住人数" prop="guestNum">
            <el-input v-model="ruleForm.guestNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加" : "修改"
            }}</el-button>
            <el-button @click="resetForm('ruleForm')"
              >取消</el-button
            ></el-form-item
          >
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import xlsx from "../../utils/xlsx.js";
//导入房间图片根路径， 和 房间图片上传路径
export default {
  data() {
    //验证姓名
    var validateIdentityId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else {
        callback();
      }
    };
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住房间"));
      } else {
        callback();
      }
    };
    var validateGuestName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户姓名"));
      } else {
        callback();
      }
    };
    var validateResideDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住日期"));
      } else {
        callback();
      }
    };
    var validateGuestNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住人数"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户电话"));
      } else {
        callback();
      }
    };
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间类型"));
      } else {
        callback();
      }
    };
    var validateDeposit = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入押金"));
      } else {
        callback();
      }
    };

    return {
      //定义房间图片对应的房间号
      roomId: "",
      currentPage: 1,
      //初始每页数据数pagesize和数据data
      pageSize: 5,
      tableData: [],
      //当前页码
      pageIndex: 1,
      //客户姓名(用于搜索)
      guestName: "",
      //结账状态编号(用于搜索)
      resideStateId: "",
      //客房类型
      roomTypeId: "",
      roomId: "",
      roomList: [],
      roomTypeList: [],
      //结账状态列表(用于查询)
      resideStateList: [],
      //客房类型列表(用于添加和修改)
      roomTypeList2: [],
      roomStateId: [],
      //是否打开抽屉
      drawer: false,
      //方向
      direction: "rtl",
      //抽屉是否做添加
      isAdd: true,
      roleId: "",
      ruleForm: {
        //客户编号
        guestName: "",
        //电话
        phone: "",
        //身份证号
        identityId: "",
        //房间号
        roomId: "",
        //房间类型编号
        roomTypeId: "",
        //入住人数
        resideDate: "",
        //押金
        deposit: "",
        //入住人数
        guestNum: "",
      },
      //表单的验证数据
      rules: {
        //验证角色名
        identityId: [{ validator: validateIdentityId, trigger: "blur" }],
        //验证状态
        roomId: [{ validator: validateRoomId, trigger: "change" }],
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "change" }],
        //验证类型价格
        guestName: [{ validator: validateGuestName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        resideDate: [{ validator: validateResideDate, trigger: "blur" }],
        guestNum: [{ validator: validateGuestNum, trigger: "blur" }],
        deposit: [{ validator: validateDeposit, trigger: "blur" }],
        guestNum: [{ validator: validateGuestNum, trigger: "blur" }],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
    //调用获取结账状态列表的方法
    this.getResideStateList();
    //调用获取客房列表的方法
    this.getRoomTypeList();
  },
  //方法
  methods: {
    //导出Excel的方法
    exportClick() {
      //组织导出的数据
      let json = this.tableData.map((r) => {
        return {
          guestName: r.guestName,
          phone: r.phone,
          identityId: r.identityId,
          roomId: r.roomId,
          roomTypeName: r.room.roomType.roomTypeName,
          bedNum: r.room.roomType.bedNum,
          roomTypePrice: r.room.roomType.roomTypePrice,
          resideDate: r.resideDate,
          leaveDate: r.leaveDate,
          deposit: r.deposit,
          guestNum: r.guestNum,
          totalMoney: r.totalMoney,
        };
      });
      //组织表头对象
      let fields = {
        guestName: "客户姓名",
        phone: "客户电话",
        identityId: "身份证号",
        roomId: "入住房间",
        roomTypeName: "房间类型",
        bedNum: "床位数",
        roomTypePrice: "房间价格",
        resideDate: "入住日期",
        leaveDate: "离开日期",
        deposit: "押金",
        guestNum: "入住人数",
        totalMoney: "消费金额",
      };
      //定义文件名称
      let filename = "客户信息表";
      //将指定的数据导出到一个excel文件中
      xlsx(json, fields, filename);
    },

    //进行分页的方法
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1; //每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //上传成功
    handleTagSearch() {
      //重新调用表格数据的方法
      let res1 = this.$refs.select1.value;
      let res2 = this.$refs.select2.value;
      this.currentPage = 1;
      this.getTableData(res1, res2);
    },
    async getResideStateList() {
      let res = await this.$get("/ResideState/List");
      this.resideStateList = res;
    },
    //获取客房状态列表的方法
    async getRoomStateList() {
      let res = await this.$get("/RoomState/List");
      this.roomStateList = res;
      //获取房间状态(没有入住的状态)
      let res2 = await this.$get("/RoomState/ListToUpdate");
      this.roomStateList2 = res2;
    },
    //获取客房类型列表的方法
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
    },
    //上传之前的方法
    beforeAvatarUpload(file) {
      //定义可以上传的图片格式类型数组
      let img_type_list = ["image/jpeg", "image/png", "image/gif"];
      //通过数组中的eincludes()方法，判断是否包含
      const isJPG = img_type_list.includes(file.type);
      console.log(file.size / 1024 / 1024 / 10);
      const isLt1M = (file.size / 1024 / 1024) * 10 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG PNG GIF格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt1M;
    },
    //调用
    async getTableData(res1, res2) {
      const { data } = await this.$get("/GuestRecord/List", {
        guestName: res1 || null,
        resideStateId: res2 || null,
      });
      console.log(data);
      this.tableData = data;
    },
    async handleEdit(index, row) {
      //获取登录名
      let guestId = row.guestId;
      //根据角色编号，获取角色对象
      let res = await this.$get("/GuestRecord/GetOne", { guestId });
      //获取到的客房类型对象，重新赋值给
      this.ruleForm = res;
      //给表单对象，添加一个id,用于备份房间号
      this.ruleForm.roomTypeId = res.room.roomTypeId;

      //表示修改
      this.drawer = true;
      //
      this.isAdd = false;
    },

    //删除表格数据
    async handleDelete(index, row) {
      //获取角色编号
      await this.$confirm("是否确认删除？")
        .then(async () => {
          //获取编号
          let guestId = row.guestId;
          //删除角色编号
          let { success, message } = await this.$post("/GuestRecord/Delete", {
            guestId,
          });
          if (success) {
            this.$msg_s(message);
            this.getTableData();
          } else {
            this.$msg_e(message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //关于结账的按钮
    async handlePay(index, row) {
      await this.$confirm("是否确认？")
        .then(async () => {
          let guestId = row.guestId;
          let { totalMoney } = await this.$post("/GuestRecord/Checkout", {
            guestId,
          });
          this.$msg_s("结账成功！需要支付" + totalMoney + "元客房费用");
          //重新加载表格数据
          this.getTableData();
        })
        .catch((err) => {
          this.$msg_e("已取消！");
        });
    },
    //关闭抽屉的方法
    addClick() {
      this.isAdd = true;
      this.drawer = true;
      if (this.ruleForm.roomId) {
        this.resetForm("ruleForm");
      }
    },
    //客房类型
    async roomTypeChange() {
      //先清空表单中roomId的值
      this.ruleForm.roomId = "";
      //获取客房类型编号
      let roomTypeId = this.ruleForm.roomTypeId;
      if (roomTypeId) {
        //根据客房类型编号，获取对应的客房信息,客房的状态必须是“空闲”
        let { data } = await this.$get("Room/List", {
          //房间类型编号
          roomTypeId,
          //状态为空闲
          roomStateId: 1,
          //顾客的编号
          guestId: this.ruleForm.guestId || 0,
        });

        this.roomList = data;
      }
    },
    drawerClose(done) {
      this.drawer = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //执行修改功能
          if (!this.isAdd) {
            let { success, message } = await this.$post(
              "/GuestRecord/Update",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              this.getTableData();
              this.resetForm("ruleForm");
            } else {
              this.$msg_e(message);
            }
          } else {
            //执行添加功能
            let { success, message } = await this.$post(
              "/GuestRecord/Add",
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
        //客户编号
        guestName: "",
        //电话
        phone: "",
        //身份证号
        identityId: "",
        //房间号
        roomId: "",
        //房间类型编号
        roomTypeId: "",
        //入住人数
        resideDate: "",
        //押金
        deposit: "",
        //入住人数
        guestNum: "",
      };
    },
  },
};
</script>

<style lang="less">
.search {
  margin: 10px;
}
</style>