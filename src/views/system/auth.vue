<template>
  <br/>
</template>

<script>
import { GET_ACCESS_TOKEN } from '@/api/api.sys'
import { getQueryString } from '@/libs/util.common'
import { Loading } from 'element-ui'

export default {
  name: 'auth',
  data () {
    return {
      // 认证码
      code: '',
      loading: null
    }
  },
  mounted () {
    this.loading = Loading.service({
      fullscreen: true,
      text: '正在认证中'
    })
    this.code = getQueryString('code')
    console.log('code:', this.code)
    this.getAccessToken()
  },
  methods: {
    getAccessToken () {
      GET_ACCESS_TOKEN({ code: this.code }).then(res => {
        console.log('token:', res)
        if (res.code === 200) {
          // 跳转主页
          this.loading.close()
          localStorage.setItem('token', res.data.access_token)
          this.$router.replace('/')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
