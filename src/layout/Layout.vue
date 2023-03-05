<template>
  <div class="app-container">
    <Banner></Banner>
    <Header></Header>
    <div id="mainContent">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Banner from './Banner'
import Header from './Header'
import Footer from './Footer'

export default {
  name: 'Layout',
  components: {Banner, Header, Footer},
  mounted () {
  },
  methods: {}
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-flow: column;
  height: 100%;
}
#mainContent {
  background-image: url("../assets/img/background.png");
  background-repeat: repeat;
  overflow-y: auto;
  flex: 1;
}
</style>
