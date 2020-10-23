<template>
<div>
  <h1>权限管理列表</h1>
  <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-table :data="rightList" border style="width: 100%">
         <el-table-column type="index"></el-table-column>
         <el-table-column label="权限名称" prop="authName"></el-table-column>
         <el-table-column label="路径" prop="path"></el-table-column>
         <el-table-column label="权限等级" width="300" >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level==='0'">一级权限</el-tag>
             <el-tag type="sinfo" v-if="scope.row.level==='1'">二级权限</el-tag>
              <el-tag type="warning" v-if="scope.row.level==='2'">三级权限</el-tag>
          </template>
         </el-table-column>

     </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: ''
    }
  },
  created() {
    this.rightFn()
  },
  methods: {
    async rightFn() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.$message.success('获取数据成功')
      console.log(res)
      this.rightList = res.data
    }
  }
}
</script>

<style>
.el-breadcrumb{
    margin-bottom: 30px;
  }
</style>
