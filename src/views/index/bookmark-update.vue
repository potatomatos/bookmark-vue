<template>
  <el-drawer
    title="更新书签"
    :before-close="handleClose"
    :visible.sync="dialog"
    :wrapperClosable="false"
    direction="rtl"
    size="50%"
    ref="drawer"
  >
    <el-container>
      <el-main>
        <el-form :model="data" :rules="rules" ref="dataForm" label-width="100px" label-position="right">
          <el-form-item label="名称" prop="title">
            <el-input v-model="data.title" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-input v-model="data.href" :clearable="true"></el-input>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer>
        <div style="text-align: center">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="save" type="primary">保存</el-button>
        </div>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script>
import {UPDATE_BOOKMARK, CHECK_URL} from '@/api/api.index'

export default {
  name: 'bookmarkUpdate',
  props: {
    data: {
      type: Object,
      required: true
    },
    dialog: {
      type: Boolean,
      required: false,
      default: false
    },
    close: {
      type: Function
    },
    cancel: {
      type: Function
    },
    confirm: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      rules: {
        title: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        href: [
          {
            required: true,
            message: '请输入链接地址',
            trigger: 'change',
            validator: (rule, value, callback) => {
              CHECK_URL({url: value}).then(res => {
                if (res.code === 200) {
                  if (res.data.exist) {
                    this.$notify.error({
                      title: '错误',
                      message: '链接已存在'
                    })
                    callback(new Error('url已存在'))
                  }
                }
              }).then(() => {
                callback()
              })
            }
          }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      if (this.close) {
        this.close()
      }
    },
    handleCancel () {
      this.handleClose()
      if (this.cancel) {
        this.cancel()
      }
    },
    save () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const postData = {id: this.data.nodeId, title: this.data.title, url: this.data.href}
          UPDATE_BOOKMARK(postData).then(res => {
            if (res.code === 200) {
              if (this.confirm) {
                this.confirm()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.msg
                })
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
