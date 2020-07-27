<template>
  <div>
    <header>
      <el-menu
        :default-active="activeIndex2"
        class="menu"
        mode="horizontal"
        @select="handleSelect"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
      >
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-menu-item index="3">消息中心</el-menu-item>
      </el-menu>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: center;
  background: #001529;
}
.menu {
  display: flex;
  width: 100vw;
  max-width: 1200px;
}
</style>
