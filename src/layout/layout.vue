<template>
  <div class="app-container">
    <header></header>

  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'layout',
  mounted () {
    this.setContentHeight()
    const _this = this
    $(window).resize(function () {
      _this.setContentHeight()
    })
  },
  methods: {
    setContentHeight () {
      $('.main-content').height(($('.main-area').height() - 88) + 'px')
    }
  }
}
</script>

<style scoped>
header {
  width: 100%;
  height: 120px;
  background: url("/src/assets/img/header-background.png") repeat-x;
}
</style>
