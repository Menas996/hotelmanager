<template>
  <div>
    <div class="search">
      <el-form>
        <el-form-item prop="roomTypeId">
          <el-select
            v-model="ruleForm.roomTypeId"
            placeholder="请选择客房类型"
            ref="select1"
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
          <el-select
            v-model="ruleForm.roomStateId"
            placeholder="请选择客房状态"
            ref="select2"
            style="margin: 0 10px"
            clearable
          >
            <el-option
              v-for="item in roomStateList"
              :key="item.roomStateId"
              :label="item.roomStateName"
              :value="item.roomStateId"
            >
            </el-option>
          </el-select>
          <el-button class="searchToTag" type="success" @click="handleTagSearch"
            >查询</el-button
          >
          <el-button type="warning" @click="exportClick">导出Excel</el-button>
          <el-button type="primary" @click="addClick">添加</el-button>
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
      <el-table-column label="房间编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomId }}
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomType.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomType.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomType.roomTypePrice }}
        </template>
      </el-table-column>
      <el-table-column label="房间状态" width="180">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.roomStateId === 1
                ? 'success'
                : scope.row.roomStateId === 2
                ? 'danger'
                : 'warning'
            "
            disable-transitions
            >{{ scope.row.roomState.roomStateName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleShowImg(scope.$index, scope.row)"
            >图片</el-button
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
          <el-form-item label="房间号" prop="roomId">
            <el-input v-model="ruleForm.roomId" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 不需要修改密码 -->
          <el-form-item label="房间类型" prop="roomTypeId">
            <el-select
              v-model="ruleForm.roomTypeId"
              placeholder="请选择客房类型"
              ref="select1"
              clearable
            >
              <el-option
                v-for="item in roomTypeList2"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间状态" prop="roomStateId">
            <el-select
              v-model="ruleForm.roomStateId"
              placeholder="请选择客房状态"
              ref="select2"
              clearable
            >
              <el-option
                v-for="item in roomStateList2"
                :key="item.roomStateId"
                :label="item.roomStateName"
                :value="item.roomStateId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <quill-editor
              v-model="ruleForm.description"
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
    <!-- 图片弹出层 -->
    <el-dialog
      title="房间图片展示"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-upload
        :action="Upload_RoomImg_URL"
        list-type="picture-card"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- 弹出层：用于显示大图 -->
      <el-dialog :visible.sync="dialogVisible2" append-to-body>
        <img width="100%" :src="dialogImageUrl" />
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import xlsx from "../../utils/xlsx.js";
//导入房间图片根路径， 和 房间图片上传路径
import { Upload_RoomImg_URL, BASE_URL_RoomImg } from "../../config";
export default {
  data() {
    //验证姓名
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房编号"));
      } else {
        callback();
      }
    };
    //验证角色
    var validateRoomStateId = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error("请选择客房状态"));
      } else {
        callback();
      }
    };
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择客房类型"));
      } else {
        callback();
      }
    };

    return {
      innerVisible: false,
      //房间图片上传路径
      Upload_RoomImg_URL,
      //房间图片路径
      BASE_URL_RoomImg,
      //是否显示弹出层
      dialogImageUrl: "",

      dialogVisible: false,
      //是否显示查看大图弹出层
      dialogVisible2: false,
      //定义房间图片对应的房间号
      roomId: "",
      //定义房间照片墙显示的照片数组
      fileList: [],

      currentPage: 1,
      //初始每页数据数pagesize和数据data
      pageSize: 5,

      count: "",

      tableData: [],
      //客房类型
      roomTypeId: "",
      //客房类型列表(用于查询)
      roomTypeList: [],
      //客房状态列表(用于查询)
      roomStateList: [],

      roomStateList2: [],
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
        //房间号
        roomId: "",
        //状态编号
        roomStateId: "",
        //类型编号
        roomTypeId: "",
        //房间描述
        description: "",
      },
      //表单的验证数据
      rules: {
        //验证角色名
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        //验证状态
        roomStateId: [{ validator: validateRoomStateId, trigger: "change" }],
        //验证类型价格
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "change" }],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
    //调用获取房间类型的方法
    this.getRoomTypeList();
    //获取状态
    this.getRoomStateList();
  },
  //方法
  methods: {
    //导出Excel的方法
    exportClick() {
      //组织导出的数据
      let json = this.tableData.map((r) => {
        return {
          roomId: r.roomId,
          roomType: r.roomType.roomTypeName,
          bedNum: r.roomType.bedNum,
          price: r.roomType.roomTypePrice,
          roomState: r.roomState.roomStateName,
        };
      });
      //组织表头对象
      let fields = {
        roomId: "客房编号",
        roomType: "客房类型",
        bedNum: "床位数",
        price: "价格",
        roomState: "客房状态",
      };
      //定义文件名称
      let filename = "客房信息表";
      //将指定的数据导出到一个excel文件中
      xlsx(json, fields, filename);
    },
    async handleAvatarSuccess(res) {
      //返回上传图片的状态和上传成功后图片的名称
      let { success, filename } = res;
      console.log(res);
      //表示头像上传成功
      if (success) {
        // console.log(filename);
        let res = await this.$post("/RoomImg/Add", {
          roomId: this.roomId,
          imgUrl: filename,
        });
        // if (res.success) {
        //   this.ShowImg();
        // }
      }
    },
    //上传之前的方法
    beforeAvatarUpload(file) {
      //定义可以上传的图片格式类型数组
      let img_type_list = ["image/jpeg", "image/png", "image/gif"];
      //通过数组中的eincludes()方法，判断是否包含
      const isJPG = img_type_list.includes(file.type);
      console.log(file.size / 1024 / 1024 / 10);
      const isLt5M = (file.size / 1024 / 1024) * 10 < 1;

      if (!isJPG) {
        this.$message.error("上传客房图片只能是 JPG PNG GIF格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传客房图片大小不能超过 1MB!");
      }
      return isJPG && isLt1M;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.fileList = [];
          done();
        })
        .catch((_) => {});
    },
    //删除照片墙里面的照片
    async handleRemove(file, fileList) {
      //获取图片id,和图片名称
      let { roomImgId, name } = file;
      console.log(file);
      //删除对应的图片信息
      let { success, message } = await this.$post("/RoomImg/Delete", {
        roomImgId,
        filename: name,
      });
      console.log(roomImgId);
      if (success) {
        this.$msg_s(message);
      } else {
        this.$msg_e(message);
      }
    },
    //预览照片墙上面的照片
    handlePictureCardPreview(file) {
      //设置显示大图的地址
      this.dialogImageUrl = file.url;
      //打开大图的对话框
      this.dialogVisible2 = true;
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
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
      this.roomTypeList2 = res;
    },
    //获取客房状态列表的方法
    async getRoomStateList() {
      let res = await this.$get("/RoomState/List");
      this.roomStateList = res;
      //获取房间状态(没有入住的状态)
      let res2 = await this.$get("/RoomState/ListToUpdate");
      this.roomStateList2 = res2;
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
      const { data } = await this.$get("/Room/List", {
        roomTypeId: res1 || 0,
        roomStateId: res2 || 0,
      });
      this.tableData = data;
    },
    async handleEdit(index, row) {
      //获取登录名
      let roomId = row.roomId;
      //根据角色编号，获取角色对象
      let res = await this.$get("/Room/GetOne", { roomId });
      //获取到的客房类型对象，重新赋值给
      this.ruleForm = res;
      //给表单对象，添加一个id,用于备份房间号
      this.ruleForm.id = res.roomId;
      //表示修改
      this.drawer = true;
      //
      this.isAdd = false;
    },
    async handleShowImg(index, row) {
      //显示客房图片列表的对话框
      this.dialogVisible = true;
      //获取客房编号
      this.roomId = row.roomId;
      //显示图片列表
      this.ShowImg();
    },
    async ShowImg() {
      //根据客房编号，查询所有的客房图片
      let res = await this.$get("/RoomImg/List", { roomId: this.roomId });
      console.log(res);
      //设置房间照片墙上，显示的照片列表
      this.fileList = res.map((r) => {
        return {
          roomImgId: r.roomImgId,
          name: r.imgUrl,
          url: this.BASE_URL_RoomImg + r.imgUrl,
        };
      });
    },
    //删除表格数据
    async handleDelete(index, row) {
      //获取角色编号
      await this.$confirm("是否确认删除？")
        .then(async () => {
          //获取编号
          let roomId = row.roomId;
          //删除角色编号
          let { success, message } = await this.$post("/Room/Delete", {
            roomId,
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
      if (this.ruleForm.id) {
        this.resetForm("ruleForm");
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
              "/Room/Update",
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
              "/Room/Add",
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
      this.ruleForm.roomTypeId = "";
      this.ruleForm.roomStateId = "";
      this.ruleForm.roomId = "";
      this.ruleForm.description = "";
    },
  },
};
</script>

<style lang="less">
.search {
  margin: 10px;
}
</style>