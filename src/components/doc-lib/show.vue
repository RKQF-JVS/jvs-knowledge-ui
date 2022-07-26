<template>
  <div class="doc-lib-show preview-editor-context">
    <topology v-if="type == 'document_flow'" preview="true" :data="data" id="previewTrue" />
    <div v-if="type == 'document_html'" v-html="content"></div>
    <div class="outer1" v-if="type == 'document_map'">
      <div id="map1" style="width: 1000px; height: 500px"></div>
    </div>
    <div class="hello1" v-if="type == 'document_xlsx'">
      <div style="position: absolute; top: 0">
        <!-- <input style="font-size: 16px" type="file" @change="uploadExcel" /> -->
      </div>
      <div
        id="luckysheet1"
        style="
          margin: 0px;
          padding: 10px;
          position: absolute;
          width: 100%;
          left: 0px;
          top: 40px;
          bottom: 0px;
        "
      ></div>

      <div
        v-show="isMaskShow1"
        style="
          position: absolute;
          z-index: 1000000;
          left: 0px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          background: rgba(255, 255, 255, 0.8);
          text-align: center;
          font-size: 40px;
          align-items: center;
          justify-content: center;
          display: flex;
        "
      >
        Downloading
      </div>
    </div>
  </div>
</template>
<script>
import MindElixir, { E } from "mind-elixir";
import Vue from 'vue';
import Topology from 'topology-vue';
Vue.use(Topology);
export default {
  props: {
    type: {
      type: String
    },
    content: {
      // type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    this.cj();
  },
  data() {
    return {
      isMaskShow1: false,
      data:{}
    }
  },
   methods: {
    cj() {
      switch (this.type) {
        case 'document_xlsx':
            var options={
            container: "luckysheet1", //容器的ID
            title: "bi", // 工作簿名称
            lang: "zh", // 设定表格语言 国际化设置，允许设置表格的语言，支持中文("zh")和英文("en")
            allowCopy: false, // 是否允许拷贝
            showtoolbar: false, // 是否显示工具栏
            showinfobar: false, // 是否显示顶部信息栏
            showsheetbar: false, // 是否显示底部sheet页按钮
            showstatisticBar: false, // 是否显示底部计数栏
            sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
            allowEdit: false, // 是否允许前台编辑
            enableAddRow: false, // 允许增加行
            enableAddCol: false, // 允许增加列
            userInfo: false, // 右上角的用户信息展示样式
            showRowBar: false, // 是否显示行号区域
            showColumnBar: false, // 是否显示列号区域
            sheetFormulaBar: false, // 是否显示公式栏
            enableAddBackTop: true,//返回头部按钮
            rowHeaderWidth: 0,//纵坐标
            columnHeaderHeight: 0,//横坐标
            showstatisticBarConfig: {
              count:false,
              view:false,
              zoom:false,
            },
            showsheetbarConfig: {
              add: false, //新增sheet
              menu: false, //sheet管理菜单
              sheet: true, //sheet页显示
            },
            hook: {
              cellMousedown:this.cellMousedown,//绑定鼠标事件
            },
            forceCalculation: false,//强制计算公式
          }
          if(this.content==''){
            luckysheet.create(options);
          }else{
            luckysheet.create({
              ...options,
              data: this.content,
            });
          }
          break;
          case 'document_map':
            var options={
              locale: 'zh_CN',
              el: "#map1",
              direction: MindElixir.SIDE,
              draggable: false, // 启用拖动 default true
              contextMenu: false, // 启用右键菜单 default true
              toolBar: false, // 启用工具栏 default true
              nodeMenu: false, // 启用节点菜单 default true
              keypress: false, // 启用快捷键 default true
              editable: false
            }
            if(this.content==''){
              let mind = new MindElixir(options);
              mind.init()
              E("node-id");
            }else{
              let mind = new MindElixir({
                ...options,
                data: MindElixir.new('new topic'),
                data: this.content,
              });
              mind.init()
              E("node-id");
            }
          break;
          case 'document_flow':
            this.data=this.content
          break;
        default:
          break;
      }
    },
  },
}
</script>
<style lang="scss" scoped>
/* table 样式 */
.preview-editor-context {
  height: 100%;
  padding-top:20px;
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
   
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
    height: 29px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
    background-color: rgb(241,241,241);
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul, ol {
    margin: 10px 0 10px 20px;
  }
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.outer1 {
  position: relative;
  width: 100%;
  height: 100%;
  // margin: 50px;
}
#map1 {
  height: 100%!important;
  width: 100%!important;
  overflow: auto;
}
</style>