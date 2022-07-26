<template>
  <div class="outer">
    <div id="map"></div>
  </div>
</template>

<script>
import MindElixir, { E } from "mind-elixir";
export default {
  name: "Map",
  props: {
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      mind:{},
      // content:'',
    };
  },
  mounted() {
    this.cj()
  },
  methods: {
    cj(){
      var options={
        locale: 'zh_CN',
        el: "#map",
        direction: MindElixir.SIDE,
        data: MindElixir.new('new topic'), // 也可以把 getDataAll 得到的数据初始化
        draggable: true, // 启用拖动 default true
        contextMenu: true, // 启用右键菜单 default true
        toolBar: true, // 启用工具栏 default true
        nodeMenu: true, // 启用节点菜单 default true
        keypress: true, // 启用快捷键 default true
      };
      if(this.content==''){
        this.mind = new MindElixir(options);
        this.mind.init()
        E("node-id");
        this.mind.bus.addListener('operation', operation => {
          if(this.mind.inputDiv){
            if(operation.obj.root){
              this.mind.inputDiv.style.marginTop = "10px"
              this.mind.inputDiv.style.outline = "3px solid #000"
            }else{
              this.mind.inputDiv.style.margin = 0
              this.mind.inputDiv.style.outline = "3px solid #000"
            }
          }
        })
      }else{
        this.mind = new MindElixir({
          ...options,
          data: this.content,
        });
        this.mind.init()
        E("node-id");
        this.mind.bus.addListener('operation', operation => {
          if(this.mind.inputDiv){
            if(operation.obj.root){
              this.mind.inputDiv.style.marginTop = "10px"
              this.mind.inputDiv.style.outline = "3px solid #000"
            }else{
              this.mind.inputDiv.style.margin = 0
              this.mind.inputDiv.style.outline = "3px solid #000"
            }
          }
        })
      }
    }
  }
};
</script>

<style  lang="scss">
.outer {
    position: relative;
    width: 100%;
    height: 650px;
}
#map {
    // height: 500px;
    width: 100%;
    height: 100%;
    overflow: auto;
}
.outer #map .lt{
  width: 40px;
}
</style>