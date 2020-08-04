<template>
  <div>
    <header>
      <el-menu
        default-active="/"
        :collapse="true"
        class="menu"
        mode="horizontal"
        @select="handleSelect"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
      >
        <div class="menu-left">
          <el-menu-item :index="menu.route" v-for="menu of menuLeft" :key="menu.route">{{menu.name}}</el-menu-item>
        </div>
        <!-- <div class="menu-right">
          <el-menu-item
            :index="menu.route"
            v-for="menu of menuRight"
            :key="menu.route"
          >{{menu.name}}</el-menu-item>
        </div> -->
      </el-menu>
    </header>
    <section class="content">
      <router-view></router-view>
    </section>
    <section class="footer">
      <div class="footer-a" @click="recordTo">陕ICP备18006529号-4</div>
      <div class="footer-text">copyright xnng</div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuLeft: [
        {
          route: '/',
          name: 'apkGo'
        }
        // {
        //   route: '/tools',
        //   name: '命令行工具'
        // },
        // {
        //   route: '/doc',
        //   name: '开放API'
        // }
      ]
      // menuRight: [
      //   {
      //     route: '/注销',
      //     name: '注销'
      //   },
      //   {
      //     route: '/github',
      //     name: 'GitHub'
      //   }
      // ]
    }
  },
  methods: {
    recordTo () {
      window.open('http://beian.miit.gov.cn/', '_blank')
    },
    handleSelect (route) {
      if (route === '/github') {
        window.open('https://github.com/xnng/acd', '_blank')
      } else {
        this.$router.push(route)
      }
    }
  }
}
</script>

<style lang="scss">
.el-menu::after,
.el-menu::before {
  content: none !important;
}
</style>
<style lang="scss" scoped>
$footer-height: 56px;
$header-height: 56px;
header {
  display: flex;
  justify-content: center;
  background: #001529;
}
.menu {
  display: flex;
  width: 1200px;
  max-width: 1200px;
  justify-content: space-between;
  &-left,
  &-right {
    display: flex;
    align-items: center;
  }
}
.content {
  width: 100vw;
  min-height: calc(100vh - #{$footer-height} - #{$header-height});
}
.footer {
  width: 100vw;
  height: $header-height;
  background: #001529;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  &-a {
    cursor: pointer;
  }
  &-text {
    font-size: 12px;
  }
}
</style>
