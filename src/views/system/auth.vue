<template>
  <br/>
</template>

<script>
import { GET_ACCESS_TOKEN, USER_INFO } from '@/api/api.sys'
import { getQueryString } from '@/libs/util.common'
import cookies from '@/libs/util.cookies'
import { Loading, Message } from 'element-ui'
import router from '@/router'
import {mapActions} from 'vuex'

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
    ...mapActions('common/user', [
      'set'
    ]),
    getAccessToken () {
      GET_ACCESS_TOKEN({
        code: this.code,
        clientId: process.env.CLIENT_ID,
        redirectUri: process.env.REDIRECT_URI
      }).then(res => {
        console.log('token:', res)
        this.loading.close()
        if (res.code === 200 && res.data) {
          // 跳转主页
          localStorage.setItem('token', res.data.access_token)
          cookies.set('token', res.data.access_token)
          USER_INFO().then(res => {
            if (res.code === 200 && res.data) {
              cookies.set('uid', res.data.id)
              this.set({ name: res.data.realName, ...res.data })
              this.$router.push({ name: 'index' })
            }
          })
        } else {
          Message({
            message: '认证失败，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          setTimeout(() => {
            router.push({ name: 'login' })
          }, 5000)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
