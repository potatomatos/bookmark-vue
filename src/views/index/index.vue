<template>
  <div class="wrapper">
    <el-breadcrumb separator="/" class="nav-bar">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="bookmark-tree">
          <el-tree :data="data"
                   node-key="nodeId"
                   :props="defaultProps"
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
      <el-col :span="20">
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
                  <el-select size="mini" v-model="params.sort">
                    <el-option label="按默认排序" :value="0"></el-option>
                    <el-option label="按名称排序" :value="1"></el-option>
                    <el-option label="按域名排序" :value="2"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" class="word-height">
                  <el-dropdown>
                    <strong class="el-dropdown-link">
                      新建<i class="el-icon-arrow-down el-icon--right"></i>
                    </strong>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>新建收藏夹</el-dropdown-item>
                      <el-dropdown-item>新建书签</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col :span="4" class="word-height">
                  <el-link><strong>检测无效链接</strong></el-link>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" class="word-height">
              <el-input placeholder="搜索" size="mini" v-model="params.keyword"></el-input>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <ul class="bookmark-list" v-if="bookmarks.length">
            <li v-for="bookmark in bookmarks" :key="bookmark.nodeId" :class="{'active':bookmark.nodeId===currentNode.nodeId}"
                @dblclick="bookmarkDbClick(bookmark)"
                @click="bookmarkClick(bookmark)">
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
                  <icon name="heart" style="color: red" v-if="bookmark.expandData.favoriteFlg === 1"></icon>
                </div>
                <div class="link-url">{{bookmark.href}}</div>
                <div class="create-time">{{formatMsgTime(bookmark.createTime)}}</div>
            </li>
          </ul>
          <el-empty v-else :image-size="200"></el-empty>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {FOLDERS_TREE, BOOKMARKS, REDIRECT} from '@/api/api.index'
import {formatMsgTime} from '@/libs/util.common'
export default {
  name: 'index',
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      bookmarks: [],
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
      currentNode: {}
    }
  },
  created () {
    this.data.push(this.cwd)
  },
  mounted () {
    FOLDERS_TREE().then(res => {
      if (res.code === 200) {
        this.data[0].children = [...res.data]
      }
    })
    this.getBookmarks(this.cwd.nodeId)
  },
  methods: {
    formatMsgTime,
    handleNodeClick (data) {
      this.cwd = data
      this.getBookmarks(data.nodeId)
    },
    getBookmarks (pid) {
      BOOKMARKS(pid, this.params).then(res => {
        this.bookmarks = []
        if (res.code === 200) {
          this.bookmarks = [...res.data]
        }
      })
    },
    bookmarkDbClick (bookmark) {
      // 文件夹类型，进入文件夹
      if (bookmark.type === 1) {
        this.cwd = bookmark
        this.getBookmarks(bookmark.nodeId)
      } else {
        // 直接打开链接
        REDIRECT({url: bookmark.href}).then(res => {
          if (res.code === 200) {
            window.open(res.data)
          }
        })
      }
    },
    bookmarkClick (bookmark) {
      this.currentNode = bookmark
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    padding: 20px 10px;
    background: #e7e7e7;
  }

  .bookmark-tree {
    background: #FFFFFF;
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
  .bookmark-list {
    li {
      width: 100%;
      height: 24px;
      cursor: pointer;
      zoom: 1;
      margin-bottom: 8px;
      &:after{
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
      }
    }
    .active {
      background: #F39814;
    }
  }
  .link-title {
    float: left;
    max-width: 60%;
    min-width: 60%;
    line-height: 24px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
    font-size: 12px;
  }
  .link-icon {
    float: left;
    min-width: 24px;
    max-width: 24px;
    width: auto;
    text-align: right;
    .el-image {
      width: 100%;
      height: 100%;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  }
  .link-url{
    float: left;
    max-width: 27%;
    min-width: 27%;
    line-height: 24px;
    width: auto;
    font-size: 12px;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .create-time {
    float: right;
    max-width: 10%;
    min-width: 10%;
    width: auto;
    text-align: right;
    font-size: 12px;
    color: #999999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    .link-url {
      display: none;
    }
    .link-title {
      max-width: 80%;
    }
    .tool-bar {
      display: none;
    }
    .el-divider {
      display: none;
    }
  }
</style>
