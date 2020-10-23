<template>
    <div>
        <h1>角色列表</h1>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

     <el-card>
      
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          
            <el-col :span="8">
                <el-input placeholder="请输入内容" clearable>
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addVisibles =true">添加用户</el-button>
            </el-col>
            
        </el-row>
        
    </el-card>
     <el-table :data="rolesList" border style="width: 100%">
       <el-table-column type="expand" >
         <template slot-scope="scope">
         <el-col v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['mcenter','bdboottom',i1==0?'bdtop':'']">
            <el-col :span="5">
              <el-tag type="success" closable @close="Fnclose(scope.row,item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
             <el-row v-for="item2 in item1.children" :key="item2.id">
               <el-col :span="6">
                 <el-tag type="warning" closable @close="Fnclose(scope.row,item2.id)">{{item2.authName}}</el-tag><i class="el-icon-caret-right" :class="['mcenter']"></i>
               </el-col>
               <el-col :span="13">
                 <el-tag v-for="item3 in item2.children" :key="item3.id" type="danger" closable @close="Fnclose(scope.row,item3.id)">{{item3.authName}}</el-tag>
               </el-col>
             </el-row>
            </el-col>
         </el-col>
         </template>
       </el-table-column>
         <el-table-column type="index"></el-table-column>
         <el-table-column label="角色名称" prop="roleName"></el-table-column>
         <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
         <el-table-column label="操作" width="300" >
             <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>

            <el-tooltip  content="分配角色" placement="top" >
                <el-button type="info" icon="el-icon-share" @click="dofenpei(scope.row,scope.row.id)"></el-button>
            </el-tooltip>
            </template>
         </el-table-column>

     </el-table>
     <!-- //添加 角色弹框 -->
     <el-dialog
        title="添加角色"
        :visible.sync="addVisibles"
        width="30%"
        :before-close="handleClose
        ">

        <span></span>
        <el-form label-width="80px" :model="addrolesList" :rules="rules" ref="ruleForm">
              <el-form-item label="角色名称" prop="roleName">
                 <el-input v-model="addrolesList.roleName"></el-input>
              </el-form-item>
               <el-form-item label="角色描述" prop="roleDesc">
                 <el-input v-model="addrolesList.roleDesc"></el-input>
              </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisibles = false">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </span>
      </el-dialog>
     <!-- //分配权限弹框 -->
     <el-dialog
        title="分配角色"
        :visible.sync="rolesVisibles"
        width="50%"
        @close="getClear"
        >

       <el-tree :data="datafp"
       ref="editdong"
       :default-checked-keys="idArr"
        :props="defaultProps" @node-click="handleNodeClick"
         node-key="id" show-checkbox default-expand-all></el-tree>
        

        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesVisibles = false">取消</el-button>
          <el-button type="primary" @click="doedit">确定</el-button>
        </span>
      </el-dialog>

      <!-- //修改 弹框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editVisibles"
        width="30%"
        :before-close="handleClose
        ">

        <span></span>
        <el-form label-width="80px" :model="editfrom" :rules="rules" ref="ruleForm">
              <el-form-item label="角色名称" prop="roleName">
                 <el-input v-model="editfrom.roleName"></el-input>
              </el-form-item>
               <el-form-item label="角色描述" prop="roleDesc">
                 <el-input v-model="editfrom.roleDesc"></el-input>
              </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisibles = false">取消</el-button>
          <el-button type="primary" @click="editSure">确定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 分配角色弹框
      rolesVisibles:false,
      //添加角色弹框
      addVisibles:false,
      //分配角色的数据
      grtId:"",
      idArr:[],
      datafp:"",
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
      //添加角色的数据
      addrolesList:{
        roleName:"",
        roleDesc:""
      },
      //修改弹框
      editVisibles:false,
      //修改获取数据
      editfrom:[],
      //添加规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max:10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: 'blur' }
        ],
    }
    }
  },
  created() {
    this.rolesListfn()
  },
  methods: {
    async rolesListfn() {
      const { data: res } = await this.$http.get('roles')
      
      console.log(res)
      this.rolesList = res.data
    },
    //增加角色
   async add(){
     const {data:res}=await this.$http.post("roles",this.addrolesList)
     console.log(res.meta.status);
     if(res.meta.status!==201){
       return this.$message.error("添加用户失败")
     }
     this.$message.success("添加用户成功")
      this.addVisibles=false
      this.$refs.ruleForm.resetFields()
      this.rolesListfn()

    },
    //删除
    async del(id) {
      this.$confirm('此操作将永久删除该用户数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.rolesListfn()
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //删除数据分类
    Fnclose(row,id) {
     this.$confirm('此操作将永久删除此权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${row.id}/rights/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.rolesListfn()
        role.children=res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    
    //修改
    async edit(id){
      console.log(id);
     const {data:res}=await this.$http.get(`roles/${id}`)
     if(res.meta.status!==200){
       return this.$message.error("获取数据失败")
     }
     this.$message.success("成功获取数据")
     this.editfrom=res.data
      this.editVisibles=true
    },
   async editSure(){
     const {data:res}=await this.$http.put(`roles/${this.editfrom.roleId}`,{roleName:this.editfrom.roleName,roleDesc:this.editfrom.roleDesc})
      if(res.meta.status!==200){
        return this.$message.error("修改失败")
      }
      this.$message.success("修改成功")
      this.editVisibles=false
      this.rolesListfn()
    },
    //分配权限 增加
   async dofenpei(row){
      this.getId=row.id
     const {data:res}=await this.$http.get("rights/tree")
     if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.datafp=res.data
        this.getkey(row,this.idArr)
      this.rolesVisibles=true
    },
    getkey(row,arr){
      if(!row.children){
        return arr.push(row.id);
      }
      row.children.forEach(item=>this.getkey(item,arr));
    },
   async doedit(){
    const keys=[...this.$refs.editdong.getCheckedKeys(),...this.$refs.editdong.getHalfCheckedKeys()]
      const ids=keys.join(",")
      const rowId=this.getId
    const {data:res}=await this.$http.post(`roles/${rowId}/rights`,{rids:ids})
      this.rolesVisibles=false
      this.rolesListfn()
      this.$message.success("修改或添加权限成功")
    },
    getClear(){
      this.idArr=[]
    }
  }
}
</script>

<style>
  .el-row{
    margin: 7px;
  }
  .bdboottom{
    border-bottom:1px solid #eee;
  }
  .bdtop{
    border-top:1px solid #eee;
  }
  .mcenter{
    display: flex;
    align-items: center;
  }
  .el-breadcrumb{
    margin-bottom: 30px;
  }
</style>
