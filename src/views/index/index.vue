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
          <el-row>
            <el-col :span="6" class="word-height">
              <span class="page-title">所有书签</span>
              <span class="bookmark-num">0收藏</span>
            </el-col>
            <el-col :span="12" class="word-height">
              <el-row>
                <el-col :span="12">
                  <label>排序</label>
                  <el-select size="mini" v-model="sortType">
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
              <el-input placeholder="搜索" size="mini"></el-input>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <ul class="bookmark-list">
            <li>
                <div class="link-icon"></div>
                <div class="link-title"></div>
                <div class="link-url"></div>
                <div class="create-time"></div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {FOLDERS_TREE} from '@/api/api.index'
export default {
  name: 'index',
  data () {
    return {
      data: [
        {
          title: '我的收藏',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      sortType: {}
    }
  },
  mounted () {
    FOLDERS_TREE().then(res => {
      if (res.code === 200) {
        this.data[0].children = [...res.data]
      }
    })
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    }
  }
}
</script>

<style scoped>
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
  text-align: center;
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
}
</style>
