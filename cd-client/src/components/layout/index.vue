<template>
  <a-layout class="container">
    <a-layout-header>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">首页</a-menu-item>
        <a-menu-item key="2">设置</a-menu-item>
        <a-menu-item key="3">关于</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb class="breadcrumb">
        <!-- <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>-->
      </a-breadcrumb>
      <div class="content">
        <router-view></router-view>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">Android CD</a-layout-footer>
  </a-layout>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  .breadcrumb {
    margin: 10px 0;
    height: 21px;
  }
  .content {
    height: calc(100vh - 69px - 21px - 64px - 20px);
    min-height: calc(100vh - 69px - 21px - 64px - 20px);
    background: #ffffff;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
