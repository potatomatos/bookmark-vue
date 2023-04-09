<template>
<div>
  <h2 style="text-align: center">系统参数设置</h2>
  <el-divider></el-divider>
  <el-row type="flex" justify="center">
    <el-col :xs="24" :sm="20" :md="12" :lg="10" :xl="8">
      <el-form :model="systemSettings" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="接口地址">
          <el-col :span="7">
            <el-form-item prop="protocol">
              <el-select v-model="systemSettings.protocol" placeholder="协议">
                <el-option label="http" value="http"></el-option>
                <el-option label="https" value="https"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="host">
              <el-input type="text" v-model="systemSettings.host" prop="host" placeholder="IP/域名" :clearable="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="port">
              <el-input type="number" v-model="systemSettings.port" prop="port" placeholder="端口"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="登录回调地址" prop="redirectUri">
          <el-input type="text" v-model="systemSettings.redirectUri"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'systemSettings',
  data () {
    return {
      systemSettings: {},
      rules: {
        protocol: [
          { required: true, message: '请选择协议', trigger: 'change' }
        ],
        host: [
          { required: true, message: '请输入IP/域名', trigger: 'blur' }
        ],
        redirectUri: [
          { required: true, message: '请输入回调地址', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let systemSettings = localStorage.getItem('systemSettings')
    if (systemSettings) {
      systemSettings = JSON.parse(systemSettings)
      this.systemSettings = {...systemSettings}
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let baseURL = this.systemSettings.protocol + '://' + this.systemSettings.host
          if (this.systemSettings.port) {
            baseURL = baseURL + ':' + this.systemSettings.port
          }
          this.systemSettings.baseURL = baseURL
          localStorage.setItem('systemSettings', JSON.stringify(this.systemSettings))
          this.$router.replace('/login')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.systemSettings = {}
    }
  }
}
</script>

<style scoped>

</style>
