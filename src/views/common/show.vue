<template>
  <div class="doc-lib-show preview-editor-context">
    <topology v-if="type == 'document_flow'" preview="true" :data="data" id="previewTrue" style="height:650px" />
    <!-- <div class="htmShow" v-if="type == 'document_html'" v-html="content"></div> -->
    <div class="htmShow" v-if="type == 'document_html'">
      <el-tiptap
        height="100%"
        lang="zh"
        :readonly="true"
        :charCounterCount="false"
        :extensions="extensions"
        :content="tipcont"
        :spellcheck="false"
        :menu-bubble-options="{ 'keep-in-bounds': false }"
      />
      <ul class="catalog">
        <template v-for="(item, index) in catalog">
          <li :key="index" :style="{ paddingLeft: item.level * 22 + 'px' }" @click="num=index" :class="index==num?'active':''">
            <a
              :href="'#' + item.id"
              :style="{color:(item.level==1?'#333333':'#868BA1') }"
              >{{ item.title }}</a
            >
          </li>
        </template>
      </ul>
    </div>
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
          padding: 0px;
          position: absolute;
          width: 100%;
          height:650px;
          left: 0px;
          top: 0px;
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
import "@/styles/tiptapView.scss";
import MindElixir, { E } from "mind-elixir";
import Vue from 'vue';
import Topology from 'topology-vue';
Vue.use(Topology);
import {
  Doc,
  Text,
  Paragraph,
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  FontType,
  FontSize,
  TextColor,
  TextHighlight,
  FormatClear,
  Heading,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  LineHeight,
  Indent,
  Blockquote,
  CodeBlock,
  Link,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Iframe,
  TrailingNode,
  HorizontalRule,
  Fullscreen,
  Print,
  Preview,
  SelectAll,
  History,
  CodeView,
} from 'element-tiptap';

import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'; // import base style
import 'codemirror/mode/xml/xml.js'; // language
import 'codemirror/addon/selection/active-line.js'; // require active-line.js
import 'codemirror/addon/edit/closetag.js'; // autoCloseTags
import {myHeading} from './tiptap/extension'
export default {
  props: {
    type: {
      type: String
    },
    excelcont: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tipcont: {
      type: String,
      default: () => {
        return "";
      },
    },
    content: {
      type: Object,
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
      catalog:[],
      num:9999,
      isMaskShow1: false,
      data:{},
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Bold({ bubble: true }),
        new Underline({ bubble: true }),
        new Italic({ bubble: true }),
        new Strike({ bubble: true }),
        new Code(),
        new FontType(),
        new FontSize(),
        new TextColor({ bubble: true }),
        new TextHighlight({ bubble: true }),
        new FormatClear(),
        new myHeading({ level: 5,bubble: true }),
        // new Heading({ level: 5 }),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new TextAlign(),
        new LineHeight(),
        new Indent(),
        new Blockquote(),
        new CodeBlock(),
        new Link(),
        new Image(),
        new Iframe(),
        new Table({ resizable: true }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new HorizontalRule(),
        new Print(),
        new Preview(),
        new SelectAll(),
        new Fullscreen(),
        new CodeView({
          codemirror,
          codemirrorOptions: {
            styleActiveLine: true,
            autoCloseTags: true,
          },
        }),
        new TrailingNode(),
        new History(),
      ],
    }
  },
   methods: {
     hTree(){
      const article_content = document.querySelector(".ProseMirror")
      const nodes = ["H1", "H2"];
      let titles = [];
      article_content.childNodes.forEach((e, index) => {
        if (nodes.includes(e.nodeName)) {
          titles.push({
            title: e.innerText, //innerHTML,
            level: Number(e.nodeName.substring(1, 2)),
            nodeName: e.nodeName,
            id: e.id
          });
        }
      });
      this.catalog = titles;
    },
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
          if(this.excelcont==''){
            luckysheet.create(options);
          }else{
            luckysheet.create({
              ...options,
              data: this.excelcont,
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
  created(){
    setTimeout(() => {
      this.hTree()
    }, 100)
  },
}
</script>
<style lang="scss" scoped>
.catalog{
  padding-left: 0;
  width: 18%;
  height: 100px;
  position: sticky;
  top: 10px;
  font-size: 14px;

}
.catalog li{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.catalog li a{
  color: #333333;
}
.catalog li:hover{
  //background: #ebedef;
}
.catalog .active,.catalog .active a{
  //background: #ebedef;
  color: #007fff!important;
  outline:none
}
.htmShow {
  display: flex;
  flex-wrap:nowrap;
  justify-content:space-between;
  min-height: 650px;
  width: 100%;
  padding: 35px 120px;
  position: relative;
  .el-tiptap-editor{
    min-height: 650px;
    width: 78%;
  }
}
.hello1{
  min-height: 650px;
}
/* table 样式 */
.preview-editor-context {
  height: 100%;
  // overflow: hidden;
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
  height: 650px;
}
#map1 {
  height: 100%!important;
  width: 100%!important;
  overflow: auto;
  margin-right: 0;
}
.outer1 #map1 .lt{
  width: 40px;
}
</style>
