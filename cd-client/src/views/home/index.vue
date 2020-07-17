<template>
  <div class="page">
    <div class="upload">
      <upload @uploadSuccess="refresh" />
    </div>
    <el-divider></el-divider>
    <div class="card-container" v-loading="loading">
      <div class="card" v-for="item of appList" :key="item.id">
        <img class="card-logo" :src="item.icon" />
        <div class="card-name">{{item.name}}</div>
        <div class="card-desc">
          包名：
          <span class="card-desc-value">{{item.packageName}}</span>
        </div>
        <div class="card-desc">
          最新版本：
          <span
            class="card-desc-value"
          >{{item.app_versions[0].versionName}}（Build {{item.app_versions[0].versionCode}}）</span>
        </div>
        <div class="card-desc">
          总下载次数：
          <span class="card-desc-value">{{item.downLoadCount}}</span>
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
  width: 300px;
  cursor: pointer;
  padding: 10px;
  margin: 10px 10px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 30px;
  box-sizing: border-box;
  transition: all 0.3s;
  box-shadow: 0 0 5px 0 #e7e5e5;
  &:hover {
    transform: translate3d(0, -5px, 0);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  &-logo {
    border-radius: 15px;
    width: 100px;
    height: 100px;
  }
  &-name {
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0;
  }
  &-desc {
    margin: 1px 0;
    word-break: break-all;
    font-size: 14px;
    color: #999;
    &-value {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
