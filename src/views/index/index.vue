<template>
  <div class="wrapper" @contextmenu.prevent="onContextmenu($event)">
    <el-breadcrumb separator="\" class="nav-bar">
      <el-breadcrumb-item><a href="javascript:" @click="getBookmarks(0)">我的收藏</a></el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="parent in parents"
        :key="parent.nodeId">
        <span v-if="parent.nodeId===cwd.nodeId">{{parent.title}}</span>
        <a href="javascript:" @click="getBookmarks(parent.nodeId)" v-else>{{parent.title}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="bookmark-tree">
          <el-tree :data="data"
                   node-key="nodeId"
                   :props="defaultProps"
                   :current-node-key="cwd.nodeId"
                   :highlight-current="true"
                   :default-expand-all="true"
                   :expand-on-click-node="false"
                   @node-click="handleNodeClick">
            <div slot-scope="{ node, data }" class="tree-icon">
              <i class="el-icon-collection-tag"></i>
              <span>{{ node.label}}</span>
            </div>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" v-loading="LOADING">
        <div class="bookmark-content">
          <el-row class="tool-bar">
            <el-col :span="6" class="word-height">
              <span class="page-title">{{cwd.title}}</span>
              <span class="bookmark-num">{{bookmarks.length}}收藏</span>
            </el-col>
            <el-col :span="12" class="word-height">
              <el-row>
                <el-col :span="12">
                  <label>排序</label>
                  <el-select size="mini" v-model="params.sort" @change="getBookmarks(cwd.nodeId)">
                    <el-option label="按默认排序" :value="0"></el-option>
                    <el-option label="按名称排序" :value="1"></el-option>
                    <el-option label="按域名排序" :value="2"></el-option>
                    <el-option label="最常访问" :value="3"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" class="word-height">
                  <el-dropdown @command="handleCommand">
                    <strong class="el-dropdown-link">
                      新建<i class="el-icon-arrow-down el-icon--right"></i>
                    </strong>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="1">新建收藏夹</el-dropdown-item>
                      <el-dropdown-item :command="2">新建书签</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col :span="4" class="word-height">
                  <el-link><strong>检测无效链接</strong></el-link>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" class="word-height">
              <el-input placeholder="搜索" size="mini" v-model="params.keyword" @change="getBookmarks(cwd.nodeId)"></el-input>
            </el-col>
          </el-row>
          <el-row class="search-bar">
           <el-col :span="24">
             <el-input
               @keyup.enter.native="getBookmarks(cwd.nodeId)"
               placeholder="搜索关键字"
               suffix-icon="el-icon-search"
               v-model="params.keyword">
             </el-input>
           </el-col>
          </el-row>
          <el-divider></el-divider>
          <ul class="bookmark-list" v-if="bookmarks.length">
            <li v-for="bookmark in bookmarks" :key="bookmark.nodeId" :class="{'active':(bookmark.nodeId===currentNode.nodeId)||(selectedCommand.selectedList.includes(bookmark))}"
                @dblclick="bookmarkDbClick(bookmark)"
                @click="bookmarkClick(bookmark)"
                @contextmenu.prevent="onContextmenu($event,bookmark)">
                <div class="link-icon">
                  <svg v-if="bookmark.type === 1" t="1644992842222" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2115" width="32" height="32"><path d="M576 268.8h313.6c12.8 0 19.2-12.8 19.2-25.6v-76.8c0-12.8-6.4-25.6-19.2-25.6H518.4c-19.2 0-25.6 25.6-12.8 38.4l57.6 83.2c0 6.4 6.4 6.4 12.8 6.4z" p-id="2116" fill="#707070"></path><path d="M902.4 320H576c-12.8 0-32-6.4-38.4-25.6L409.6 128c-12.8-12.8-25.6-19.2-44.8-19.2H128c-32 0-57.6 32-57.6 64V800c0 38.4 25.6 64 57.6 64h774.4c32 0 57.6-32 57.6-64V384c0-38.4-25.6-64-57.6-64zM633.6 672c0 19.2-12.8 32-32 32H204.8c-19.2 0-32-12.8-32-32s12.8-32 32-32H608c12.8 0 25.6 12.8 25.6 32z m166.4 0c0 19.2-12.8 32-32 32h-25.6c-19.2 0-32-12.8-32-32s12.8-32 32-32H768c19.2 0 32 12.8 32 32z" p-id="2117" fill="#707070"></path></svg>
                  <el-image v-else
                    :src="bookmark.icon"
                    fit="contain">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 24px"></i>
                    </div>
                  </el-image>
                </div>
                <div class="link-title">
                  {{bookmark.title}}
                </div>
                <div class="link-url">{{bookmark.href}}</div>
                <div class="create-time">{{formatMsgTime(bookmark.createTime)}}</div>
            </li>
          </ul>
          <el-empty v-else :image-size="200"></el-empty>
        </div>
      </el-col>
    </el-row>
    <bookmark-new
      :folder-id="cwd.nodeId"
      :dialog="newBookmarkDialog"
      :close="()=>{
        this.newBookmarkDialog=false
      }"
      :cancel="()=>{
        this.newBookmarkDialog=false
      }"
      :confirm="()=>{
        this.newBookmarkDialog = false
        this.getBookmarks(cwd.nodeId)
      }"
    ></bookmark-new>
    <bookmark-update
      :data="currentNode"
      :dialog="updateBookmarkDialog"
      :close="()=>{
        this.updateBookmarkDialog=false
      }" :cancel="()=>{
        this.updateBookmarkDialog=false
      }" :confirm="()=>{
        this.updateBookmarkDialog = false
        this.getBookmarks(cwd.nodeId)
      }"></bookmark-update>
    <el-dialog title="新建收藏夹" :visible.sync="newFolderVisibleDialog"
               center>
      <el-form :model="newFolder">
        <el-form-item label="收藏夹名称" label-width="120px">
          <el-input v-model="newFolder.folderName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newFolderVisibleDialog = false">取 消</el-button>
        <el-button type="primary" @click="createFolder">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更新收藏夹" :visible.sync="updateFolderVisibleDialog"
               center>
      <el-form :model="currentNode">
        <el-form-item label="收藏夹名称" label-width="120px">
          <el-input v-model="currentNode.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFolderVisibleDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateFolder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {FOLDERS_TREE, BOOKMARKS, REDIRECT, CREATE_FOLDER, UPDATE_FOLDER, BOOKMARK_DEL, FOLDER_DEL, MOVE} from '@/api/api.index'
import {formatMsgTime} from '@/libs/util.common'
import bookmarkNew from './bookmark-new'
import bookmarkUpdate from './bookmark-update'
export default {
  name: 'index',
  components: {bookmarkNew, bookmarkUpdate},
  data () {
    return {
      LOADING: false,
      newBookmarkDialog: false,
      updateBookmarkDialog: false,
      newFolderVisibleDialog: false,
      updateFolderVisibleDialog: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      bookmarks: [],
      parents: [],
      // 列表请求参数
      params: {
        keyword: '',
        sort: 0
      },
      // 当前目录
      cwd: {
        nodeId: 0,
        title: '我的收藏',
        children: []
      },
      // 单击的行
      currentNode: {},
      // 多选行
      selectedCommand: {
        // 剪切标志
        clipped: false,
        selectedList: []
      },
      newFolder: {
        folderName: '',
        parentId: null
      },
      // 多选标识
      pin: false
    }
  },
  created () {
    this.data.push({...this.cwd})
    if (location.hash) {
      this.cwd.nodeId = location.hash.substr(1)
    }
  },
  mounted () {
    const _this = this
    window.onhashchange = function () {
      if (location.hash) {
        _this.cwd.nodeId = location.hash.substr(1)
        _this.getBookmarks(_this.cwd.nodeId)
      }
    }
    this.folderTree()
    this.getBookmarks(this.cwd.nodeId)

    // 多选事件
    window.addEventListener('keydown', code => {
      if (code.keyCode === 17 && code.ctrlKey) {
        this.pin = true
      }
    })
    window.addEventListener('keyup', code => {
      if (code.keyCode === 17) {
        this.pin = false
      }
    })
  },
  methods: {
    formatMsgTime,
    handleNodeClick (data) {
      this.getBookmarks(data.nodeId)
    },
    folderTree () {
      FOLDERS_TREE().then(res => {
        if (res.code === 200) {
          this.data[0].children = [...res.data]
        }
      })
    },
    getBookmarks (pid) {
      if (!this.LOADING) {
        location.hash = pid
        this.LOADING = true
        BOOKMARKS(pid, this.params).then(res => {
          this.LOADING = false
          this.bookmarks = []
          if (res.code === 200) {
            this.bookmarks = [...res.data.bookmarks]
            this.parents = [...res.data.parents]
            this.cwd = {...res.data.cwd}
          }
        })
      }
    },
    bookmarkDbClick (bookmark) {
      // 文件夹类型，进入文件夹
      if (bookmark.type === 1) {
        this.getBookmarks(bookmark.nodeId)
      } else {
        // 直接打开链接
        REDIRECT({url: bookmark.href, id: bookmark.nodeId}).then(res => {
          if (res.code === 200) {
            window.open(res.data)
          }
        })
      }
    },
    bookmarkClick (bookmark) {
      if (this.pin) {
        this.multipleSelect(bookmark)
      } else {
        this.currentNode = bookmark
      }
    },
    multipleSelect (bookmark) {
      this.currentNode = {}
      if (!this.selectedCommand.selectedList.includes(bookmark)) {
        this.selectedCommand.selectedList.push(bookmark)
      }
    },
    handleCommand (command) {
      if (command === 1) {
        this.newFolderVisibleDialog = true
      } else if (command === 2) {
        this.newBookmarkDialog = true
      }
    },
    createFolder () {
      this.newFolder.parentId = this.cwd.nodeId
      CREATE_FOLDER(this.newFolder).then(res => {
        if (res.code === 200) {
          this.newFolderVisibleDialog = false
          this.newFolder = {folderName: '', parentId: null}
          this.folderTree()
          this.getBookmarks(this.cwd.nodeId)
        } else {
          this.$notify.error({
            title: '错误',
            message: res.msg
          })
        }
      })
    },
    updateFolder () {
      const data = {id: this.currentNode.nodeId, folderName: this.currentNode.title}
      UPDATE_FOLDER(data).then(res => {
        if (res.code === 200) {
          this.updateFolderVisibleDialog = false
          this.folderTree()
          this.getBookmarks(this.cwd.nodeId)
        } else {
          this.$notify.error({
            title: '错误',
            message: res.msg
          })
        }
      })
    },
    /**
     * 右键菜单
     * @param event
     * @param bookmark
     */
    onContextmenu: function (event, bookmark) {
      if (bookmark) {
        this.bookmarkClick(bookmark)
      }

      this.$contextmenu({
        items: [
          {
            label: '刷新',
            divided: true,
            onClick: () => {
              this.folderTree()
              this.getBookmarks(this.cwd.nodeId)
              this.selectedCommand.selectedList = []
              this.selectedCommand.clipped = false
            }
          },
          {
            label: '剪切',
            hidden: this.selectedCommand.clipped,
            onClick: () => {
              this.selectedCommand.clipped = true
            }
          },
          {
            label: '粘贴',
            hidden: !this.selectedCommand.clipped,
            onClick: () => {
              const postData = this.selectedCommand.selectedList.map(item => {
                return {id: item.nodeId, type: item.type}
              })
              MOVE(postData, this.cwd.nodeId).then(res => {
                if (res.code === 200) {
                  this.$notify.success('操作成功')
                  this.selectedCommand.clipped = false
                  this.selectedCommand.selectedList = []
                  this.getBookmarks(this.cwd.nodeId)
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: res.msg
                  })
                }
              })
            }
          },
          {
            label: '修改',
            hidden: bookmark === undefined,
            onClick: () => {
              if (bookmark.type === 1) {
                this.updateFolderVisibleDialog = true
              } else {
                this.updateBookmarkDialog = true
              }
            }
          },
          {
            label: '删除',
            hidden: bookmark === undefined,
            onClick: () => {
              this.del(bookmark)
            }
          }
        ],
        event,
        customClass: 'ui-helper-reset ui-front ui-widget ui-state-default ui-corner-all',
        zIndex: 1001,
        minWidth: 200
      })
      event.preventDefault()
      event.stopPropagation()
      return false
    },
    del (bookmark) {
      this.$confirm('确定要删除吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (bookmark.type === 1) {
          FOLDER_DEL(bookmark.nodeId).then(res => {
            if (res.code === 200) {
              this.getBookmarks(this.cwd.nodeId)
              this.folderTree()
            } else {
              this.$notify.error({
                title: '错误',
                message: res.msg
              })
            }
          })
        } else if (bookmark.type === 2) {
          BOOKMARK_DEL(bookmark.nodeId).then(res => {
            if (res.code === 200) {
              this.getBookmarks(this.cwd.nodeId)
              this.folderTree()
            } else {
              this.$notify.error({
                title: '错误',
                message: res.msg
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          message: '操作取消',
          type: 'warning'
        })
      })
    }
  },
  destroyed () {
    // 移除事件
    window.onhashchange = null
    window.onkeydown = null
    window.onkeyup = null
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/bookmark-list";
  .wrapper {
    padding: 20px 10px;
    position: relative;
  }

  .bookmark-tree {
    background: #FFFFFF;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .bookmark-content {
    background: #FFFFFF;
    padding: 10px;
    border: 1px solid #C7C7C7;
    border-radius: 5px;
  }

  .tree-icon > i {
    color: #606266;
    font-size: 1.5em;
    vertical-align: middle;
  }

  .nav-bar {
    height: 40px;
    line-height: 40px;
    display: none;
  }

  .word-height {
    line-height: 40px;
  }

  .page-title {
    font-size: 16px;
    font-weight: bold;
  }

  .bookmark-num {
    font-size: 12px;
    font-weight: normal;
    color: #999999;
  }

  .search-bar {
    display: none;
  }
  @media screen and (max-width: 768px) {
    .bookmark-tree {
      display: none !important;
    }

    .el-col-20 {
      width: 100% !important;
    }

    .nav-bar {
      display: block;
    }
    .tool-bar {
      display: none;
    }
    .search-bar {
      display: block;
    }
  }
</style>
