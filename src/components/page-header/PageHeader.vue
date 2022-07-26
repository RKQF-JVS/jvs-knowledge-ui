<template>
  <el-card :body-style="{padding: title ? '10px 0' : 0}" :class="{'header-top-open': show, 'header-top-close': !show}">
      <div :class="{'pageheader-top':true, 'pageheader-top-open': show}" v-if="title">
        <div class="pageheader-line" @click="openClose"></div>
        <span class="title" @click="openClose">{{title}}</span>
      </div>
      <slot></slot>
  </el-card>
</template>

<script>
export default {
  name: "PageHeader",
  props:{
    title: {
      type:String
    }
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    openClose () {
      let bool = this.show
      // this.show = !bool
   }
  }
};
</script>
<style lang="scss" scoped>
.pageheader-top{
    display: flex;
    justify-content: flex-start;
    align-items:center;
    .pageheader-line{
        width: 4px;
        height: 20px;
        background: #4B90EE;
        border-radius: 2px;
        cursor: pointer;
    }
    .title{
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 600;
        color: #222222;
        margin-left: 14PX;
        cursor: pointer;
    }
}
.header-top-close{
  height: 44px;
  .pageheader-line{
    width: 20px;
    height: 4px;
  }
}
</style>
