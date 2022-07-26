<template>
  <div :class="{ 'title-page-header': true, 'header-top-open': show, 'header-top-close': !show }">
    <div :class="{ 'pageheader-top': true, 'pageheader-top-open': show }">
      <div class="left-box">
        <div class="pageheader-line" @click="openClose"></div>
        <span class="title" @click="openClose">{{ title }}</span>
        <slot name="left"></slot>
      </div>
      <div class="right-box">
        <slot name="right"></slot>
        <p v-if="hassave">
          <el-tooltip effect="dark" content="保存" placement="top">
            <i v-if="saveLoading" class="el-icon-loading" style="font-size:22px;color:#353535;"></i>
            <img v-else :src="saveIcon" alt="" @click="saveHandle">
          </el-tooltip>
        </p>
        <p v-if="hasclose" class="right-icon-close">
          <img :src="closeIcon" alt="" @click="closeHandle">
        </p>
      </div>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>

<script>
import saveicon from "@/const/img/保存.png"
import closeicon from "@/const/img/关闭.png"
export default {
  name: "PageHeader",
  props: {
    title: {
      type: String
    },
    hassave: {
      type: Boolean,
      default: true
    },
    hasclose: {
      type: Boolean,
      default: true
    },
    needLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: true,
      saveIcon: saveicon,
      closeIcon: closeicon,
      saveLoading: false,
      timer: null
    }
  },
  methods: {
    openClose () {
      let bool=this.show
      // this.show = !bool
    },
    saveHandle () {
      this.$emit("save", true)
      if(this.needLoading) {
        this.saveLoading = true
        if(this.timer) {
          clearTimeout(this.timer)
        }
        let _this =  this
        this.timer = setTimeout(() => {
          _this.saveLoading = false
        }, 2000)
      }
    },
    closeHandle () {
      this.$emit("close", true)
    }
  }
};
</script>
<style lang="scss" scoped>
.pageheader-top {
  display: flex;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .pageheader-line {
    width: 4px;
    height: 22px;
    background: #3471ff;
    border-radius: 2px;
    cursor: pointer;
    margin: 0 20px;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    font-family: SourceHanSansCN-Regular;
    color: #333333;
    cursor: pointer;
    margin-right: 20px;
  }
  .left-box, .right-box {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .right-box{
    p{
      margin: 0;
      padding: 0 17px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #DCDFE6;
      img{
        display: block;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    .right-icon-close{
      img{
        width: 18px;
        height: 18px;
      }
    }
    p:nth-last-of-type(1) {
      border-right: 0;
    }
  }
}
.header-top-close {
  height: 44px;
  .pageheader-line {
    width: 20px;
    height: 4px;
  }
}
</style>
<style lang="scss">
.title-page-header {
  height: 45px;
  margin-top: 8px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px 5px 0 0 ;
  display: flex;
  align-items: center;
}
*::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px #dcdfe6, 0.2;
  background: rgba(0,0,0,0.1);
}
*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px #dcdfe6, 0.2;
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
</style>
