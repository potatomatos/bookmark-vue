<template>
<div class="bookmark-content" v-loading="LOADING">
  <ul class="bookmark-list" v-if="bookmarks.length">
    <li v-for="bookmark in bookmarks" :key="bookmark.nodeId" :class="{'active':bookmark.id===currentNode.id}"
        @click="bookmarkClick(bookmark)"
        @dblclick="bookmarkDbClick(bookmark)">
      <div class="link-icon">
        <el-image :src="bookmark.iconUrl"
                  fit="contain">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" style="font-size: 24px"></i>
          </div>
        </el-image>
      </div>
      <div class="link-title">
        {{bookmark.title}}
      </div>
      <div class="link-url">{{bookmark.url}}</div>
      <div class="create-time">{{formatMsgTime(bookmark.createTime)}}</div>
    </li>
    <li style="text-align: center">
      <el-button type="text" @click="more" :disabled="moreBtn.disabled">{{moreBtn.text}}</el-button>
    </li>
  </ul>
  <el-empty v-else :image-size="200"></el-empty>
</div>
</template>

<script>
import {formatMsgTime} from '@/libs/util.common'
import {REDIRECT, RECENT} from '@/api/api.index'
export default {
  name: 'index',
  data () {
    return {
      LOADING: false,
      currentNode: {},
      bookmarks: [],
      moreBtn: {
        text: '加载更多',
        disabled: false
      },
      postData: {
        page: 1,
        limit: 50
      }
    }
  },
  mounted () {
    this.getRecent()
  },
  methods: {
    formatMsgTime,
    bookmarkClick (bookmark) {
      this.currentNode = bookmark
    },
    bookmarkDbClick (bookmark) {
      // 直接打开链接
      REDIRECT({url: bookmark.url}).then(res => {
        if (res.code === 200) {
          window.open(res.data)
        }
      })
    },
    getRecent () {
      this.LOADING = true
      RECENT(this.postData).then(res => {
        this.LOADING = false
        if (res.code === 200) {
          if (res.data.length) {
            this.bookmarks = [...this.bookmarks, ...res.data]
          } else {
            this.moreBtn.text = '没有更多了'
            this.moreBtn.disabled = true
          }
        }
      })
    },
    more () {
      this.postData.page++
      this.getRecent()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/bookmark-list";
  .bookmark-content {
    background: #FFFFFF;
    padding: 10px;
    border: 1px solid #C7C7C7;
    border-radius: 5px;
  }
</style>
