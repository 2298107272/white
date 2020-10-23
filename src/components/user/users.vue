<template>
<div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="usersFn">
                    <el-button slot="append" icon="el-icon-search" @click="search" ></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
            </el-col>
        </el-row>
    </el-card>

    <!--  -->

    <el-table :data="userslist">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="状态">
        <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
        </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>

            <el-tooltip  content="分配" placement="top" >
                <el-button type="info" icon="el-icon-share" @click="fptk(scope.row)"></el-button>
            </el-tooltip>
            </template>

        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[4, 2, 3, 6]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      >
    </el-pagination>
    <!-- 添加新用户 -->
          <el-dialog
        title="添加新用户"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose
        ">

        <span></span>
        <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item label="用户名" prop="username">
                 <el-input v-model="ruleForm.username"></el-input>
              </el-form-item>
               <el-form-item label="密码" prop="password">
                 <el-input v-model="ruleForm.password"></el-input>
              </el-form-item>
               <el-form-item label="邮箱" prop="email">
                 <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
               <el-form-item label="电话" prop="mobile">
                 <el-input v-model="ruleForm.mobile"></el-input>
              </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </span>
      </el-dialog>

        <!-- 修改用户的弹框 -->
       <el-dialog
        title="修改用户"
        :visible.sync="dialogVisibles"
        width="30%"
        :before-close="handleClose
        ">

        <span></span>
        <el-form label-width="80px" :model="editForm" :rules="rules" ref="ruleForm">
               <el-form-item label="邮箱" prop="email">
                 <el-input v-model="editForm.email"></el-input>
              </el-form-item>
               <el-form-item label="电话" prop="mobile">
                 <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibles = false">取消</el-button>
          <el-button type="primary" @click="editSure">确定</el-button>
        </span>
      </el-dialog>


      <!-- 分配角色弹框 -->
       <el-dialog
        title="分配角色"
        :visible.sync="fpVisibles"
        width="50%"
        >

        <p>当前的用户:{{usersfp.username}}</p>
        <p>当前的角色:{{usersfp.role_name}}</p>
        <p>分配新角色:
           <el-select v-model="roleId" placeholder="请选择">
              <el-option
                v-for="item in roleslisT"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
        </p>

        <span slot="footer" class="dialog-footer">
          <el-button @click="fpVisibles = false">取消</el-button>
          <el-button type="primary" @click="suerfp">确定</el-button>
        </span>
      </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      const aa = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (aa.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确邮箱格式'))
      }
    }
    const validatePasss = (rule, value, callback) => {
      const bb = /^1[3456789]\d{9}$/
      if (bb.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确手机号格式'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: '5'
      },
      //分配弹框
      fpVisibles:false,
      usersfp:"",
      //分配 角色列表数据
      roleslisT:[],
      roleId:"",

      userslist: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: [],
      dialogVisibles: false,
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: validatePass, trigger: 'blur' }
        ],
        mobile: [
          { validator: validatePasss, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.usersFn()
  },
  methods: {
    // 从接口获取用户所有数据
    async usersFn() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      this.total = res.data.total
      this.userslist = res.data.users
    },
    handleSizeChange(val) {
      console.log(val);
      this.queryInfo.pagesize = val
      this.usersFn()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.usersFn()
    },
    // 更改用户状态事件
    async userStateChanged(row) {
      // 发送请求进行状态修改
      const { data: res } = await this.$http.put(
    `users/${row.id}/state/${row.mg_state}`
      )
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('修改状态失败')
      }
      this.$message.success('更新状态成功')
    },
    search() {
      this.usersFn()
    },
    // 增加用户事件
    async add() {
      const { data: res } = await this.$http.post('users/', this.ruleForm)
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
      return this.usersFn()
    },
    // 删除用户事件
    del(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${id}`)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.usersFn()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改用户信息
    async edit(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询信息失败')
      }
      this.$message.success('查询信息成功')
      this.editForm = res.data
      console.log(this.editForm.id)
      this.dialogVisibles = true
    },
    async editSure() {
      const { data: res } = await this.$http.put(`users/${this.editForm.id}`, { email: this.editForm.email, mobile: this.editForm.mobile })
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户信息失败')
      }
      this.$message.success('修改用户信息成功')
      this.usersFn()
      this.dialogVisibles = false
    },
    //分配事件
    async fptk(row){
      const { data: res } = await this.$http.get("roles") 
      this.roleslisT=res.data
      console.log(row);
      console.log(9999);
       this.usersfp=row
      this.fpVisibles=true
    },
   async suerfp(){
      const id=this.usersfp.id
      const rid=this.roleId
      const {data:res}=await this.$http.put(`users/${id}/role`,{rid:rid})
      console.log(res);
      if(res.meta.status!==200){
        return this.$message.error("更新信息失败")
      }
      this.$message.success("更新信息成功")
      this.usersFn()
      this.fpVisibles=false
    }

  }
}
</script>

<style lang="less" scoped>
.text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
  .el-card{
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .15) !important;
  }
  .el-breadcrumb{
      margin-bottom: 20px;
  }

</style>
