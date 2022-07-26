<template>
  <div id="app">
    <div class="basic-cont-box">
      <router-view />
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import {sendRouter, getToken} from '@/api/index'
  // constants
  import * as globalTypes from '@/store/types/global'
  import icoImg from '@/styles/titleMg.png'
  export default {
    name: 'app',
    data() {
      return {
        icoImgURL: icoImg
      }
    },
    watch: {},
    created() {
      let routerList = JSON.parse(sessionStorage.getItem('routerList'))
      // sendRouter(routerList) // 先暂时屏蔽发送本地路由
      var link = document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = this.icoImgURL
      document.getElementsByTagName('head')[0].appendChild(link);
    },
    methods: {},
    computed: {}
  }
</script>
<style lang="scss">
  #app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  ul, li {
    list-style: none;
  }
  .basic-cont-box{
    // padding: 8px 10px;
    position: relative;
    height: 100%;
    box-sizing: border-box;
  }
</style>
<style lang="scss" scoped>
  .theme-text{
    position: fixed;
    right: 0;
    top: 50%;
    z-index: 9999999999999;
  }
  .theme-box {
    width: 100%;
    height: 100%;
  }
</style>
