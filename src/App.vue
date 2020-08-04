<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted () {
    this.$nextTick(() => {
      document.getElementById('myloading').style.display = 'none'
    })
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.el-menu.el-menu--horizontal {
  border-bottom: none !important;
}
</style>
