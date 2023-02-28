<template>
  <div class="wrapper">
    <div class="nav-bar">
      导航条
    </div>
    <el-row>
      <el-col :span="4" class="bookmark-tree">
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
      </el-col>
      <el-col :span="20"></el-col>
    </el-row>
  </div>
</template>

<script>
import {FOLDERS_TREE} from '@/api/api.index'
export default {
  name: 'index',
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  mounted () {
    FOLDERS_TREE().then(res => {
      if (res.code === 200) {
        this.data = res.data
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
  .tree-icon>i {
    color: #606266;
    font-size: 1.5em;
    vertical-align: middle;
  }
  .nav-bar {
    width: 100%;
    height: 40px;
    line-height: 40px;
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
  }
</style>
