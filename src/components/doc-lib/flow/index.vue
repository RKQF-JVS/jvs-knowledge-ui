<template>
  <div class="home">
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
          default:()=>{
              return {};
          }
      }
  },
  data() {
    return {

    };
  },
  created() {

  },
  mounted() {
      
  },
  methods: {
    getVal(){
        return JSON.stringify(window.previewFalse.canvas.data)
    },
  },
};
</script>
<style lang="css" scoped>
.home {
  height: 100%;
  width: 100%;
}
</style>
