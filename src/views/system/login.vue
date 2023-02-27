<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">登录</div>
      <div class="form-wrapper">
        <input type="text" name="username" placeholder="用户名" class="input-item" v-model="formLogin.username">
        <input type="password" name="password" placeholder="密码" class="input-item" v-model="formLogin.password">
        <div><img v-bind:src="captchaUrl" v-on:click="refreshCaptcha" alt="验证码"></div>
        <input type="text" name="captcha" placeholder="验证码" class="input-item" v-model="formLogin.captcha">
        <div :class="['btn',{'pointer':!doing}]" @click="login">登录</div>
      </div>
      <div class="msg">
        <p>Don't have account?
          <a href="#">Sign up</a>
        </p>
        <p v-if="errorMsg">{{errorMsg}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {LOGIN} from '@/api/api.sys'
export default {
  data () {
    return {
      captchaUrl: '/api/oauth-server/captcha?code=',
      errorMsg: '',
      doing: false,
      // 表单
      formLogin: {
        username: 'mengjinyuan',
        password: '123123',
        captcha: '',
        type: 'PASSWORD',
        clientId: 'system',
        redirectUri: 'http://localhost:8082/auth'
      }
    }
  },
  methods: {
    /**
     * @description 刷新验证码
     */
    refreshCaptcha () {
      // 生成一个随机数（防止缓存）
      const num = Math.ceil(Math.random() * 1000)
      this.captchaUrl = '/api/oauth-server/captcha?code=' + num
      this.formLogin.captcha = ''
    },
    /**
     * 提交登录
     */
    login () {
      if (this.doing) {
        return
      }
      if (!this.formLogin.username) {
        this.$notify({
          title: '警告',
          message: '请输入用户名',
          type: 'warning'
        })
        return
      }
      if (!this.formLogin.password) {
        this.$notify({
          title: '警告',
          message: '请输入密码',
          type: 'warning'
        })
        return
      }
      if (!this.formLogin.captcha) {
        this.$notify({
          title: '警告',
          message: '请输入验证码',
          type: 'warning'
        })
        return
      }
      this.doing = true
      LOGIN(this.formLogin).then(res => {
        this.doing = false
        if (res.code === 200) {
          console.log('登录成功,跳转认证地址')
          window.location = '/api/oauth-server' + res.data.authorizeUrl
        } else {
          this.refreshCaptcha()
          this.$notify({
            title: '登录失败',
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(res => {
        this.refreshCaptcha()
        this.doing = false
        this.$notify({
          title: '登录失败',
          message: res.message,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    height: 100%;
    /*background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);*/
  }

  .login-wrapper {
    background-color: #fff;
    width: 358px;
    height: 588px;
    border-radius: 15px;
    padding: 0 50px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .header {
    font-size: 38px;
    font-weight: bold;
    text-align: center;
    line-height: 200px;
  }

  .input-item {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    border: 0;
    padding: 10px;
    border-bottom: 1px solid rgb(128, 125, 125);
    font-size: 15px;
    outline: none;
  }

  .input-item::placeholder {
    text-transform: uppercase;
  }

  .btn {
    text-align: center;
    padding: 10px;
    width: 100%;
    margin-top: 40px;
    background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
    color: #fff;
  }
  .pointer {
    cursor: pointer;
  }

  .msg {
    text-align: center;
    line-height: 88px;
  }

  a {
    text-decoration-line: none;
    color: #abc1ee;
  }
</style>
