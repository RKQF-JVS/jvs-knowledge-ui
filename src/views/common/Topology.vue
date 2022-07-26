<template>
  <div class="home my-topology">
    <!-- 使用topology组件 -->
    <topology
      :data="content"
      id="previewFalse"
    />
  </div>
</template>

<script>
import Vue from 'vue';
// 导入topology-vue组件
import topology from 'topology-vue';
// 需要导入topology-vue.css
import 'topology-vue/topology-vue.css';
Vue.use(topology);
export default {
  name: 'Home',
  props: {
    content: {
      type: Object,
      default:()=>{
        return {};
      }
    }
  },
  data() {
    return {
      // content:{},
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    getVal(){
      return JSON.stringify(window.previewFalse.canvas.data)
    },
  },
};
</script>
<style lang="scss">
.home {
  height: 650px;
  width: 100%;
}
.le5le-topology .menus .back{
  display: none;
}
.le5le-topology .menus>div>div:first-child,.le5le-topology .menus>div>div:last-child{
  display: none;
}
.le5le-topology .menus>div{
  display: flex;
  justify-content: center!important;
}
.le5le-topology .materials .navs .nav-tab span:first-child{
  display: none;
}
.le5le-topology .materials .navs .nav-tab span:last-child{
  display: none;
}
.le5le-topology .file-settings .settings .tips>ul{
  margin-left: -20px;
}
.my-topology{
  .editor{
    .materials{
      .search, .navs{
        display: none;
      }
      .panels{
        height: 100%;
        padding-bottom: 0;
        .more-graphical{
          display: none;
        }
      }
    }
    .props{
      display: none;
    }
  }
}
</style>
