<template>
  <div class="page">
    <div class="upload">
      <upload @uploadSuccess="refresh" />
    </div>
    <el-divider></el-divider>
    <div class="card-container" v-loading="loading">
      <div class="card" v-for="item of appList" :key="item.id">
        <img :src="item.icon" />
        <div class="card-content">
          <div class="card-title">{{item.name}}</div>
          <div class="card-info">BundleID：{{item.packageName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import upload from '@/components/upload'
import { getAppList } from '@/api/app'
export default {
  components: { upload },
  data () {
    return {
      loading: false,
      appList: []
    }
  },
  mounted () {
    this.fetchAppList()
  },
  methods: {
    refresh () {
      this.fetchAppList()
    },
    async fetchAppList () {
      try {
        this.loading = true
        const result = await getAppList()
        if (result.data.code === 0) {
          this.appList = result.data.data
        } else {
          this.$message.error(result.data.msg)
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
}
.upload {
  display: flex;
  width: 100%;
  padding: 20px 0;
  justify-content: center;
}
.el-divider--horizontal {
  margin: 0 0;
}
.card-container {
  width: 100%;
  min-height: 200px;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.card {
  width: 350px;
  height: 140px;
  cursor: pointer;
  padding: 10px;
  margin: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee5e5;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 15px;
  & > img {
    width: 100px;
    height: 100px;
  }
  &-content {
    margin-left: 10px;
  }
  &-title {
    font-size: 22px;
  }
  &-info {
    margin-top: 10px;
    font-size: 16px;
    color: #666;
  }
}
</style>
