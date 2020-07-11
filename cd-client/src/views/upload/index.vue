<template>
  <div class="container">
    <el-upload
      drag
      action
      :http-request="() => 'none'"
      accept=".apk"
      ref="upload"
      :before-upload="beforeUpload"
      :show-file-list="false"
      :multiple="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <el-dialog width="700px" :title="fileInfo.name" :visible.sync="uploadModalVisible">
      <div class="app" v-loading="uploadModalLoading">
        <img :src="fileInfo.icon" />
        <el-form class="form" label-position="right" label-width="80px" size="small">
          <el-form-item label="包名：">
            <span>{{fileInfo.package}}</span>
          </el-form-item>
          <el-form-item label="当前版本">
            <span>{{fileInfo.versionName}}（Build {{fileInfo.versionCode}}）</span>
          </el-form-item>
          <el-form-item required label="短链接">
            <el-input v-model="form.prevUrl" placeholder="请输入短链接" />
          </el-form-item>
          <el-form-item label="更新内容">
            <el-input type="textarea" v-model="form.updateText" :rows="3" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-progress
          v-if="uploadStatus == 'success' || uploadModalLoading"
          :text-inside="true"
          :stroke-width="40"
          :percentage="progress"
          status="success"
        ></el-progress>
        <el-button
          v-if="uploadStatus !== 'success' && !uploadModalLoading"
          style="width: 100%"
          type="primary"
          round
          @click="submitUpload"
        >上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOssSin } from '@/api/user'
import AppInfoParser from 'app-info-parser'
import request from '@/api/request'

export default {
  name: 'upload',
  data () {
    return {
      dialogFormVisible: false,
      progress: 0,
      uploadStatus: 'none',
      uploadModalVisible: false,
      cacheFile: {},
      uploadModalLoading: false,
      form: {
        updateText: '',
        prevUrl: ''
      },
      fileInfo: {
        versionCode: '',
        versionName: '',
        icon: '',
        package: '',
        name: ''
      }
    }
  },
  methods: {
    setModal1Visible (modal1Visible) {
      this.modal1Visible = modal1Visible
    },
    async upload () {
      const uploadFile = this.cacheFile
      const sinResult = await getOssSin()
      const { ossId, policy, signature, fileName, host } = sinResult.data

      const formData = new FormData()
      formData.append('OSSAccessKeyId', ossId)
      formData.append('policy', policy)
      formData.append('signature', signature)
      formData.append('key', fileName)
      formData.append('success_action_status', 200)
      formData.append('file', uploadFile)
      console.log('upload -> this.progress', this.progress)
      this.progress = 0
      console.log('upload -> this.progress', this.progress)
      await request(host, {
        method: 'post',
        data: formData,
        onUploadProgress: progressEvent => {
          const complete = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
          this.progress = complete
        }
      })
    },
    async parseFile () {
      const parser = new AppInfoParser(this.cacheFile)
      const apkInfo = await parser.parse()
      this.fileInfo = {
        versionCode: apkInfo.versionCode,
        versionName: apkInfo.versionName,
        icon: apkInfo.icon,
        package: apkInfo.package,
        name: apkInfo.application.label[0]
      }
      this.uploadModalVisible = true
    },
    async beforeUpload (file) {
      if (file.type !== 'application/vnd.android.package-archive') {
        this.$message.error('不支持该文件类型')
      } else {
        this.cacheFile = file
        await this.parseFile()
        this.uploadModalVisible = true
      }
    },
    checkInfo () {
      if (!this.form.prevUrl) {
        this.$message.warning('请填写短链接')
        return false
      } else {
        return true
      }
    },
    async submitUpload () {
      if (!this.checkInfo()) return
      this.uploadModalLoading = true

      this.uploadStatus = 'none'
      try {
        await this.upload()
        this.uploadStatus = 'success'
        this.$message.success('上传成功！')
      } catch (err) {
        this.$message.error(err.message)
      } finally {
        this.uploadModalLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  background: #f8f8f8;
  width: 100vw;
  .upload {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.app {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  & > img {
    border: 1px solid #eee;
    width: 194px;
  }
  .form {
    width: calc(100% - 230px);
  }
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
