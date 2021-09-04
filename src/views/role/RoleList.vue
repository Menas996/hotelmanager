<template>
  <div>
    <div class="search">
      <el-button type="primary" @click="addClick">添加角色</el-button>
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
          <span style="margin-left: 10px">{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
      <div style="padding: 0 10px">
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" autocomplete="off"></el-input>
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
//导入角色api层
// import * as role_api from "./../api/role_api.js";

export default {
  data() {
    var validateRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    return {
      //初始页
      currentPage: 1,
      //初始每页数据数pagesize和数据data
      pageSize: 5,
      tableData: [],
      //是否打开抽屉
      drawer: false,
      //方向
      direction: "rtl",
      //抽屉是否做添加
      isAdd: true,
      roleId: "",
      ruleForm: {
        roleName: "",
      },
      //表单的验证数据
      rules: {
        //验证角色名
        roleName: [{ validator: validateRoleName, trigger: "blur" }],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
  },
  //方法
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1; //每页下拉显示数据
      this.getTableData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTableData(); //点击第几页
    },
    async getTableData() {
      const res = await this.$get("/Role/List");
      this.tableData = res;
    },
    async handleEdit(index, row) {
      //获取角色编号
      let roleId = row.roleId;
      //根据角色编号，获取角色对象
      let res = await this.$get("/Role/GetOne", { roleId });
      this.ruleForm = res;
      //表示修改
      this.drawer = true;
      //
      this.isAdd = false;
    },
    //删除表格数据
    async handleDelete(index, row) {
      //获取角色编号
      let roleId = row.roleId;
      console.log(row);
      //删除角色编号
      let { success, message } = await this.$post("/Role/Delete", { roleId });
      if (success) {
        this.$msg_s(message);
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
    //关闭抽屉的方法
    addClick() {
      this.isAdd = true;
      this.ruleForm.roleName = "";
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
              "/Role/Update",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              this.getTableData();
            } else {
              this.$msg_e(message);
            }
          } else {
            //执行添加功能
            let { success, message } = await this.$post(
              "/Role/Add",
              this.ruleForm
            );
            //判断是否表单数据是否验证成功
            if (success) {
              this.$msg_s(message);
              //获取最新的信息
              this.getTableData();
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
      this.ruleForm = {
        rolename: "",
      };
    },
  },
};
</script>

<style scoped lang="less">
.search {
  margin: 10px;
}
</style>