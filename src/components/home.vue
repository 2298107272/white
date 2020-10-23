<template>
  <el-container>
  <el-header><input type="button" value="退出" @click="back"></el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px':'200px'">
      <div class="btn" @click="btnFn">|||</div>
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened=true
      :collapse="isCollapse"
      collapse-transition=false
      router
      >
      <el-submenu :index="item.id+''"  v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>

          <el-menu-item :index="'/'+subItem.path"
           v-for="subItem in item.children"
            :key="subItem.id"
            >
          <template slot="title" >
                  <i class="el-icon-location"></i>
                  <span>{{subItem.authName}}</span>
          </template>
          </el-menu-item>

      </el-submenu>

    </el-menu>
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  created() {
    this.menuListFn()
  },
  data() {
    return {
      menuList: '',
      iconsObj: {
        125: 'iconfont el-icon-user',
        103: 'iconfont el-icon-info',
        101: 'iconfont el-icon-goods',
        102: 'iconfont el-icon-s-goods',
        145: 'iconfont el-icon-star-on'
      },
      isCollapse: false

    }
  },
  methods: {
    back() {
       this.$confirm('此操作将退出快吧后台, 确定退出吗?', '提示', {
        confirmButtonText: '残忍离开',
        cancelButtonText: '再看看',
        roundButton:true,
        type: 'warning',
        showClose:false,
       
      }).then(async () => {
       window.sessionStorage.clear()
      this.$router.push('/login')
      }).catch(() => {
        // this.$message({ 
        // })
      })
      
    },
    async menuListFn() {
      const { data: res } = await this.$http.get('menus')
      this.menuList = res.data
    },
    btnFn() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
  .el-container{
    height: 100%;
  }
  .el-header{
    background-color:#373D41;
  }
  .el-aside{
    background-color:#333744;
  }
  .el-main{
    background-color:#eaedf1;
  }
  .iconfont {
  margin-right: 10px;
}
.btn {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-header>input{
  width: 100px;
  height: 40px;
  margin-top: 12px;
  border-radius: 12px;
  font-size: 18px;
  background-color: #333744;
}
.el-header>input:hover{
  color: red;
  background-color:#4a4f5f ;
}
</style>
