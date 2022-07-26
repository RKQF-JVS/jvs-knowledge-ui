<template>
  <div class="jvs-loading">
    <div class="content">
      <div class="img-box"></div>
      <div class="title">
        正在加载
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'jvs-loading',
  data(){
    return {}
  }
}
</script>
<style lang="scss" scoped>
.jvs-loading{
  position: relative;
  width: 100%;
  height: 100%;
  .content{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    .img-box{
      background: url('../../../public/jvs-ui-public/img/loading.png');  
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      width: 20px;
      height: 20px;
      -webkit-animation: animal 1s infinite linear ;
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center;
    }
    @-webkit-keyframes animal {
      0%{
        transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
      }
      100%{
        transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
      }
    }
    .title{
      text-align: center;
    }
  }
}
</style>