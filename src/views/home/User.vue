<template>
  <div style="width: 100%; height: 100%">
    <el-row style="height: 100%">
      <el-col :span="4" :style="'height: ' + windowHeight">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#1F2D3D"
          text-color="#ffffff"
          router
          style="height: 100%"
        >
          <el-menu-item
            index="/home/user/info"
            class="homePage"
            style="margin: 0 0 30px 0"
          >
            <i class="iconfont" style="margin: 0 8px 0 0">&#xe653;</i>
            <span>个人中心</span>
          </el-menu-item>
          <el-menu-item
            index="/home/user/wallet"
            class="homePage"
            style="margin: 0 0 30px 0"
          >
            <i class="iconfont" style="margin: 0 8px 0 0">&#xe653;</i>
            <span>我的钱包</span>
          </el-menu-item>
          <el-menu-item
            index="/home/user/order"
            class="homePage"
            style="margin: 0 0 30px 0"
          >
            <i class="iconfont" style="margin: 0 8px 0 0">&#xe653;</i>
            <span>我的订单</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" :style="'height: ' + windowHeight">
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<script scoped>
export default {
  name: 'User',
  data() {
    return {
    }
  },
  computed: {
    windowHeight() {
      return this.$store.state.height + 'px';
    }
  }
}
</script>

<style>
.container {
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
  height: 100%;
}

.head {
  font-size: 40px;
  font-weight: bold;
  padding: 50px 0 0 100px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

</style>