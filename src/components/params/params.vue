<template>
  <div>
        <h1>分类参数</h1>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 警告部分 -->
  <el-alert
    title="注意：只允许为第三级分类设置相关参数！"
    type="warning"
    :closable="false"
    show-icon>
  </el-alert>
  <!-- 选择商品分类部分 -->
  <div class="block">
  <span class="demonstration">选择商品分类</span>
  <el-cascader
    v-model="selectId"
    :options="categoieslist"
    :props="paramsprops"
    @change="handleChange">
    </el-cascader>
    <!-- expandTrigger: 'hover' -->
</div>
 <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" :disabled="okk" @click="add">添加动态参数</el-button>

        <el-table :data="manydata" border >
          
          <el-table-column type="expand">
                 <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
          </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row.attr_id)" >修改</el-button>
                    <el-button type="warning" size="mini" icon="el-icon-delete" @click="del(scope.row.attr_id)">删除</el-button>
                  </template>
              </el-table-column>
          
        </el-table>

    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" :disabled="okk" @click="add">添加静态属性</el-button>

         <el-table :data="onlydata" border >
            <el-table-column type="expand">
               <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row.attr_id)">修改</el-button>
                  <el-button type="warning" size="mini" icon="el-icon-delete" @click="del(scope.row.attr_id)">删除</el-button>
                </template>
        </el-table-column>
        </el-table>
    </el-tab-pane>
  </el-tabs>

  <!-- 增加  弹框-->
     <el-dialog
            :title="text"
            :visible.sync="addVisible"
            width="30%"
            @close="clear">
            <span></span>
                  <el-form ref="addfrom" :model="addfrom" label-width="80px" :rules="addruless"  >
                      <el-form-item label="活动名称" prop="attr_name">
                        <el-input v-model="addfrom.attr_name"></el-input>
                      </el-form-item>
                  </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="addVisible = false">取 消</el-button>
              <el-button type="primary" @click="doadd">确 定</el-button>
            </span>
     </el-dialog>
          <!-- 修改 弹框 -->
           <el-dialog
            :title="textedit"
            :visible.sync="editVisible"
            width="30%"
            @close="clear">
            <span></span>
                  <el-form ref="addfrom" :model="editList" label-width="80px" :rules="addruless"  >
                      <el-form-item label="活动名称" prop="attr_name">
                        <el-input v-model="editList.attr_name"></el-input>
                      </el-form-item>
                  </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="editVisible = false">取 消</el-button>
              <el-button type="primary" @click="doedit">确 定</el-button>
            </span>
          </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      categoieslist:[],
      selectId:[],
      paramsprops:{
        value:"cat_id",
        label:"cat_name",
        children:"children",
        expandTrigger: 'hover',
      },
      //expand下面的数据
      
      //默认界面
      activeName:"many",
      ok:true,
      //存放 动态数据与静态数据的值
      onlydata:[],
      manydata:[],
      //增加
      addVisible:false,
      addfrom:{
        attr_name:""
      },
      //规则
      addruless:{
        attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' }
          ],
      },
      //修改
      editVisible:false,
      editList:"",
      editId:""
    }
  },
   created(){
       this.categoiesFn()
   },
   methods:{
     //获取数据
      async categoiesFn(){
          const {data:res}=await this.$http.get("categories/")
          console.log(res);
          if(res.meta.status!==200){
            return this.$message.error('获取数据失败')
          }
          this.categoieslist=res.data
       },
       //input中的数值改变引起的事件
      async handleChange(){
       
        let sel=this.activeName
        const {data:res}=await this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:sel}})
          
          if(res.meta.status!==200){
            return this.$message.error("获取数据失败")
          }
          this.$message.success("获取数据成功")

          if(this.activeName==="many"){
            this.manydata=res.data
          }else{
             this.onlydata=res.data
          }
          console.log(res.data);
        res.data.forEach(item => { item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [] 
          //添加一个bool值控制文本框的显示或者隐藏 
          item.inputVisible = false 
          //添加一个inputValue保存文本框值 
        item.inputVisible = false
          item.inputValue = '' })
        
          
         
       },
       //动态参数 动态属性
       handleClick(){
         this.handleChange()
         console.log(777);
       },
       //增加
       add(){
         this.addVisible=true
       },
       //提交添加与表单验证
       doadd(){
        this.$refs.addfrom.validate(async valid => {
          if (valid) {
            const {data:res}=await this.$http.post(`categories/${this.catId}/attributes`,{attr_name:this.addfrom.attr_name,attr_sel:this.activeName})
            if(res.meta.status!==201){
                return this.$message.error("添加失败")
              }
              this.$message.success("添加成功")
              this.handleChange()
              this.addVisible=false
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
      },
      //清楚添加后的残留数据
      clear(){
        
        this.$refs.addfrom.resetFields()
      },
      //删除
        async del(aa){
            
              this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                const {data:res}=await this.$http.delete(`categories/${this.catId}/attributes/${aa}`)
                      
                if (res.meta.status !== 200) {
                  return this.$message.error('删除失败')
                }
                this.$message.success('删除成功')
                  this.handleChange() 
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          },
       //修改
     async edit(bb){
          this.editId=bb
          this.editVisible=true
          const {data:res}=await this.$http.get(`categories/${this.catId}/attributes/${bb}`)
          console.log(res);
          this.editList=res.data
      },
     async doedit(){
        const {data:res}=await this.$http.put(`categories/${this.catId}/attributes/${this.editId}`,{attr_name:this.editList.attr_name,attr_sel:this.activeName})
        if(res.meta.status!==200){
          return this.$message.error("修改失败")
        }
        this.$message.success("更新成功")
        this.editVisible=false
        this.handleChange()
      },
  //expand 的事件
    // 文本框失去焦点，或摁下了 Enter 都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      // this.$nextTick((_) => {
      //   this.$refs.saveTagInput.$refs.input.focus()
      // })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
    },
  computed:{
    okk(){
      if(this.selectId.length===3){
           return false
         }
          return true
    },
    catId(){
       if(this.selectId.length===3){
          return this.selectId[2]
         }else{
          return null
         }
    },
    text(){
      if(this.activeName==="many"){
        return '添加动态参数'
      }
      return '添加静态属性'
    },
    textedit(){
      if(this.activeName==="many"){
        return '修改动态参数'
      }
      return '修改静态属性'
    }
  }

}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 300px;
}
.block{
  margin: 30px 0;
}
//expand 的css
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>