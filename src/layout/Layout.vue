<template>
  <div class="app-container">
    <Banner></Banner>
    <Header></Header>
    <div class="#main-content"></div>
  </div>
</template>

<script>
import Banner from './Banner'
import Header from './Header'

export default {
  name: 'Layout',
  components: {Banner, Header},
  mounted () {
  },
  methods: {}
}
</script>

<style scoped>
</style>
