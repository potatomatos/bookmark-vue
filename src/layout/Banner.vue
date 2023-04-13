<template>
  <header></header>
</template>

<script>
export default {
  name: 'Banner'
}
</script>

<style lang="scss" scoped>
@import "./css/init";
  header {
    width: 100%;
    height: $banner-height;
    background: url("/static/img/header-background.png") repeat-x;
  }
</style>
