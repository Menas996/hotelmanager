<template>
  <div>
    <div class="search">
      <el-button type="primary" @click="addClick">添加客房类型</el-button>
    </div>
    <el-table :data="tableData" style="width: 99%,min-width:1000px" size="mini">
      <el-table-column label="类型编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypeId }}
        </template>
      </el-table-column>
      <el-table-column label="类型名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="180">
        <template slot-scope="scope">
          {{ scope.row.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypePrice }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
          <el-form-item label="类型名称" prop="roomTypeName">
            <el-input
              v-model="ruleForm.roomTypeName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 不需要修改密码 -->
          <el-form-item label="床位数" prop="bedNum">
            <el-input
              v-model.number="ruleForm.bedNum"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="roomTypePrice">
            <el-input
              v-model.number="ruleForm.roomTypePrice"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="typeDescription">
            <quill-editor
              v-model="ruleForm.typeDescription"
              ref="myQuillEditor"
              style="height: 250px; margin-bottom: 120px"
            >
            </quill-editor>
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
//导入md5加密方法
import { strToMd5 } from "../../utils/md5";
//导入管理员头像根路径
import { BASE_URL_AdminImg, Upload_AdminImg_URL } from "../../config";
export default {
  data() {
    //验证姓名
    var validateRoomTypeName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入类型名称"));
      } else {
        callback();
      }
    };
    //验证电话
    var validateBedNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else if (value === "") {
        callback(new Error("请输入床位数"));
      } else {
        callback();
      }
    };
    //验证角色
    var validateRoomTypePrice = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else if (value === "") {
        callback(new Error("请输入价格"));
      } else {
        callback();
      }
    };
    var validateTypeDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请添加描述"));
      } else {
        callback();
      }
    };

    return {
      count: 0,
      currentPage: 1,
      //初始每页数据数pagesize和数据data
      pageSize: 5,
      count: "",
      tableData: [],
      //角色列表
      roleList: [],
      roleListToSearch: [],
      //管理员头像路径
      BASE_URL_AdminImg,
      //管理员头像根路径
      Upload_AdminImg_URL,
      //是否打开抽屉
      drawer: false,
      //方向
      direction: "rtl",
      //抽屉是否做添加
      isAdd: true,
      roleId: "",
      ruleForm: {
        //类型名称
        roomTypeName: "",
        //床位数
        bedNum: "",
        //类型名称
        roomTypePrice: "",
        //类型描述
        typeDescription: "",
      },
      //表单的验证数据
      rules: {
        //验证角色名
        roomTypeName: [{ validator: validateRoomTypeName, trigger: "blur" }],
        bedNum: [{ validator: validateBedNum, trigger: "blur" }],
        roomTypePrice: [{ validator: validateRoomTypePrice, trigger: "blur" }],
        typeDescription: [
          { validator: validateTypeDescription, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
    //调用获取角色列表的方法
    this.getRoleList();
  },
  //方法
  methods: {
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
      let res = this.$refs.select.value;
      this.currentPage = 1;
      this.getTableData(res);
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
    async getTableData() {
      const data = await this.$get("/RoomType/List");
      this.tableData = data;
    },
    //获取角色列表的方法
    async getRoleList() {
      const res = await this.$get("/Role/List");
      this.roleListToSearch = res;
      this.roleList = res;
    },
    async handleEdit(index, row) {
      //获取登录名
      let roomTypeId = row.roomTypeId;
      //根据角色编号，获取角色对象
      let res = await this.$get("/RoomType/GetOne", { roomTypeId });
      //获取到的客房类型对象，重新赋值给
      this.ruleForm = res;
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
          let roomTypeId = row.roomTypeId;
          //删除角色编号
          let { success, message } = await this.$post("/RoomType/Delete", {
            roomTypeId,
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
    //关闭抽屉的方法
    addClick() {
      this.isAdd = true;
      this.drawer = true;
      this.resetForm("ruleForm");
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
              "/RoomType/Update",
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
              "/RoomType/Add",
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
      this.ruleForm.roomTypeName = "";
      this.ruleForm.bedNum = "";
      this.ruleForm.roomTypePrice = "";
      this.ruleForm.typeDescription = "";
    },
  },
};
</script>

<style lang="less">
.search {
  margin: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.searchToTag {
  margin-left: 10px;
}
</style>