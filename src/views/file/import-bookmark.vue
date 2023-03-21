<template>
  <div class="upload-wrap">
    <el-upload
      class="upload-box"
      ref="upload"
      :auto-upload="false"
      :multiple="false"
      :disabled="progress!==0"
      accept="text/html"
      :limit="1"
      drag
      action="/api/bookmark/my-bookmark/import/bookmark"
      :with-credentials="true"
      :headers="{access_token:token }"
      :data="config"
      :on-success="uploadSuccess"
      :on-error="uploadError">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传html文件，且不超过500kb</div>
    </el-upload>
    <el-form ref="form" :model="config">
      <el-form-item>
        <el-checkbox v-model="config.clearFlag" true-label="1" false-label="0">导入前清空现有收藏夹</el-checkbox>
        <el-checkbox v-model="config.newFolderFlag" true-label="1" false-label="0">为导入的收藏新建一个文件夹</el-checkbox>
      </el-form-item>
      <el-form-item v-if="progress">
        <el-progress :text-inside="true" :stroke-width="24" :percentage="progress" :color="customColors"></el-progress>
        <div style="height: 50px;"><p style="word-wrap:break-word;white-space:pre-wrap;font-size: 12px;line-height: 16px">{{title}}</p></div>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="success" @click="submitUpload" :disabled="progress!==0">导入</el-button>
      </el-form-item>
      </el-form>
  </div>
</template>

<script>
import webSocket from '@/libs/util.websocket'
export default {
  name: 'import-bookmark',
  data () {
    return {
      token: '',
      config: {
        clearFlag: '0',
        newFolderFlag: '0'
      },
      // 进度条颜色
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      progress: 0,
      title: ''
    }
  },
  created () {
    this.token = localStorage.getItem('token')
  },
  mounted () {
    webSocket.connect('127.0.0.1', '8085', '/bookmark/websocket')
    const _this = this
    webSocket.listen({
      onmessage: function (data) {
        if (data.data) {
          const message = data.data
          if (message.msgType === 'uploadBookmark') {
            _this.progress = parseInt((message.msg.progress / message.msg.total) * 100)
            _this.title = message.msg.title
            if (_this.progress === 100) {
              _this.title = ''
            }
          }
        }
      }
    })
    window.onbeforeunload = function () {
      webSocket.close()
    }
  },
  destroyed () {
    webSocket.close()
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
    },
    uploadSuccess () {
      this.$refs.upload.clearFiles()
    },
    uploadError () {
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-wrap{
    width: 360px;
    margin: 8px auto;
  }
</style>
