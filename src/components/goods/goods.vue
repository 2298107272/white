<template>
  <div>  
       <h1>商品列表</h1>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="goodslist.query" clearable @clear="goodsfn">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="add">添加商品</el-button>
            </el-col>
        </el-row>
        
    </el-card>

     <el-table :data="goodsgetlist" style="width: 100%">
      <el-table-column label="#" type="index" width="50"></el-table-column>
      <el-table-column label="家电" prop="goods_name" width="950"> </el-table-column>
      <el-table-column label="商品价格（元）" prop="goods_price" width="150"> </el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="150"> </el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="200" > {{time | moment}}</el-table-column>
      <el-table-column label="操作" width="150"> 
          <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="editGoods(scope.row.goods_id)"></el-button>
            </template>
      </el-table-column>
     </el-table>
<!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodslist.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加商品 -->
    <el-dialog
  title="添加商品"
  :visible.sync="goodsAddVisible"
  width="80%"
  :before-close="handleClose">

  <el-form label-width="80px" :model="goods" >
              <el-form-item label="商品名称" prop="goods_name">
                 <el-input v-model="goods.goods_name"></el-input>
              </el-form-item>
               <el-form-item label="cat" prop="goods_cat">
                 <el-input v-model="goods.goods_cat"></el-input>
              </el-form-item>
               <el-form-item label="商品价格" prop="goods_price">
                 <el-input v-model="goods.goods_price"></el-input>
              </el-form-item>
               <el-form-item label="number" prop="goods_number">
                 <el-input v-model="goods.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                 <el-input v-model="goods.goods_weight"></el-input>
              </el-form-item>
        </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="goodsAddVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureadd">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{ 
            time:'',
            goodslist:{
                query:"",
                pagenum:"1",
                pagesize:"10"
            },
            goodsgetlist:"",
            total:0,
            //添加对话框
            goodsAddVisible:false,
            goods:{
                goods_name:"",
                goods_cat:"",
                goods_price:"",
                goods_number:"",
                goods_weight:"",
            }
        }
    },
    created(){
        this.goodsfn()
    },
    methods:{
       async goodsfn(){
           const {data:res}=await this.$http.get("goods",{params:this.goodslist})
           console.log(res);
           if(res.meta.status!==200){
               return this.$message.error("获取用户列表数据失败")
           }
        //    this.$message.success("获取用户列表成功")
           this.total=res.data.total
           this.goodsgetlist=res.data.goods
        },
        //搜索
        search(){
            this.goodsfn()
        },
        //分页
        handleSizeChange(val){
             this.goodslist.pagesize = val
             this.goodsfn()
        },
        handleCurrentChange(val){
             this.goodslist.pagenum = val
             this.goodsfn()
        },
        //添加商品事件
       async sureadd(){
           const {data:res}=await this.$http.post("goods/",this.goods)
           console.log(res);
             this.goodsAddVisible=false
             this.goodsfn()
        },
        add(){
       
        this.$router.push('/Add')
        },
        //删除商品事件
       async editGoods(id){
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`goods/${id}`)
                if (res.meta.status !== 200) {
                return this.$message.error('删除失败')
                }
                this.$message.success('删除成功')
                this.goodsfn()
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                })
            })
           
        },
    
    }
}
</script>

<style>

</style>