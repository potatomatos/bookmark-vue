<template>
  <div class="page">
    <p class="page_title">404 请求地址出错</p>
    <el-button type="text" @click="$router.replace({ path: '/' })">返回首页</el-button>
  </div>
</template>
<script>

export default {
  name: 'leftArea',
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.page {
  background: #303133;
  background-blend-mode: multiply,multiply;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .page_title {
    font-size: 20px;
    color: #FFF;
  }
}
</style>
