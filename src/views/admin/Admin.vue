<template>
  <div>
    <div class="search">
      <el-form
        ><el-form-item label="角色" prop="roleId">
          <el-select
            v-model="ruleForm.roleId"
            placeholder="请选择角色"
            ref="select"
            clearable
          >
            <el-option
              v-for="item in roleListToSearch"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
          <el-button class="searchToTag" @click="handleTagSearch"
            >查询角色</el-button
          >
          <el-button type="primary" @click="addClick">添加角色</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      style="width: 99%"
      size="mini"
    >
      <el-table-column label="编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.loginId }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="电话" width="180">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="
              BASE_URL_AdminImg +
              (scope.row.photo ? scope.row.photo : 'admin_default.jpg')
            "
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          {{ scope.row.role.roleName }}
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
      :title="isAdd ? '添加角色' : '修改角色'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="drawerClose"
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
          <el-form-item label="头像" prop="phone">
            <el-upload
              class="avatar-uploader"
              :action="Upload_AdminImg_URL"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ruleForm.photo"
                :src="BASE_URL_AdminImg + ruleForm.photo"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" prop="loginId">
            <el-input v-model="ruleForm.loginId" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 不需要修改密码 -->
          <el-form-item v-if="isAdd" label="密码" prop="loginPwd">
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="isAdd" label="确认密码" prop="loginPwd2">
            <el-input
              type="password"
              v-model="ruleForm.loginPwd2"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="ruleForm.roleId"
              placeholder="请选择角色"
              clearable
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
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
    //验证角色名称
    var validateLoginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    //验证密码
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
      } else if (value !== this.ruleForm.loginPwd) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    //验证姓名
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    //验证电话
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话号码"));
      } else {
        callback();
      }
    };
    //验证角色
    var validateRoleId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };

    return {
      count: 0,
      currentPage: 1,
      //初始每页数据数pagesize和数据data
      pageSize: 5,
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
        //账号
        loginId: "",
        //密码
        loginPwd: "",
        //确认密码
        loginPwd2: "",
        //姓名
        name: "",
        //电话号码
        phone: "",
        //角色名称
        roleId: "",
        //头像
        photo: "",
      },
      //表单的验证数据
      rules: {
        //验证角色名
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        roleId: [{ validator: validateRoleId, trigger: "change" }],
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

    handleTagSearch() {
      //重新调用表格数据的方法
      let res = this.$refs.select.value;
      this.currentPage = 1;
      this.getTableData(res);
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      let { success, filename } = res;
      //表示头像上传成功
      if (success) {
        this.ruleForm.photo = filename;
      }
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
    async getTableData(res) {
      const { data } = await this.$get("/Admin/List", { roleId: res || 0 });

      this.tableData = data;
      console.log(res);
    },
    //获取角色列表的方法
    async getRoleList() {
      const res = await this.$get("/Role/List");
      this.roleListToSearch = res;
      this.roleList = res;
    },
    async handleEdit(index, row) {
      //获取登录名
      let loginId = row.loginId;
      //根据角色编号，获取角色对象
      let res = await this.$get("/Admin/GetOne", { loginId });
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
          let id = row.id;
          //获取头像照片名称
          let photo = row.photo;
          //删除角色编号
          let { success, message } = await this.$post("/Admin/Delete", {
            id,
            photo,
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
      if (this.ruleForm.loginId) {
        this.resetForm("ruleForm");
      }

      this.drawer = true;
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
              "/Admin/Update",
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
            //对密码进行加密
            this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
            this.ruleForm.loginPwd2 = strToMd5(this.ruleForm.loginPwd2);
            //执行添加功能
            let { success, message } = await this.$post(
              "/Admin/Add",
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
      this.ruleForm.loginId = "";
      this.ruleForm.loginPwd = "";
      this.ruleForm.loginPwd2 = "";
      this.ruleForm.name = "";
      this.ruleForm.phone = "";
      this.ruleForm.roleId = "";
      this.ruleForm.photo = "";
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