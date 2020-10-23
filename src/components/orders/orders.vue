<template>
  <div>
         <h1>订单列表</h1>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="ordersList.query" clearable @clear="ordersFn">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4"></el-col>
        </el-row>
    </el-card>
    <!-- 表格 -->

    <el-table :data="orders" border style="width: 100%">
        <el-table-column label="#">
            <el-table-column type="index"></el-table-column>
        </el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
            <el-button type="warning" size="mini" v-if="scope.row.pay_status==0">未付款</el-button>
            <el-button type="success" size="mini" v-else>已付款</el-button>
            </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" @click="editFn(scope.row.order_id)">修改</el-button>
            <el-button type="warning" icon="el-icon-delete" disabled>删除</el-button>
            </template>
        </el-table-column>
       
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 15, 20, 27]"
      :page-size="ordersList.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

export default {
data(){
    return{
        ordersList:{
            query:"",
            pagenum:"1",
            pagesize:"10",
            user_id:"",
            pay_status:"",
            is_send:"",
            order_fapiao_title:"",
            order_fapiao_company:"",
            order_fapiao_content:"",
            consignee_addr:""
        },
        orders:[],
        total:0,

      
       

    }
},
    created(){
        this.ordersFn()
    },
  methods:{
     async ordersFn(){
        const {data:res}=await this.$http.get("orders/",{params:this.ordersList})
        console.log(res);
        if(res.meta.status!==200){
            return this.$message.error("获取订单数据失败")
        }
        console.log(res)
        this.$message.success("获取订单数据成功")
        this.orders=res.data.goods
        this.total=res.data.total
      },
       handleSizeChange(val){
           this.ordersList.pagesize = val
           this.ordersFn()
        },
        handleCurrentChange(val){
            this.ordersList.pagenum = val
            this.ordersFn()
        },
        // 搜索
        search(){
            this.ordersFn()
        },
      
    }
}
</script>



<style lang="less" scoped>


</style>