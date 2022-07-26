<template>
  <div class="el-tiptap-editor__wrapper" v-if="type == 'document_html'" ref="paste" @paste.stop.prevent="pasteImg($event)" @click="onFocus">
    <el-tiptap
      height="100%"
      ref="myhtml"
      lang="zh"
      :charCounterCount="false"
      :extensions="extensions"
      :content="content"
      @onUpdate="onUpdate"
      :spellcheck="false"
      :menu-bubble-options="{ 'keep-in-bounds': false }"
      placeholder="请输入内容"
    />
    <div v-if="catalog.length > 0" :class="{'catalog-list': true, 'catalog-list-close': !openCatalog}">
<!--      <el-tooltip v-if="openCatalog" class="catalog-tooltip" effect="dark" content="收起索引" placement="right">-->
<!--        <i class="el-icon-d-arrow-right" @click="openClose(false)"></i>-->
<!--      </el-tooltip>-->
<!--      <el-tooltip v-if="!openCatalog" class="catalog-tooltip" effect="dark" content="展开索引" placement="right">-->
<!--        <i class="el-icon-d-arrow-left" @click="openClose(true)"></i>-->
<!--      </el-tooltip>-->
<!--      <ul class="catalog" v-if="openCatalog">-->
<!--        <template v-for="(item, index) in catalog">-->
<!--          <li :class="('catalog-item'+item.level) + (index==num ? ' active': '')" :key="index" :style="{ paddingLeft: item.level * 22 + 'px' }" @click="num=index">-->
<!--            <a-->
<!--              :href="'#' + item.id"-->
<!--              :style="{color:(item.level==1?'#333333':'#868BA1') }"-->
<!--              >{{ item.title }}</a-->
<!--            >-->
<!--          </li>-->
<!--        </template>-->
<!--      </ul>-->
      <ul class="catalog">
        <template v-for="(item, index) in catalog">
          <li :class="('catalog-item'+item.level) + (index==num ? ' active': '')" :key="index" :style="{ paddingLeft: item.level * 22 + 'px' }" @click="num=index">
            <a
              :href="'#' + item.id"
              :style="{color:(item.level==1?'#333333':'#868BA1') }"
              >{{ item.title }}</a
            >
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
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
import "@/styles/tiptap.scss";
import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'; // import base style
import store from "@/store"; // progress bar style
import 'codemirror/mode/xml/xml.js'; // language
import 'codemirror/addon/selection/active-line.js'; // require active-line.js
import 'codemirror/addon/edit/closetag.js'; // autoCloseTags
import {myHeading, myFontSize} from './tiptap/extension'

export default {
    props: {
    content: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data () {
    return {
      num:9999,
      catalog:[],
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
        // new FontSize(),
        new myFontSize({ bubble: true }),
        new TextColor({ bubble: true }),
        new TextHighlight({ bubble: true }),
        new FormatClear(),
        new myHeading({ level: 5,bubble: true }),
        // new Heading({ level: 5,bubble: true }),
        new ListItem(),
        new BulletList({ bubble: true }),
        new OrderedList({ bubble: true }),
        new TodoItem(),
        new TodoList({ bubble: true }),
        new TextAlign(),
        new LineHeight({ bubble: true }),
        new Indent(),
        new Blockquote(),
        new CodeBlock(),
        new Link(),
        new Image({
          uploadRequest(file) {
            const fd = new FormData()
            fd.append('file', file)
            return $.ajax({
              url : '/mgr/document//upload/jvs-public',
              type : 'POST',
              data : fd,
              headers: {
                "Authorization" : 'Bearer ' + store.getters.access_token
              },
              // 用于对data参数进行序列化处理 这里必须false
              processData : false,
              // 不去设置Content-Type请求头
              contentType : false, //必须
              beforeSend:function(){},
              success : function(result) {},
              error : function(res) {
                console.log("error");
              }
            }).then(result => {
              if(result.code == 0 && result.data && result.data.fileLink) {
                // let url = result.data.filelink.indexOf('?') ? result.data.filelink.split('?')[0] : result.data.filelink
                return result.data.fileLink
              }else{
                console.log("失败");
              }
            })
          }
        }),
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
      html: "",
      type: "document_html",
      openCatalog: true
    };
  },
  methods: {
    onUpdate(output, options) {
      const { getHTML,getJSON } = options;
      this.html = getHTML();
      this.hTree()
      this.$emit("contetnChange", this.html);
    },
    // 去除空白悬浮工具栏显示
    onFocus (e) {
      let tooltipList = $('.el-tiptap-editor__menu-bubble')
      if(tooltipList.length > 0) {
        for(let i in tooltipList) {
          if(tooltipList[i].style) {
            if(!tooltipList[i].children || tooltipList[i].children.length == 0) {
              tooltipList[i].style.display = "none"
            }else{
              tooltipList[i].style.display = "flex"
            }
          }
        }
      }
    },
    hTree(){
      const article_content = document.querySelector(".ProseMirror")
      const nodes = ["H1", "H2"];
      let titles = [];
      if(article_content) {
        article_content.childNodes.forEach((e, index) => {
          if (nodes.includes(e.nodeName) && e.innerText.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')) {
            titles.push({
              title: e.innerText,
              level: Number(e.nodeName.substring(1, 2)),
              nodeName: e.nodeName,
              id: e.id
            });
          }
        });
      }
      this.catalog = titles;
    },
    pasteImage (url) {
      let editor = this.$refs.myhtml.editor
      let view = editor.view
      const node = view.state.schema.nodes.image.create({
        src: url,
        width: null
      });
      const transaction = view.state.tr.replaceSelectionWith(node);
      view.dispatch(transaction)
    },
    pasteImg(e) {
      const cbd = e.clipboardData;
	    const ua = window.navigator.userAgent;
	    // 如果是 Safari 直接 return
	    if ( !(e.clipboardData && e.clipboardData.items) ) {
	      return ;
	    }
	    if(cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
        cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
        ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49){
        return;
	    }
	    for(let i = 0; i < cbd.items.length; i++) {
        let item = cbd.items[i];
        if (item.kind == 'string') {
          return;
        }
        if(item.kind == "file"){
          // blob 就是从剪切板获得的文件，可以进行上传或其他操作
          const blob = item.getAsFile();
          // console.log(blob)
          if (blob.size === 0) {
            return;
          }
          const fd = new FormData()
          fd.append('file', blob)
          $.ajax({
            url : '/mgr/document//upload/jvs-public',
            type : 'POST',
            data : fd,
            headers: {
              "Authorization" : 'Bearer ' + store.getters.access_token
            },
            // 用于对data参数进行序列化处理 这里必须false
            processData : false,
            // 不去设置Content-Type请求头
            contentType : false, //必须
            beforeSend:function(){},
            success : function(result) {},
            error : function(res) {
              console.log("error");
            }
          }).then(result => {
            if(result.code == 0 && result.data && result.data.fileLink) {
              // let url = result.data.filelink.indexOf('?') ? result.data.filelink.split('?')[0] : result.data.filelink
              this.pasteImage(result.data.fileLink);
            }else{
              console.log("失败");
            }
          })
        }
      }
    },
    openClose (bool) {
      this.openCatalog = bool
    }
  },
  created(){
    setTimeout(() => {
      this.hTree()
    }, 100)
  },
};
</script>
<style lang="scss" scoped>
.catalog-list {
  width: 200px;
  position: fixed;
  top: 130px;
  right: 50px;
  background: #fff;
  .catalog{
    padding-left: 0;
    width: 100%;
    font-size: 14px;
  }
  .catalog li{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    list-style: inside;
  }
  .catalog .catalog-item2{
    color: #868ba1;
  }
  .catalog li a{
    color: #333333;
  }
  .catalog li:hover a{
    // background: #ebedef;
    color: #007fff!important;
  }
  .catalog .active,.catalog .active a{
    // background: #ebedef;
    color: #007fff!important;
    outline:none
  }
}
.catalog-list-close{
  width: 20px;
}
.el-tiptap-editor__wrapper {
  display: flex;
  flex-wrap:nowrap;
  justify-content:space-between;
  min-height: 650px;
  width: 100%;
  padding: 35px 120px;
  position: relative;
  ::v-deep.el-tiptap-editor{
    min-height: 650px;
    width: 78%;
    .el-tiptap-editor__content li>p:first-child:before{
      width: 30px;
    }
  }
}
.catalog-tooltip{
  font-size: 20px;
  cursor: pointer;
  float: right;
}
</style>

