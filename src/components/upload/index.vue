<template>
  <div>
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
        将 apk 文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <el-dialog
      width="700px"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="!uploadModalLoading"
      :title="fileInfo.name"
      :visible.sync="uploadModalVisible"
      @close="closeDialog"
      @click="closeDialog"
    >
      <div class="app" v-loading="uploadModalLoading" element-loading-text="上传中，请稍后...">
        <img :src="fileInfo.icon" />
        <el-form class="form" label-position="right" label-width="85px" size="small">
          <el-form-item label="包名：">
            <span>{{fileInfo.packageName}}</span>
          </el-form-item>
          <el-form-item label="当前版本：">
            <span>{{fileInfo.versionName}}（Build {{fileInfo.versionCode}}）</span>
          </el-form-item>
          <el-form-item label="更新日志：">
            <el-input type="textarea" v-model="form.updateText" :rows="5" placeholder="请输入内容"></el-input>
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
import { getOssSin } from '@/api/app'
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
        packageName: '',
        name: ''
      }
    }
  },
  methods: {
    closeDialog () {
      this.uploadStatus = 'none'
    },
    setModal1Visible (modal1Visible) {
      this.modal1Visible = modal1Visible
    },
    async parseFile () {
      const parser = new AppInfoParser(this.cacheFile)
      const apkInfo = await parser.parse()
      this.fileInfo = {
        versionCode: apkInfo.versionCode,
        versionName: apkInfo.versionName,
        icon: apkInfo.icon,
        packageName: apkInfo.package,
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
    async submitUpload () {
      this.uploadModalLoading = true

      this.uploadStatus = 'none'
      try {
        const uploadFile = this.cacheFile
        const sinResult = await getOssSin({
          ...this.fileInfo
        })

        if (sinResult.data.code === 0) {
          const { ossId, policy, signature, uploadPath, fileName, host, callback } = sinResult.data.data
          const formData = new FormData()
          formData.append('OSSAccessKeyId', ossId)
          formData.append('policy', policy)
          formData.append('signature', signature)
          formData.append('callback', callback)
          formData.append('key', `${uploadPath}${fileName}`)
          formData.append('success_action_status', 200)
          formData.append('file', uploadFile)
          this.progress = 0
          const uploadResult = await request(host, {
            method: 'post',
            data: formData,
            onUploadProgress: (progressEvent) => {
              const complete = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
              this.progress = complete
            }
          })
          if (uploadResult.data.code === 0) {
            this.uploadStatus = 'success'
            this.$message.success('上传成功！')
            this.$emit('uploadSuccess')
            this.dialogFormVisible = false
          } else {
            throw new Error(uploadResult.data.msg || '上传失败')
          }
        } else {
          throw new Error(sinResult.data.msg || '获取签名失败')
        }
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
