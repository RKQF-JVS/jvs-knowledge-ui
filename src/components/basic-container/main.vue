<template>
  <div :class="{'basic-container': true, 'basic-container--block':block}">
    <!-- <el-card> -->
      <slot></slot>
    <!-- </el-card> -->
  </div>
</template>

<script>
export default {
  name: "basicContainer",
  props: {
    block: {
      type: Boolean,
      default: false,
    }
  }
};
</script>

<style lang="scss">
.basic-container {
  // padding: 8px 10px;
  border-radius: 10px;
  box-sizing: border-box;
  height: 100%;
  .el-card {
    width: 100%;
    height: 100%;
    .el-card__body {
      height: 100%;
    }
  }
  &:first-child {
    padding-top: 0;
  }
  &--block {
    height: 100%;
    .el-card {
      height: 100%;
    }
  }
}
</style>
