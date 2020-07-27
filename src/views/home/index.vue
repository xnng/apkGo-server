<template>
  <div class="page">
    <div class="upload">
      <upload @uploadSuccess="fetchAppList" />
    </div>
    <el-divider></el-divider>
    <div class="card-container" v-loading="loading">
      <div class="card" v-for="item of appList" :key="item.id">
        <div class="card-icon">
          <img :src="require('@/assets/android-white.png')" />
        </div>
        <img class="card-logo" :src="item.icon" />
        <div class="card-name">{{item.name}}</div>
        <div class="card-desc">
          包名：
          <span class="card-desc-value">{{item.packageName}}</span>
        </div>
        <div class="card-desc" v-if="item.app_versions.length !== 0">
          最新版本：
          <span
            class="card-desc-value"
          >{{item.app_versions[0].versionName}}（Build {{item.app_versions[0].versionCode}}）</span>
        </div>
        <div class="card-desc">
          总下载次数：
          <span class="card-desc-value">{{item.downLoadCount}}</span>
        </div>
        <div class="card-btn">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-document"
            @click="showHistory(item)"
            :loading="historyBtnLoading"
          >历史版本</el-button>
          <router-link target="_blank" :to="{ path: `/release/${item.app_versions[0].id}` }">
            <el-button
              size="mini"
              plain
              type="success"
              icon="el-icon-view"
              style="margin-left:10px"
            >预览</el-button>
          </router-link>
        </div>
      </div>
    </div>
    <el-dialog :title="cacheName" :visible.sync="showHistoryDialog" width="800px">
      <div v-loading="versionLoading">
        <el-table :data="versionList">
          <el-table-column property="version" align="center" label="版本号" width="160"></el-table-column>
          <el-table-column property="downLoadCount" align="center" label="下载次数" width="100"></el-table-column>
          <el-table-column property="updateText" align="center" label="更新日志"></el-table-column>
          <el-table-column property="createTime" align="center" label="创建时间" width="170"></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="80" property="address">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-download"
                @click="download(scope.row.id)"
              >下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[5,10, 20, 30,40,50]"
            :page-size="pagination.limit"
            layout="total, sizes, prev, pager, next"
            :total="pagination.total"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/components/upload'
import { getAppList, getVersionList, downloadapp } from '@/api/app'
import dayjs from 'dayjs'

export default {
  name: 'home',
  components: { upload },
  data () {
    return {
      showHistoryDialog: false,
      cachePackageName: '',
      cacheName: '',
      pagination: {
        currentPage: 1,
        total: 0,
        limit: 5
      },
      versionList: [],
      loading: false,
      historyBtnLoading: false,
      versionLoading: false,
      appList: []
    }
  },
  mounted () {
    this.fetchAppList()
  },
  methods: {
    async download (id) {
      this.versionLoading = true
      try {
        const result = await downloadapp(id)
        if (result.data.code === 0) {
          await this.fetchVersionList()
          await this.fetchAppList()
          window.open(result.data.data, '_self')
        } else {
          this.$message.error(result.data.msg)
        }
      } finally {
        this.versionLoading = false
      }
    },
    async showHistory (item) {
      this.cachePackageName = item.packageName
      this.cacheName = item.name
      this.pagination.currentPage = 1
      this.historyBtnLoading = true

      try {
        await this.fetchVersionList()
      } finally {
        this.historyBtnLoading = false
        this.showHistoryDialog = true
      }
    },
    handleSizeChange (size) {
      this.pagination.limit = size
      this.pagination.currentPage = 1
      this.fetchVersionList()
    },
    handleCurrentChange (page) {
      this.pagination.currentPage = page
      this.fetchVersionList()
    },
    async fetchVersionList () {
      this.versionLoading = true
      try {
        const { currentPage, limit } = this.pagination
        const list = await getVersionList({
          packageName: this.cachePackageName,
          limit: limit,
          offset: (currentPage - 1) * limit
        })
        if (list.data.code === 0) {
          this.pagination.total = list.data.data.count
          this.versionList = list.data.data.rows.map((item) => ({
            ...item,
            updateText: item.updateText ? item.updateText : '--',
            version: `${item.versionName}（Build ${item.versionCode}）`,
            createTime: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
          }))
        }
      } finally {
        this.versionLoading = false
      }
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
  position: relative;
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
  &-icon {
    position: absolute;
    top: 0;
    right: 0;
    height: 0;
    width: 0;
    border-top: 48px solid #a4c639;
    border-left: 48px solid transparent;
    & > img {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 3px;
      top: -42px;
      z-index: 2;
    }
  }
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
  &-btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
  }
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
