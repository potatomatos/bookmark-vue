<template>
  <el-drawer
    title="新建书签"
    :before-close="handleClose"
    :visible.sync="dialog"
    :wrapperClosable="false"
    direction="rtl"
    size="50%"
    ref="drawer"
  >
    <el-container>
      <el-main>
        <el-form :model="bookmark" :rules="rules" ref="dataForm" label-width="100px" label-position="right">
          <el-form-item label="名称" prop="title">
            <el-input v-model="bookmark.title" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-input v-model="bookmark.url" :clearable="true"></el-input>
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
import {CREATE_BOOKMARK} from '@/api/api.index'

export default {
  name: 'bookmarkNew',
  props: {
    folderId: {
      type: [Number, String],
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
      bookmark: {
        title: '',
        url: ''
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        url: [
          {
            required: true,
            message: '请输入链接地址',
            trigger: 'blur'
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
          CREATE_BOOKMARK(this.bookmark).then(res => {
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
  },
  watch: {
    folderId (val) {
      this.bookmark.folderId = val
    }
  }
}
</script>

<style scoped>

</style>
