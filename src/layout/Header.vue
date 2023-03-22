<template>
  <!--xs: phone, sm: pad, md: pc, lg: 2k-pc, xl: 4k-pc-->
  <nav class="header">
    <!-- 顶部导航 -->
    <div class="container">
      <ul class="container-left-ul">
        <li>
          <img id="icon" src="@/assets/img/icon.png"/>
        </li>
        <li :class="activeRoute === item.activeUrl ? 'menu-item-active' : 'container-left-li'" @click="toActiveMenuItem(item)"
            v-for="(item, index) in leftMenuList" :key="index">
          {{ item.titleName }}
        </li>
      </ul>
      <ul class="container-right-ul">
        <li :class="activeRoute === item.activeUrl ? 'menu-item-active' : 'container-right-li'" @click="toActiveMenuItem(item)"
            v-for="(item, index) in rightMenuList" :key="index">
          {{ item.titleName }}
        </li>
        <li id="bars" @click="dropDownShow = !dropDownShow">
<!--          <icon name="bars" size="lg"></icon>-->
          <el-image
            style="width: 100px; height: 100px"
            :src="info.avatar"
            fit="cover"></el-image>
        </li>
      </ul>
    </div>

    <!-- 下拉菜单 -->
    <transition name="dropdown-fade-show">
      <div v-show="dropDownShow" class="dropdown">
        <ul class="dropdown-top-ul">
          <li class="dropdown-top-li" v-for="(item, index) in leftMenuList" :key="index" @click="toActiveMenuItem(item)">{{ item.titleName }}</li>
        </ul>
        <ul class="dropdown-bottom-ul">
          <li class="dropdown-bottom-li" v-for="(item, index) in rightMenuList" :key="index" @click="toActiveMenuItem(item)">{{ item.titleName }}</li>
        </ul>
      </div>
    </transition>

  </nav>
</template>

<script>
import {LOGOUT} from '@/api/api.sys'
import {Message, MessageBox} from 'element-ui'
import cookies from '@/libs/util.cookies'
import {mapState} from 'vuex'

export default {
  name: 'Header',
  data () {
    return {
      dropDownShow: false, // 控制下拉菜单显示
      leftMenuList: [ // 左侧菜单内容
        { activeName: 'Home', titleName: '主页', activeUrl: '/index' },
        { activeName: 'Recent', titleName: '最近访问', activeUrl: '/recent' },
        { activeName: 'Import', titleName: '导入书签', activeUrl: '/import' }
      ],
      rightMenuList: [ // 右侧菜单内容
        {activeName: 'Username', titleName: this.info.realName},
        {activeName: 'Logout', titleName: '退出登录', action: this.logout}
      ],
      activeRoute: ''
    }
  },
  computed: {
    ...mapState('common/user', [
      'info'
    ])
  },
  methods: {
    logout () {
      MessageBox.confirm('确定要注销当前用户吗', '注销用户', { type: 'warning' })
        .then(() => {
          cookies.remove('uid')
          LOGOUT().then(res => {
            if (res.code === 200) {
              // 清除token
              localStorage.removeItem('token')
              this.$router.push({ name: 'login' })
            } else {
              Message({
                message: '退出失败',
                type: 'error',
                duration: 5 * 1000
              })
            }
          })
        }).catch(() => {
          Message({ message: '取消注销操作' })
        })
    },
    toActiveMenuItem (item) { // 激活导航菜单
      if (item.activeUrl) {
        this.$router.push(item.activeUrl)
      } else if (item.action) {
        item.action()
      }
      this.dropDownShow = false
    }
  },
  watch: {
    // 检测路由变化加载菜单列表
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          this.activeRoute = matched[matched.length - 1].path
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "css/init.scss";
  @import "css/fade.scss";
  .header {
    color: $headerTextColor;
    background: $headerBg;
    height: $header-height;
    padding: 0 10%;
  }
  .header .container {
    width: 100%;
    height: 100%;
  }
  .header .container .container-left-ul {
    float: left;
  }
  .header .container .container-left-ul li {
    height: 100%;
    padding: 0 2px;
    line-height: $header-height;
    width: $header-li-width;
    display: inline-block;
    text-align: center;
  }
  .header .container .container-left-ul #icon {
    height: 30px;
    vertical-align: middle;
    transition: transform 0.5s;
  }
  .header .container .container-left-ul #icon:hover {
    transform: scale(1.5, 1.5) rotate(180deg);
  }
  .header .container .container-left-ul .container-left-li:hover {
    color: $menu-active-color;
    box-shadow: 0px -4px 0px $menu-active-color inset;
    cursor: pointer;
  }
  .header .container .container-right-ul {
    float: right;
  }
  .header .container .container-right-ul li {
    height: 100%;
    line-height: $header-height;
    width: $header-li-width;
    display: inline-block;
    text-align: center;
  }
  .header .container .container-right-ul .container-right-li:hover {
    color: $menu-active-color;
    box-shadow: 0px -4px 0px $menu-active-color inset;
    cursor: pointer;
  }
  .header .container .container-right-ul #bars > i {
    padding: 8px 14px;
    border: 1px $headerTextColor solid;
    border-radius: 5px;
  }
  .header .dropdown {
    border: 1px #f00 solid;
    width: 100%;
    background: $headerBg;
    position: absolute;
    z-index: 9999;
  }
  .header .dropdown li {
    height: 40px;
    line-height: 40px;
  }
  .header .dropdown li:hover {
    background: #000;
  }
  .menu-item-active {
    color: $menu-active-color;
    box-shadow: 0px -4px 0px $menu-active-color inset;
  }
  @media screen and (max-width: 992px) {
    .header {
      padding: 0;
    }
  }
  @media screen and (max-width: 768px) {
    .container-left-li {
      display: none !important;
    }
    .container-right-li {
      display: none !important;
    }
  }
  @media screen and (min-width: 768px) {
    #bars {
      display: none;
    }
    .dropdown {
      display: none;
    }
  }

</style>
