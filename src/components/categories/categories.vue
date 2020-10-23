<template>
  <div>
        <h1>商品分类</h1>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
      <el-card>
      
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button type="primary" @click="addfl">添加商品</el-button>
            </el-col>
        </el-row>
    </el-card>

<!-- 表格区域 -->
    <tree-table
       :data="categoiesList"
       :columns="columns"
       show-index index-text="#"
       :selection-type='false'
       border
        :show-row-hover='false'> 

        <template slot="ok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:green"></i>
             <i class="el-icon-success" v-else style="color:red"></i>
        </template>
        
        <template slot="order" slot-scope="scope">
            <el-tag  v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="danger" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>

         <template slot="caozuo"  slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row.cat_id)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="del(scope.row.cat_id)"></el-button>
        </template>

    </tree-table>
      
    
     <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="categoieslist.pagenum"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="categoieslist.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加商品  弹框 -->
        <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="%"
                    :before-close="handleClose"
                    @close="clearable">

            <el-form label-width="70px" :model="categoiesAdd" :rules="rules" ref="from">
                <el-form-item label="分类名称:" prop="cat_name" label-width="120px">
                    <el-input v-model="categoiesAdd.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:" label-width="150px">
                    <el-cascader
                        v-model="cascaderkey"
                        :options="addlist"
                        :props="cascader"
                        change-on-select
                        clearable
                        
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
            </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary"  @click="Addsure">确 定</el-button>
                </span>
        </el-dialog>
            <!-- 修改分类  弹框 -->
     <el-dialog
        title="修改分类"
        :visible.sync="edittk"
        width="50%"
        :before-close="handleClose
        
        ">

        <span></span>
        <el-form label-width="80px" :model="editlist" :rules="rules" ref="editlist">
             <el-form-item label="分类名称:" prop="cat_name" label-width="120px">
                    <el-input v-model="editlist.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:" label-width="150px">
                    <el-cascader ></el-cascader>
                </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="edittk = false">取消</el-button>
          <el-button type="primary" @click="edittksure">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
   data(){
       return{
        categoieslist:{
            type:"3",
            pagenum:"1",
            pagesize:"10"
        },
        categoiesList:[],
        total:0,
        columns:[
            {label:"分类名称",prop:"cat_name"},
            {label:"是否有效",prop:"", type:"template",template:"ok"},
            {label:"是否有效",prop:"", type:"template",template:"order"},
            {label:"操作",prop:"", type:"template",template:"caozuo"},
        ],
        //添加商品数据
        dialogVisible:false,
        categoiesAdd:{
            cat_name:"",
            cat_pid:"",
            cat_level:"",
        },
        //规则
        rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
        },
        addlist:[],
        cascader:{
            value:"cat_id",
            label:"cat_name",
            children:"children",
            expandTrigger:"hover"
          
        },
        cascaderkey:[],


        //修改数据
        edittk:false,
        editlist:{}
       }
   },
   created(){
       this.categoiesFn()
   },
   methods:{
       //请求数据
      async categoiesFn(){
          const {data:res}=await this.$http.get("categories/",{params:this.categoieslist})
       
           if(res.meta.status!==200){
               return this.$message.error("获取用户列表数据失败")
           }
           this.total=res.data.total
           this.categoiesList=res.data.result
       },
       //分页
        handleSizeChange(val){
             this.categoieslist.pagesize = val
            this.categoiesFn()
        },
        handleCurrentChange(val){
             this.categoieslist.pagenum = val
            this.categoiesFn()
        },
        //添加事件
        addfl(){
            this.dialogVisible=true
            this.getlist()
        },
       async Addsure(){
          const {data:res}=await this.$http.post('categories/',this.categoiesAdd)
            // console.log(res);
               if(res.meta.status!==201){
               return this.$message.error("创建失败")
           }
            this.$message.success('创建成功')
            this.categoiesFn()
            this.dialogVisible=false
        },
        //点击添加  后获取数据
       async getlist(){
           const {data:res}=await this.$http.get("categories/",{params:{type:2}})
        
           this.addlist=res.data
        },
        //添加的层级改变
        handleChange(){
           if(this.cascaderkey.length>0){
               this.categoiesAdd.cat_pid=this.cascaderkey[this.cascaderkey.length-1]
               this.categoiesAdd.cat_level=this.cascaderkey.length
           }else{
               this.categoiesAdd.cat_pid=0
               this.categoiesAdd.cat_level=0
           }
        },
        //添加后的清楚
        clearable(){
        this.$refs.from.resetFields()
        this.categoiesAdd.cat_pid=""
        this.categoiesAdd.cat_level=""
        this.cascaderkey=""
        },
        //删除事件
       async del(id){
          
          this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(async () => {
              const {data:res}=await this.$http.delete(`categories/${id}`)
              if(res.meta.status!==200){
                  return this.$message.error('删除失败')
              }
              this.$message.success('已删除')
               this.categoiesFn()
          }).catch(() => {
              this.$message({
              type: 'info',
              message: '已取消删除'
              })
            })
        },
    //修改事件
       async edit(id){
           const {data:res}=await this.$http.get(`categories/${id}`)
           console.log(res);
           this.editlist=res.data
            this.edittk=true
        },
       async edittksure(){
            const {data:res}=await this.$http.put(`categories/${this.editlist.cat_id}`,{cat_name:this.editlist.cat_name})
            if(res.meta.status!==200){
                return this.$message.error("更该分类信息失败")
            }
            this.$message.success('更改分类信息成功')
            this.categoiesFn()
            
             this.edittk=false
        }
   }
}
</script>

<style>

</style>