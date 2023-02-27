<template>
  <div class="page">
    <p class="page_title">404 请求地址出错</p>
    <button class="d2-mt" @click="$router.replace({ path: '/' })">
      返回首页
    </button>
  </div>
</template>
<script>
import $ from 'jquery'

export default {
  name: 'leftArea',
  mounted () {
    $('.d2-mt').button()
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
