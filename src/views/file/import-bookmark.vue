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
      action="string"
      :with-credentials="true"
      :before-upload="beforeUpload"
      :http-request="importBookmark">
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
// import webSocket from '@/libs/util.websocket'
import {IMPORT_BOOKMARK} from '@/api/api.index'

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
    // webSocket.connect(location.hostname, location.port, '/api/bookmark/websocket')
    // const _this = this
    // webSocket.listen({
    //   onmessage: function (data) {
    //     if (data.data) {
    //       const message = data.data
    //       if (message.msgType === 'uploadBookmark') {
    //         _this.progress = parseInt((message.msg.progress / message.msg.total) * 100)
    //         _this.title = message.msg.title
    //         if (_this.progress === 100) {
    //           _this.title = ''
    //         }
    //       }
    //     }
    //   }
    // })
    // window.onbeforeunload = function () {
    //   webSocket.close()
    // }
  },
  destroyed () {
    // webSocket.close()
  },
  methods: {
    beforeUpload (file) {
      const isHtml = file.type === 'text/html'
      if (!isHtml) {
        this.$message.error('只能导入html文件!')
      }
      return isHtml
    },
    importBookmark (file) {
      const params = new FormData()
      params.append('file', file.file)
      params.append('clearFlag', this.config.clearFlag)
      params.append('newFolderFlag', this.config.newFolderFlag)
      IMPORT_BOOKMARK(params).then((res) => {
        this.$refs.upload.clearFiles()
        if (res.code === 200) {
          this.$message.success('上传成功')
        } else {
          this.$message.success(res.msg)
        }
      }).catch(() => {
        this.$message.error('上传失败!')
        this.$refs.upload.clearFiles()
      })
    },
    submitUpload () {
      this.$refs.upload.submit()
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
