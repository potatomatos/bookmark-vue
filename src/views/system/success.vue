<template>
  <el-row>
    <el-col :sm="{ span: 12, push: 6 }" :lg="{ span: 6, push: 9 }" v-show="success">
      <el-result icon="success" title="登录成功"></el-result>
    </el-col>
    <el-col :sm="{ span: 12, push: 6 }" :lg="{ span: 6, push: 9 }" v-show="success === false">
      <el-result icon="warning" title="登录认证失败" :subTitle="errMsg"></el-result>
    </el-col>
  </el-row>
</template>

<script>
import { GET_ACCESS_TOKEN, USER_INFO } from '@/api/api.sys'
import { getQueryString } from '@/libs/util.common'
import cookies from '@/libs/util.cookies'
import { Loading, Message } from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'success',
  data () {
    return {
      // 认证码
      code: '',
      loading: null,
      success: null,
      errMsg: ''
    }
  },
  mounted () {
    this.loading = Loading.service({
      fullscreen: true,
      text: '正在认证中'
    })
    this.code = getQueryString('code')
    console.log('code:', this.code)
    if (!this.code) {
      this.errMsg = '参数有误'
      this.success = false
      this.loading.close()
    } else {
      this.getAccessToken()
    }
  },
  methods: {
    ...mapActions('common/user', [
      'set'
    ]),
    /**
     * 关闭页面
     */
    closePage () {
      console.log('关闭页面')
      if (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
        open(location, '_self').close()
        window.location.href = 'about:blank'
        window.close()
      } else {
        window.opener = null
        window.open('', '_self')
        window.close()
        open(location, '_self').close()
      }
    },
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
          this.success = true
          USER_INFO().then(res => {
            if (res.code === 200 && res.data) {
              cookies.set('uid', res.data.id)
              this.set({ name: res.data.realName, ...res.data })
            }
          })
        } else {
          this.success = false
          this.errMsg = res.msg
          Message({
            message: '认证失败，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    }
  }
}
</script>

<style scoped></style>
