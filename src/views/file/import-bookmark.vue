<template>
  <div class="upload-wrap">
    <el-upload
      class="upload-box"
      ref="upload"
      :auto-upload="false"
      :multiple="false"
      accept="text/html"
      :limit="1"
      drag
      action="https://jsonplaceholder.typicode.com/posts/">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传html文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'import-bookmark'
}
</script>

<style lang="scss" scoped>
  .upload-wrap{
    width: 360px;
    margin: 8px auto;
  }
</style>
